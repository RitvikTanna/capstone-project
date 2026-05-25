import axios from "axios";
import { create } from "zustand";

export const useAuth = create((set) => ({

  isAuthenticated: false,
  currentUser: null,
  loading: false,
  error: null,

  // LOGIN
  login: async (userCredWithRole) => {

    const { role, ...userCredObj } = userCredWithRole;

    try {

      set({
        loading: true,
        error: null
      });

      const res = await axios.post(
        "/common-api/login",
        userCredObj,
        {
          withCredentials: true
        }
      );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        error: null
      });

    } catch (err) {

      console.error("LOGIN ERROR:", err);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Login failed"
      });

    }

  },

  // LOGOUT
  logout: () => {

    set({
      isAuthenticated: false,
      currentUser: null,
      loading: false,
      error: null
    });

  },

  // CHECK AUTH
  checkAuth: async () => {

    try {

      set({
        loading: true
      });

      const res = await axios.get(
        "/common-api/check-auth",
        {
          withCredentials: true,
          timeout: 5000
        }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      });

    } catch (err) {

      if (err.response?.status === 401) {

        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });

        return;

      }

      if (!err.response) {

        console.error("Network Error");

        set({
          loading: false,
          error: "Unable to connect to server",
          isAuthenticated: false
        });

        return;

      }

      console.error("Auth check failed:", err);

      set({
        loading: false,
        error: err.response?.data?.message || "Auth check failed"
      });

    }

  }

}));