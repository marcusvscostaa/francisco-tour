import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from 'axios';
import {getCurrentUser} from "../FranciscoTourService";


import { AuthContext } from "../context/AuthContext";
import { use } from "react";
import Login from "../pages/Login";
import Sidebar from "../components/Sidebar";

export const PrivateRoute = (props) => {
  

  const [user, setUser] = useState(getCurrentUser());
  const [updatePage, setUpdatePage] = useState(false)
  useEffect(() => {
    
    console.log();
  },[])
  console.log("Private: ",user);
  return( (props.user && <Outlet />) );
};