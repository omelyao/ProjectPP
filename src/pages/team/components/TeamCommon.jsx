import React from 'react';
import classes from '../css/Team.module.css'
import TeamInfo from './TeamInfo';
import ListInterns from './ListInterns';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProjectQuery, useGetUserQuery } from '../../../redux/authApi';

function TeamCommon({team}) {
    const {teamId} = useParams();
    const {user} = useSelector(state => state.auth);
    const navigate = useNavigate();
    const tutor = useGetUserQuery({id:team.id_tutor});

    const project = useGetProjectQuery({id:team.id})

    if (project.isLoading || tutor.isLoading){
        return<div></div>
    }
    const flag = !!team.interns.map(intern => intern.id_intern).find((id) => id === user.user_id);
    return (
        <div className={classes["team"]}>
            <TeamInfo
                title={team.title} 
                team_chat={flag && team.team_chat}
                tutor={tutor.data}
                project={project.data}
            />
            <ListInterns interns={team.interns}/>
 { flag&&  <div className={classes["buttons"]}>
                <button className={classes["give-a-mark"]} onClick={() => navigate(`/form/${teamId}`)} >Оценка по этапам</button>
                <button className={classes["get-report"]} onClick={() => navigate(`/report/${user.user_id}/${teamId}`)} >Моя статистика</button>
            </div>}
        </div>
    );
}

export default TeamCommon;