import React, { useState } from 'react';
import classes from '../css/TeamForTutor.module.css'
import StatisticsTable from './StatisticsTable';
import { useGetFormForTeamQuery, useGetUserInfoQuery, useGetUserQuery } from '../../../redux/authApi';
import Role from './Role';
import { useNavigate } from 'react-router-dom';


function InternForTutor({intern}) {
    const internName = useGetUserQuery({id:intern.id_intern});
    const internInfo = useGetUserInfoQuery({id:intern.id_intern});
    const form = useGetFormForTeamQuery({user_id:intern.id_intern, team_id:intern.id_team});
    const [open, setOpen] = useState();
    const navigate = useNavigate();
    if (internName.isLoading || internInfo.isLoading || form.isLoading){
        return <div></div>
    }

    return (
    <div>
        <li className={classes['command-info-person']}>
            <div className={classes["photo"]}>
                <img src={ internName.data.image 
                    ? "http://127.0.0.1:8000"+ internName.data.image  
                    : require("../../../images/profile.svg").default
                } width="40" height="44" alt="123"/></div>
            <div className={`${classes["text"]} ${classes["fio"]}`}>
                { `${internName.data.last_name} ${internName.data.first_name} ${internName.data?.patronymic ?? ""}`}
                <Role idIntern={intern.id_intern} idTeam={intern.id_team} idRole={intern.role}/>
            </div>
            
                <div className= {`${classes["text"]} ${classes["contacts"]}`}>{internInfo.data.vk ??"нет данных"}
                <p>{internInfo.data.telegram ??"нет данных"}</p></div>
            
                <div className={`${classes["text"]} ${classes["education"]}`}>
                    {form.isError ? "...": `${form.data?.estimated} из ${form.data?.total}`}
                </div>   
            <div className={`${classes["text"]} ${classes["forms"]}`} onClick={() => setOpen(!open)} >Просмотреть</div>  
            <div className={`${classes["text"]} ${classes["table"]}`} onClick={() => navigate(`/report/${intern.id_intern}/${intern.id_team}`)}>
                Перейти<img src={require("../../../images/link-img.svg").default}  width="18" height="18" alt="123"/>
            </div> 
        </li>
        <StatisticsTable open={open} userId={intern.id_intern} teamId={intern.id_team}/>
    </div>
    );
}

export default InternForTutor;