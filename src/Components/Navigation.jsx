import React from 'react';
import classes from "../css/Navigation.module.css"
import { useGetMyTeamsQuery } from '../redux/authApi';
import NavigationRole from './NavigationRole';
function Navigation({open}) {

    const team = useGetMyTeamsQuery();

    if(team.isLoading){
        console.log(team);
        return <div style={{display:"none"}}></div>
    }
    return (
        <div className={`${classes["navigation"]} ${open && classes["active"]}`}>
        {team.data.director.length > 0 && <NavigationRole teams={team.data.director} mainTitle={"Проекты"} link={"project"} />}
        
        {team.data.tutor.length > 0 && <NavigationRole teams={team.data.tutor} mainTitle={"кураторство"} link ={"team"} />}
        
        {team.data.intern.length > 0 && <NavigationRole teams={team.data.intern} mainTitle={"Команды"} link ={"team"} />}

            {/* <div className={classes["roles"]}>
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
            </div> */}
        </div>
    );
}

export default Navigation;