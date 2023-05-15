import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

function PrivateRoute({children, ...props}) {
    const {user} = useSelector(state => state.auth);
    if (!user){
        return;
    }

    return (
        <Route {...props}>{children} </Route>
    );
};

export default PrivateRoute;