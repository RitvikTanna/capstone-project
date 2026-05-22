import axios from "axios";
import { create } from "zustand";

export const useAuth = create((set) => ({

  isAuthenticated: false,
  currentUser: null,
  loading: false,
  error: null,

  login: async (userCredWithRole) => {

    const { role, ...userCredObj } = userCredWithRole;

    try {

      set({
        loading: true,
        error: null
      });

      // ✅ CHECKING API URL
      console.log("API URL:", import.meta.env.VITE_API_URL);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/common-api/login`,
        userCredObj,
        {
          withCredentials: true
        }
      );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload
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

  logout: () => {

    set({
      isAuthenticated: false,
      currentUser: null,
      loading: false,
      error: null
    });
  },

  // ✅ CHECK AUTH
  checkAuth: async () => {

    try {

      set({
        loading: true
      });

      console.log("CHECK AUTH API:", import.meta.env.VITE_API_URL);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/common-api/check-auth`,
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

      // Unauthorized
      if (err.response?.status === 401) {

        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });

        return;
      }

      // Network/server issue
      if (!err.response) {

        console.error(
          "Network Error: Backend may not be running at",
          import.meta.env.VITE_API_URL
        );

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