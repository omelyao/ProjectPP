import React from 'react';
import { Route } from 'react-router-dom';

function LoginRoute({children, ...props}) {
    return (
        <Route {...props}>{children}</Route>
    );
}

export default LoginRoute;