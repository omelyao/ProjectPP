import React, { useState } from 'react';
import classes from '../css/ChangeUser.module.css'
import { useChangeUserInfoMutation } from '../../../redux/authApi';
import { useSelector } from 'react-redux';


function LineInfo({title, values, name}) {
    const {user} = useSelector(state => state.auth);
    
    const [isEdit, setIsEdit] = useState(false);
    const [changeInfo] = useChangeUserInfoMutation();
    const [inp, setInp] = useState(values[name])

    const cancel = () =>{
        setInp(values[name])
        setIsEdit(false)
    }

    const sendNewInfo = async () =>{
        const body = {...values, [name]:inp};
        const res = await changeInfo({id: user.user_id, body});
        if (!res.error){
            cancel();
        }        
    }

    if (isEdit){
        return     (
        <div className={`${classes["inp-container"]}`}>
            {title}:
            <input type="text" value={inp} onChange={(e) => setInp(e.target.value)} placeholder='нет данных'  className={classes["inp"]} />
            <img className={classes["link-pen"]} onClick={() => sendNewInfo()}  src={require("../../../images/Y.svg").default} width="16" height="16" alt="Карандаш"/>
            <img className={classes["link-pen"]} onClick={() => cancel()} src={require("../../../images/cross.svg").default} width="16" height="16" alt="Карандаш"/>
        </div>)
    }

    return (
    <div className={`${classes["line-container"]}`}>{title}:
        <div className={classes["inf"]}>{values[name] ?? "нет данных"}</div>
        <img className={classes["link-pen"]} onClick={() => setIsEdit(true)} src={require("../../../images/pen.svg").default} width="16" height="16" alt="Карандаш"/>
    </div>

    );
}

export default LineInfo;