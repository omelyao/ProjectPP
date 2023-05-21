import React from 'react';
import classes from '../css/Navigation.module.css'
import { NavLink } from 'react-router-dom';


function NavigationRole({teams, mainTitle, link}) {
    return (
        <div className={classes["roles"]}>
        <div className={`${classes["name-role"]}`}>{mainTitle}</div>
        <ul>
            {teams.map((team) => <li  key={team.id}>
                <NavLink className={classes["roles-li-p"]} to={`${link}/${team.id}`}>{team.title}
                </NavLink>
                </li>)}
        </ul>
    </div>
    );
}

export default NavigationRole;