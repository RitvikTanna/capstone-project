import { useEffect } from "react";
import Header from "./Header"
import { Outlet } from "react-router-dom"
import { useAuth } from "../authStore.js/Store";

function RootLayout() {

  const checkAuth=useAuth(state=>state.checkAuth);
  const loading=useAuth(state=>state.loading);

  useEffect(()=>{
    checkAuth();
  },[])
  return (
    <div>

      <Header />

      {/* Page content will load here */}
      <Outlet />

    </div>
  )
}

export default RootLayout