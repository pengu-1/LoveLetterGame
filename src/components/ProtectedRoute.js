import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../AuthContext';

function ProtectedRoute(props) {
  const token = React.useContext(AuthContext);
  if (!token) {
    return <Redirect to="/createuser" />
  }
  return <Route {...props} />;
}

export default ProtectedRoute;
