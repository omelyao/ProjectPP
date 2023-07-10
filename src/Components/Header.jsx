import React, { useState } from 'react';
import classes from '../css/Header.module.css'
import Navigation from './Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../redux/authSlice';
import { reset } from '../redux/authApi';

function Header({ modalIsOpen }) {

    const [open, setOpen] = useState(true);
    const {user} = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    if(!user){
        return (
        <header className={classes["main-header"]}>
        <img className={classes['small-logo']}
            src={require("../images/logo_small.svg").default}
            width="48" height="48.18"
            alt="Логотип"
        />
    </header>)
    }

    const out = () =>{
        dispatch(reset());
        dispatch(logOut());
    }
    return (
        <div>
            <header className={`${classes["main-header"]}`}>
            <img className={classes['nav-icon']}
                onClick={() => setOpen(!open)}
                src={require("../images/nav-icon.svg").default}
                width="24" height="24"
                alt="Иконка навигации"
            />

            <img className={classes['small-logo']}
                src={require("../images/logo_small.svg").default}
                width="48" height="48.18"
                alt="Логотип"
            />
                <div className={classes['navigates']}>
                    <div className={classes["profile"]} onClick={() => navigate(`/user/${user.user_id}`)}>
                        <img
                            src={require("../images/profile.svg").default}
                            width="24" height="24" alt="Мой профиль"
                        />
                        <p>Мой Профиль</p>
                    </div>
                    <div className={classes["kanban"]} onClick={() => navigate(`/kanban`)}>
                        <img
                            onClick={() => setOpen(open)}
                            src={require("../assets/img/KanbanHeader.svg").default}
                            width="24" height="24" alt="Мой профиль"
                        />
                        <p>Канбан</p>
                    </div>
                    <div className={classes["gantt"]} onClick={() => navigate(`/gantt`)}>
                        <img
                            src={require("../assets/img/GanttHeader.svg.svg").default}
                            width="24" height="24" alt="Мой профиль"
                        />
                        <p>Гант</p>
                    </div>
                </div>
                <div className={classes['right']}>
                    <img className={classes['settings-icon']}
                         onClick={() => navigate("/change-info")}
                         src={require("../images/settings-icon.svg").default}
                         width="32" height="32"
                         alt="Логотип"
                    />

                    <div className={classes["exit"]} onClick={() =>out()}>
                        <img src={require("../images/exit.svg").default} width="24" height="24" alt="Выйти"/>
                        <p>Выйти</p>
                    </div>
                </div>
        </header>
        <Navigation open={open} onClose={() => setOpen(false)} modalIsOpen={modalIsOpen}/>
    </div>
    );
}

export default Header;
