import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const RoleBasedRoute = ({ allowedRoles }) => {
  const { userRole, isAuthenticated, isLoading } = useAuth(); 

  if (isLoading) {
      return <div>Carregando Permissões...</div>; 
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }
  
  if (allowedRoles.includes(userRole)) {
    return <Outlet />; 
  } else {
    return <Navigate to="/*" replace />; 
  }
};