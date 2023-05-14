import React from 'react';
import classes from '../css/RegistrationForm.module.css'

function RegistrationForm({onChange}) {
    return (
        <div className={classes["enter-form"]}>
        <div className={classes["head-form"]}>
            <div className={classes["enter"]} onClick={() => onChange(1)}>Вход</div>
            <div className={classes["registr"]} onClick={() => onChange(2)}>Регистрация</div>
            <img className={classes["cross"]} onClick={() => onChange(0)} src={require("../../../images/cross.svg").default} width="18.23" height="20.01" alt="крестик"/>
        </div>
        <hr/>
        <div className={classes["fields"]}>
            <input type="text" className="inp" placeholder="Имя*"/>
            <input type="text" className="inp" placeholder="Фамилия*"/>
            <input type="text" className="inp" placeholder="Отчество"/>
            <input type="text" className="inp" placeholder="Email*"/>
            <input type="text" className="inp" placeholder="Пароль*"/>
        </div>
        <div className={classes["button"]}>
            <button className={classes["enter-button"]}>Зарегестрироваться</button>
        </div>
    </div>
    );
}

export default RegistrationForm;