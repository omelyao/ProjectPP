import React from 'react';
import classes from "../css/Navigation.module.css"
function Navigation({open}) {

    return (
        <div className={`${classes["navigation"]} ${open && classes["active"]}`}>
            <div className={classes["roles"]}>
                <div className={classes["name-role"]}>Руководитель</div>
                <div className={classes["name-role-value"]}>Нет доступа</div>
            </div>
            <div className={classes["roles"]}>
                <div className={`${classes["name-role"]} ${classes["curator"]}`}>Я - куратор</div>
                <ul>
                    <li>
                        <p>Команда 1</p>
                    </li>
                    <li>
                        <p>Команда n</p>
                    </li>
                </ul>
            </div>
            <div className={classes["roles"]}>
                <div className={`${classes["name-role"]} ${classes["intern"]}`}>Я - стажёр</div>
                <ul>
                    <li>
                        <p>Команда 1</p>
                    </li>
                    <li>
                        <p>Команда n</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Navigation;