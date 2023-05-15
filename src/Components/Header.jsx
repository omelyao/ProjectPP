import React, { useState } from 'react';
import classes from '../css/Header.module.css'
import Navigation from './Navigation';

function Header(props) {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <header className={classes["main-header"]}>
            <img className={classes['nav-icon']} onClick={() => setOpen(!open)}   src={require("../images/nav-icon.svg").default} width="24" height="24" alt="Иконка навигации"/>
            <img className={classes['small-logo']} src={require("../images/logo_small.svg").default} width="48" height="48.18" alt="Логотип"/>
            <div className={classes["profile"]}>
                <img src={require("../images/profile.svg").default} width="24" height="24" alt="Мой профиль"/>
                <p>Мой Профиль</p>
            </div>
            <img className={classes['settings-icon']} src={require("../images/settings-icon.svg").default} width="32" height="32" alt="Логотип"/>
            <div className={classes["exit"]}>
                <img src={require("../images/exit.svg").default} width="24" height="24" alt="Выйти"/>
                <p>Выйти</p>
            </div>
        </header>
        <Navigation open={open}/>
    </div>
    );
}

export default Header;