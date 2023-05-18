import React, { useState } from 'react';
import classes from "../css/project.module.css"
import { Link } from 'react-router-dom';
import EdtiTeam from './EdtiTeam';
function TeamProj({team, tutors, interns}) {
    const [open, setOpen] = useState(false);
    return (
        <li key={Date.now()} className={classes['command-info-person']}>
        <Link to={`/team/${team.id}`}  className={classes["team-head"]}>{team.title}</Link>
        <div className={classes["tutor-head"]}>{team.id_tutor}</div>
        <img className={classes["link-pen"]} src={require("../../../images/pen.svg").default} onClick={() => setOpen(true)}  width="16" height="16" alt="Карандаш"/>
        {open && <EdtiTeam tutors={tutors} interns={interns} open={open} onClose={() => setOpen(false)} team={team}/>}
</li>
    );
}

export default TeamProj;