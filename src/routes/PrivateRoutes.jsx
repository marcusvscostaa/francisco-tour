import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from 'axios';
import {getCurrentUser} from "../FranciscoTourService";


import { AuthContext } from "../context/AuthContext";
import { use } from "react";
import Login from "../pages/Login";
import Sidebar from "../components/Sidebar";

export const PrivateRoute = () => {
  

  const [user, setUser] = useState(getCurrentUser());
  const [updatePage, setUpdatePage] = useState(false)
  useEffect(() => {
    getCurrentUser().then(
        data => {
            if(data.fatal || data.code){
              setUser(false);
                setUpdatePage(true)
              
            }else{
              setUser(data.auth)
                setUpdatePage(true)
            }    
        }
        ).catch((error) => console.log(error));
    console.log();
  },[])
  const { signed } = useContext(AuthContext);
  console.log("Private: ",user);
  return(updatePage ? (user ? <Outlet />:<Login />):        
    <div id="wrapper">
          <Sidebar 
          painel="nav-item"
          financeiro="nav-item" 
          reservas="nav-item"  
          agendaReserva="nav-item" 
          reservasShow="collapse" 
          novaReserva="collapse-item" 
          minhaReserva="collapse-item"
          comissoes="collapse-item" 
          configuracoes="collapse-item" 
          tabelaCliente="nav-item"
          usuarios="nav-item"
          nomePagina="Carregando..."/>
      </div> );
};