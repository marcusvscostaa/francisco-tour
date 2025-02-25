import React from 'react';
import { Route, Navigate  } from 'react-router-dom';
import AuthService from './AuthService';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = AuthService.getCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Navigate  to="/login" />
      }
    />
  );
};

export default ProtectedRoute;