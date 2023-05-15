import React from 'react';
import classes from "../css/Form.module.css"
import AuthForm from './AuthForm';
import RegistrationForm from './RegistrationForm';
import { Modal } from '@mui/material';
function Form({onChange, form}) {

    if (form === 0)
    return<></>;

    return (
        <Modal  disableEnforceFocus  open={form !== 0} onClose={() => onChange(0)}
>
        <div className={classes["enter-form"]}>
        <div className={classes["head-form"]}>
            <div className={`${classes["enter"]} ${form === 1 && classes["selected"]}`} onClick={() => onChange(1)}>Вход</div>
            <div className={`${classes["registr"]} ${form === 2 && classes["selected"]}`} onClick={() => onChange(2)}>Регистрация</div>
            <img className={classes["cross"]} onClick={() => onChange(0)} src={require("../../../images/cross.svg").default} width="21.87" height="24" alt="крестик"/>
        </div>

        {form === 1 &&<AuthForm/>}
        {form ===2 && <RegistrationForm onChange={onChange}/>}


        {/* <div>
        <hr/>
            <form className={classes["fields"]}>
            <input type="text" className="inp" placeholder="Имя*"/>
            <input type="text" className="inp" placeholder="Фамилия*"/>
            <input type="text" className="inp" placeholder="Отчество"/>
            <input type="text" className="inp" placeholder="Email*"/>
            <input type="text" className="inp" placeholder="Пароль*"/>
            <input type="text" className="inp" placeholder="Пароль*2"/>
            </form>

        <div className={classes["button"]}>
            <button className={classes["enter-button"]}>Зарегестрироваться</button>
        </div>
        </div> */}
    </div>
    </Modal>
    );
}

export default Form;