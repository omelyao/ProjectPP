import React, { useState } from 'react';
import classes from "./css/WelcomePage.module.css"
import Form from './components/Form';
import Footer from '../../Components/Footer';

function WelcomePage(props) {
    const [state1, setState1] = useState(0);
    
    return (
    <div>
        <Form onChange={setState1} form={state1}/>
        <main className={classes["main"]}>    
            <h2 className={classes["welcome-phrase"]}>Добро пожаловать!</h2>
            <div className={classes["content"]}>
                <div className={classes["welcome-content"]}>
                    <img src={require("../../images/logo_big.png")} width="453" height="358" alt="Логотип"/>
                    <p> Личный кабинет uralintern.ru - средство учёта и контроля,
                        позволяющее отслеживать и оценивать вклад каждого участника в командный проект,
                        выполняемый во время прохождения стажировки.
                    </p>
                </div>
            </div>
            <div className={classes["buttons"]}>
                <button className={classes["reg"]} onClick={() =>setState1(2)}>Регистрация</button>
                <button className={classes["aut"]} onClick={() =>setState1(1)}>Войти</button>
            </div>
        </main>
        <Footer/>
    </div>
    );
}

export default WelcomePage;