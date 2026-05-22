import { Children } from "react";
import { useAuth } from "../authStore.js/Store"
import { Navigate } from "react-router-dom";


function ProtectedRoute({children,allowedRoles}) {
    //get user login status from store
    const {loading,currentUser,isAuthencitaed}=useAuth();
    const logout=useAuth(state=>state.logout)

    //loading state
    if(loading){
        return <p>Loading</p>
    }

    //if user not logging
    if(isAuthencitaed){
        //redirect to login 
        return <Navigate to="/login" replace/>
    }
    //check roles
    
    if(allowedRoles && !allowedRoles.includes(currentUser?.role)){
        //logout
        
        //redirect to login
        return <Navigate to="/login" replace/>
    }


    
  return children;
}

export default ProtectedRoute
