import React, {useState} from "react";
import FormResetHeader from "./FormResetHeader";
import classes from "../css/Form.module.css";
import {NavLink} from "react-router-dom";

const PasswordReset = ({onChange, form}) => {
    const [resetPassword, setResetPassword] = useState({
        'password': '',
        'password2': '',
        'token': ''
    });

    const resetPass = async () => {

    }

    return (
        <div className={classes["enter-form"]}>
            <div className={classes["head-form"]}>
                <FormResetHeader />
                <NavLink to='/login'>
                    <img className={classes["cross"]} src={require("../../../images/cross.svg").default} width="21.87" height="24" alt="крестик"/>
                </NavLink>
            </div>
            <hr/>
            <div className={classes["fields"]}>
                <div className={classes["password-reset"]}>Введите новый пароль:</div>
                <input type="password" value={resetPassword.password} onChange={e => setResetPassword({...resetPassword, password: e.target.value})} placeholder="Пароль"/>
            </div>
            <div className={classes["fields"]}>
                <div className={classes["password-reset"]}>Введите новый пароль ещё раз:</div>
                <input type="password" value={resetPassword.password2} onChange={e => setResetPassword({...resetPassword, password2: e.target.value})} placeholder="Подтверждение пароля"/>
            </div>
            <div className={classes["fields"]}>
                <div className={classes["password-reset"]}>Введите ваш уникальный token:</div>
                <input type="password" value={resetPassword.token} onChange={e => setResetPassword({...resetPassword, token: e.target.value})} placeholder="Введите token"/>
            </div>
            <div className={classes["button"]}>
                <button className={classes["enter-button"]}>Подтвердить изменения</button>
            </div>
        </div>
    )
}

export default PasswordReset;