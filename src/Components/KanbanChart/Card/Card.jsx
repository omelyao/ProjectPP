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
import {deleteIdTask, getAllTask} from "../../../services/task";

const Card = ({
                  items,
                  key,
                  board,
                  dragOverHandler,
                  dragStartHandler,
                  className,
                  tasks,
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

    const [timer, setTimer] = useRecoilState(timerState)
    const [completedAt, setCompletedAt] = useState(null);

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString();
    };

    const startTimer = () => {
        if (!timer.isRunning || timer.taskId === items.task_id) {
            const timerId = setInterval(() => {
                setTimer((prevTimer) => {
                    const currentDateTime = getCurrentDateTime();
                    const completedDateTime = completedAt || currentDateTime;
                    const totalSeconds = prevTimer.time + 1;

                    return {
                        ...prevTimer,
                        time: totalSeconds,
                        taskId: items.task_id,
                        completedAt: completedDateTime,
                    };
                });
            }, 1000);

            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: true,
                timerId,
                taskId: items.task_id,
                taskName: items.name,
                task: items,
            }));
        }
    };

    const stopTimer = () => {
        if (timer.isRunning && timer.taskId === items.task_id) {
            clearInterval(timer.timerId);
            setTimer((prevTimer) => {
                const currentDateTime = getCurrentDateTime();

                return {
                    ...prevTimer,
                    isRunning: false,
                    taskId: items.task_id,
                    taskName: items.name,
                    completedAt: currentDateTime,
                };
            });
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
                    <span>{items.name}</span>
                    {/*<span onClick={()=>openForm('view')}>{items.name}</span>*/}
                </div>
                <div className={s.project}>
                    <span>{tasks.title_project}</span>
                </div>
                <div className={s.team}>
                    <span>#{items.team__teg}</span>
                </div>
                <div className={s.user}>
                    <User style={{width:"16px", height:"16px"}} />
                    <span>{items.user__last_name} {items.user__first_name}</span>
                </div>
                <div className={s.bottom}>
                    <div className={s.deadline}>
                        <Cal style={{width:"16px", height:"16px"}}/>
                        <span>{items.planned_final_date}</span>
                    </div>
                    {isHovered && (
                        <div className={s.buttons}>
                            <button onClick={timer.isRunning ? stopTimer : startTimer}>
                                {timer.isRunning && timer.taskId === items.task_id?
                                    <Stop style={{width:"24px", height:"24px"}}/> :
                                    <Play style={{width:"24px", height:"24px"}}/>
                                }
                            </button>
                            <button><Delete style={{width:"24px", height:"24px"}} /></button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Card;
