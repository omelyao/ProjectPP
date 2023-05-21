import React, { useState } from 'react';
import classes from '../css/ProjectInterns.module.css'
import { domen, useGetFormForTeamQuery, useGetUserInfoQuery, useGetUserQuery } from '../../../redux/authApi';
import StatisticsTable from '../../team/components/StatisticsTable';


function InternProj({intern}) {

    // const internName = useGetUserQuery({id:intern.id_intern});
    const internInfo = useGetUserInfoQuery({id:intern.id_intern});
    const form = useGetFormForTeamQuery({user_id:intern.id_intern, team_id:intern.id_team});
    const [open, setOpen] = useState(false);

    if (internInfo.isLoading || form.isLoading){
        return <div></div>
    }
    console.log(intern);
    return (
        <div>
        <li className={classes['command-info-person']}>
            <div className={classes["photo"]}>
                <img src={ intern.image ? domen + intern.image  : require("../../../images/profile.svg").default} width="40" height="44" alt="123"/>
            </div>
            <div className={`${classes["text"]} ${classes["fio"]}`}>{intern.name}</div>
            <div className={`${classes["text"]} ${classes["role"]}`}>{intern.roleTitle}</div>
            <div className={`${classes["text"]} ${classes["team"]}`}>{intern.teamTitle}</div>
            <div className={`${classes["text"]} ${classes["criteria"]}` } onClick={() => setOpen(!open)}>Просмотреть
{               !open? <img src={require("../../../images/eye.svg").default}  width="14.35" height="10.35" alt="132"/>
                :      <img src={require("../../../images/eye-close.svg").default} width="14.35" height="10.35" alt="132"/>}
            </div>
            
        </li>
        {open && <StatisticsTable open={open} userId={intern.id_intern} teamId={intern.id_team}/>}
    </div>
    );
}

export default InternProj;