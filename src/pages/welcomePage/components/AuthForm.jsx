import React, { useState } from 'react';
import classes from "../css/AuthForm.module.css"
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../../redux/authApi';
import { setCredentials } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function AuthForm({onChange}) {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, {isLoading}] = useLoginMutation()
    const handle = async () => {
        const data = await login({email, password});
        dispatch(setCredentials({...data.data}));
        setEmail("");
        setPassword("");
        navigate("/private");
    }
    return (
        <div className={classes["enter-form"]}>
        <div className={classes["head-form"]}>
            <div className={classes["enter"]} onClick={() => onChange(1)}>Вход</div>
            <div className={classes["registr"]} onClick={() => onChange(2)}>Регистрация</div>
            <img className={classes["cross"]} onClick={() => onChange(0)} src={require("../../../images/cross.svg").default} width="18.23" height="20.01" alt="крестик"/>
        </div>
        <hr/>
        <div className={classes["fields"]}>
            <input type="text" className={classes["inp"]} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Почта"/>
            <input type="text" className={classes["inp"]}  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль"/>
        </div>
        <div className={classes["button"]}>
            <button className={classes["enter-button"]} onClick={handle}>Войти</button>
        </div>
    </div>
    );
}

export default AuthForm;