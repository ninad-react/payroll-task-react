import React from 'react'
import { getToken } from '../utility/utils'
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {

    const isAuthenticated = getToken() !== null;

    if(isAuthenticated) {
        return <Navigate to="/" />
    }

    return children;
}

export default PublicRoute;