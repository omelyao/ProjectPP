import React, { useState } from 'react';
import s from './Card.module.css'
import { ReactComponent as User } from "../../../assets/img/User.svg";
import { ReactComponent as Cal } from "../../../assets/img/calendar.svg";
import { ReactComponent as Play } from "../../../assets/img/CardButtons.svg";
import { ReactComponent as Stop } from "../../../assets/img/StopCardButton.svg";
import { ReactComponent as Delete } from "../../../assets/img/DeleteCardButtons.svg";
import {useRecoilState} from "recoil";
import {tasksState, timerState} from "../../../store/atom";
import Modal from "../../GanttTaskForm/Modal/Modal";

const Card = ({
                  items,
                  key,
                  board,
                  dragOverHandler,
                  dragStartHandler,
                  className,
                  tasks
              }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)

    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const [showTaskInfo, setShowTaskInfo] = useState(false);
    const [activeCategory, setActiveCategory] = useState('kanban');
    const [timer, setTimer] = useRecoilState(timerState);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const startTimer = () => {
        if (!timer.isRunning) {
            const timerId = setInterval(() => {
                setTimer((prevTimer) => ({
                    ...prevTimer,
                    time: prevTimer.time + 1,
                }));
            }, 1000);

            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: true,
                timerId,
            }));
        }
    };

    const stopTimer = () => {
        if (timer.isRunning) {
            clearInterval(timer.timerId);
            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: false,
            }));
        }
    };

    return (
        <>
            <div
                className={`${className} ${isHovered ? s.hovered : ''}`}
                key={key}
                draggable={"true"}
                onDragOver={(e) => dragOverHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, items)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={s.title}>
                    <span onClick={()=>openForm('view')}>{items.task_id__name}</span>
                </div>
                <div className={s.project}>
                    <span>{tasks.title_project}</span>
                </div>
                <div className={s.team}>
                    <span>#{items.task_id__team_id__teg}</span>
                </div>
                <div className={s.user}>
                    <User style={{width:"16px", height:"16px"}} />
                    <span>ФИО</span>
                </div>
                <div className={s.bottom}>
                    <div className={s.deadline}>
                        <Cal style={{width:"16px", height:"16px"}}/>
                        <span>{items.task_id__planned_final_date}</span>
                    </div>
                    {isHovered && (
                        <div className={s.buttons}>
                            <button onClick={timer.isRunning ? stopTimer : startTimer}>
                                {timer.isRunning ?
                                    <Stop style={{width:"24px", height:"24px"}}/> :
                                    <Play style={{width:"24px", height:"24px"}}/>
                                }
                            </button>
                            <button><Delete style={{width:"24px", height:"24px"}} /></button>
                        </div>
                    )}
                </div>
            </div>
            <Modal id={items.task_id} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </>
    );
};

export default Card;
