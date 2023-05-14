import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken, setCredentials } from '../redux/authSlice';
import { useGetUserQuery } from '../redux/authApi';

function Temp(props) {
    const refresh = localStorage.getItem('refresh');
    const dispatch = useDispatch();
    const {data, isLoading} = useGetUserQuery();
    const rerfs = async() =>{
        const a = refreshToken(refresh)
        console.log(a)
        const b = await a;
        console.log(b)
        dispatch(setCredentials(b.data));
    }


    if (!refresh) return <div>pishov v pisdu</div>
    if (isLoading) return <div>AWWWWAIIT</div>
    console.log(data);
    return (
        <div>
            WELCOME TO MY BROTHER
        </div>
    );
}

export default Temp;