import React from 'react';
import classes from "./css/Stages.module.css"
import Stage from './components/Stage';
import { useParams } from 'react-router-dom';
import { useGetStagesQuery, useGetTeamQuery } from '../../redux/authApi';
function Stages() {
    const {teamId} = useParams();
    const stages = useGetStagesQuery({id: teamId});
    const team = useGetTeamQuery({id: teamId});
    if(stages.isLoading || team.isLoading){
        return <div></div>;
    }
    console.log(stages.data);
    console.log(team.data);
    return (<div className={classes["main"]}>
<div className={classes["stages-main"]}>
            <div className={classes["stages-info"]}>
                <h2>Этапы</h2>
                <div className={classes["info"]}>
                    <p>Проект: {team.data.id_project}</p>
                    <p>Команда: {team.data.title}</p>
                </div>
            </div>
            <div className={classes["table"]}>
                <ul className={classes["main-ul"]}>
                        <li className={classes['command-info-person-head']}>
                            <div className={classes["number"]}>Номер</div>
                            <div className={classes["name"]}>Название</div>
                            <div className={classes["date-start-end"]}>Дата начала-окончания</div>
                            <div className={classes["date"]}>Дата для оценки</div>
                            <div className={classes["status"]}>Статус</div>
                        </li>
                        {stages.data.map(stage => <Stage stage={stage}/>)}

                </ul>
            </div>
            <div className={classes["button"]}>
                <button className={classes["stage-create"]}>создать этап</button>
            </div>
        </div>
    </div>
    );
}

export default Stages;