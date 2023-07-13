import React, {useEffect, useState} from 'react';
import s from './ViewForm.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    commentsState,
    projectInterns, projectsId,
    projectsList,
    taskIdState,
    tasksState,
    teamsList,
    timer,
    timerState
} from "../../../store/atom";
import {
    editStages,
    deleteIdTask,
    getAllTask,
    getIdTask,
    timeSpent,
    createComment,
    editComment, deleteComment, editComments, deleteComments
} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from '../../../assets/img/projects.svg'
import InputDate1 from "../UI/InputDate1";
import ButtonForm from "../UI/Button";
import TextArea from "../UI/TextArea";
import {toast} from "react-toastify";
import { Right } from '../../GanttChart/GanttTable/TaskRow/UI/Right';
import {ReactComponent as Clock} from  '../../../assets/img/clock.svg';
import {ReactComponent as Timer} from  '../../../assets/img/timer.svg';
import {ReactComponent as StartTimerButton} from  '../../../assets/img/startTimerButton.svg';
import {ReactComponent as TrashTimerButton} from  '../../../assets/img/trashButton.svg';
import {ReactComponent as PauseTimerButton} from  '../../../assets/img/pauseTimerButton.svg';
import {useParams} from "react-router-dom";
import {useGetUserQuery} from "../../../redux/authApi";


const ViewForm = ({id, setFormType, setShowModal}) => {
    const projectList = useRecoilValue(projectsList)
    const internsList = useRecoilValue(projectInterns)
    const projectId= useRecoilValue(projectsId);
    const {userId} = useParams();
    const user = useGetUserQuery({id:userId});
    const taskId = useRecoilValue(taskIdState)
    const setTaskId = useSetRecoilState(taskIdState)
    const setTasks = useSetRecoilState(tasksState)
    const tasks = useRecoilValue(tasksState)
    const [timer, setTimer] = useRecoilState(timerState)
    const [completedAt, setCompletedAt] = useState(null);

    const [comments, setComments] = useState('')
    const [newComments, setNewComments] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null);

    const addComments = async () => {
        try {
            await createComment(taskId.task.id, comments);
            setComments('')
            const updatedTaskId = await getIdTask(taskId.task.id);
            setTaskId(updatedTaskId);
        }catch (e) {
            console.log(e)
        }
    };

    const editComment = async (id, comm) => {
        try {
            await editComments(id, comm);
            setEditingCommentId(null);
            const updatedTaskId = await getIdTask(taskId.task.id);
            setTaskId(updatedTaskId);
        } catch (e) {
            console.log(e);
        }
    };

    const deleteComment = async (id) => {
        try {
            await deleteComments(id);
            const updatedTaskId = await getIdTask(taskId.task.id);
            setTaskId(updatedTaskId);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getIdTask(id.id)
            .then((response) => {
                setTaskId(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id.id]);



    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString(); // Convert to ISO string format (e.g., "2023-07-12T12:08:06.650Z")
    };

    const startTimer = () => {
        if (!timer.isRunning || timer.taskId === id.id) {
            const timerId = setInterval(() => {
                setTimer((prevTimer) => {
                    const currentDateTime = getCurrentDateTime();
                    const completedDateTime = completedAt || currentDateTime;
                    const totalSeconds = prevTimer.time + 1;

                    return {
                        ...prevTimer,
                        time: taskId.task.completed_at !== null ? formatTime(totalSeconds) : totalSeconds,
                        taskId: id.id,
                        completedAt: completedDateTime,
                    };
                });
            }, 1000);

            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: true,
                timerId,
                taskId: id.id,
                taskName: id.name,
                task: id,
            }));
        }
    };

    const stopTimer = () => {
        if (timer.isRunning && timer.taskId === id.id) {
            clearInterval(timer.timerId);
            setTimer((prevTimer) => {
                const currentDateTime = getCurrentDateTime();
                const completedDateTime = taskId.task.completed_at || currentDateTime;

                return {
                    ...prevTimer,
                    isRunning: false,
                    taskId: id.id,
                    taskName: id.name,
                    completedAt: completedDateTime,
                };
            });
        }
    };

    const resetTimer = () => {
        clearInterval(timer.timerId);
        setTimer((prevTimer) => ({
            ...prevTimer,
            time: 0,
            isRunning: false,
            timerId: null,
            completedAt: null, // Reset completed date and time
        }));
        setCompletedAt(taskId.task.completed_at); // Reset completedAt to initial value
    };

    const saveTimer = async () => {
        const timeToSave = taskId.task.completed_at !== null ? taskId.task.completed_at : timer.completedAt;
        await timeSpent(id.id, timeToSave);
        const updatedTaskId = await getIdTask(taskId.task.id);
        setTaskId(updatedTaskId);
    };



    const handleCheckboxChange = async (stage) => {
        try {
            await editStages(stage);
            const updatedTaskId = await getIdTask(taskId.task.id);
            setTaskId(updatedTaskId);
        } catch (error) {
            console.log(error);
        }
    };

    const Delete = async () => {
        try {
            await deleteIdTask(taskId.task.id);
            setShowModal(false);
            const updatedTasks = await getAllTask("gantt", projectId);
            setTasks(updatedTasks);
            // toast.success('Задача удалена!', {
            //     position: "top-right",
            //     autoClose: 1000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
        } catch (e) {
            console.log(e);
        }
    }

    const findTaskById = (tasks, taskId) => {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (task.id === taskId) {
                return task;
            }
            if (task.children && task.children.length > 0) {
                const foundTask = findTaskById(task.children, taskId);
                if (foundTask) {
                    return foundTask;
                }
            }
        }
        return null;
    }

    return (
        <div className={s.container}>
            <form className={s.form}>
                <div className={s.title}>
                <Text width={"606px"} height={"36px"} fontSize={"20px"} fontWeight={"700"} value={taskId.task && taskId.task.name} disabled/>
                    <span style={{padding:'0px 4px'}}>
                        Базовая задача:
                        <span>&nbsp;</span>
                        <span style={{textDecoration: 'underline'}}>
                        {taskId.task && taskId.task.parent_id !== null ?
                            findTaskById(tasks.tasks, taskId.task.parent_id)?.name : "Отсутствует"}
                        </span>
                    </span>
                </div>
                <div className={s.info}>
                    <div className={s.elements}>
                        <div className={s.project}>
                            <Select
                                label="Проект"
                                // icon={<Project/>}
                                options={projectList}
                                value={taskId.task && taskId.task.project_id}
                                disabled
                            />
                        </div>
                        <div className={s.element}>
                            <Select
                                label="Тег команды"
                                // icon={<Project/>}
                                options={internsList.teams}
                                value={taskId.task && taskId.task.team_id}
                                disabled
                            />
                        </div>
                        <div className={s.element}>
                            <span>Дедлайн</span>
                            <InputDate1
                                value={taskId.task && taskId.task.deadline}
                                disabled
                                icon={<Clock/>}
                            />
                        </div>
                    </div>
                <div className={s.elements}>
                    <div className={`${s.element} ${s.deadlines}`}>
                        <span>Планируемые сроки выполнения</span>
                        <div className={s.elements}>
                            <InputDate1
                                    value={taskId.task && taskId.task.planned_start_date}
                                    disabled
                                    icon={<Clock/>}
                                />
                            <span style={{alignSelf:'center'}}>-</span>
                            <InputDate1
                                    value={taskId.task && taskId.task.planned_final_date}
                                    disabled
                                    icon={<Clock/>}
                                />
                        </div>
                    </div>
                </div>
                    <div className={s.description}>
                        <TextArea
                            value={taskId.task && taskId.task.description}
                            placeholder="Введите комментарий..."
                            width={"606px"}
                            height={"128px"}
                            disabled
                        />
                    </div>
                    <div className={s.important}>
                        <Select
                            label="Постановщик"
                            icon={<Project/>}
                            options={internsList.interns}
                            value={taskId.executors && taskId.executors[0]?.user_id}
                            disabled
                        />
                        <Select
                            label="Ответственный"
                            icon={<Project/>}
                            options={internsList.interns}
                            value={taskId.executors && taskId.executors[1]?.user_id}
                            disabled
                        />
                    </div>
                    <div className={s.unimportant}>
                        <div className={s.unimportantTop}>
                            <span className={s.label}>Исполнители</span>
                        </div>
                        <div className={s.unimportantLists}>
                            {taskId.executors &&
                                taskId.executors.map((performer, index) => (
                                    index > 1 && (
                                        <div className={s.unimportantList} key={index}>
                                            <Select
                                                disabled
                                                options={internsList.interns}
                                                value={taskId.executors && taskId.executors[index]?.user_id}
                                            />
                                        </div>
                                    )
                                ))}
                        </div>
                    </div>
                    {taskId.stages?.length === 0 ? null :
                        <div className={s.checklist}>
                            <div className={s.checklistTop}>
                                <span className={s.label}>Чек-лист</span>
                            </div>
                            <div className={s.checkLists}>
                                {taskId.stages && taskId.stages.map((stage, index) => (
                                    <div className={s.checkList} key={index}>
                                        <Right>
                                            <input type="checkbox"
                                                   checked={stage.is_ready}
                                                   onChange={() => handleCheckboxChange(stage)}
                                            />
                                        </Right>
                                        <Text
                                        width={"60%"}
                                        height={"21px"}
                                        padding={"10px"}
                                        value={stage.description}
                                        disabled/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    <div className={s.time}>
                        <div className={s.timer}>
                            <span className={s.label}>Таймер</span>
                            <div className={s.timerElements}>
                                <div className={s.timeElements}>
                                    <div className={s.timeContainer}>
                                        <span className={s.timerIcon}><Timer/></span>
                                        <span className={s.timeValue}>{timer.taskId === id.id ? formatTime(timer.time) : "00:00:00"}</span>
                                    </div>
                                    <div className={s.timerButtonsContainer}>
                                        <ButtonForm onClick={timer.isRunning ? stopTimer : startTimer} padding={'0 8px'} width={'32px'}>
                                            {timer.isRunning && timer.taskId === id.id  ? <PauseTimerButton/> : <StartTimerButton/>}
                                        </ButtonForm>
                                        <ButtonForm onClick={saveTimer}>Сохранить</ButtonForm>
                                        <ButtonForm onClick={resetTimer} status='notActive' padding={'0 8px'}><TrashTimerButton/></ButtonForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={s.timeSpent}>
                            <span className={s.label}>Затраченное время</span>
                            <div className={s.timeSpentElements}>
                                <span>00:00:00</span>
                                <Text
                                width={"fit-content"}
                                height={"32px"}
                                padding={"4px 8px"}
                                border={"1px solid #ccc"}
                                background={"#FFFFFF"}
                                value={'ФИО'} disabled/>
                            </div>
                        </div>
                    </div>
                    <div className={s.buttons}>
                        <ButtonForm
                                    onClick={() => setFormType('edit')}>Редактировать</ButtonForm>
                        <ButtonForm onClick={() => setFormType('create')}>Создать
                            подзадачу</ButtonForm>
                        <ButtonForm status='deleteTask' onClick={Delete}>Удалить
                            задачу</ButtonForm>
                    </div>
                    <div className={s.comments}>
                        <div className={s.commentsInput}>
                            <span className={s.label}>Комментарии</span>
                            <div className={s.commentsInputElements}>
                                <TextArea
                                    value={comments}
                                    onChange={(event) => setComments(event.target.value)}
                                    placeholder="Введите комментарий..."
                                    height={"40px"}
                                />
                                <ButtonForm height={"40px"} onClick={addComments}>Отправить</ButtonForm>
                            </div>
                        </div>
                        <div className={s.commentsOutput}>
                            {taskId.comments &&
                                taskId.comments.map((comment, index) => (
                                    <div className={s.commentsOutputItem} key={index}>
                                        <div className={s.commentsOutputTitle}>
                                            <p className={s.commentsOutputName}>
                                                {comment.user_id__last_name} {comment.user_id__first_name}
                                            </p>
                                        </div>
                                        <div className={s.commentsOutputComment}>
                                            {editingCommentId === comment.id ? (
                                                <>
                                                    <TextArea
                                                        value={newComments}
                                                        onChange={(event) => setNewComments(event.target.value)}
                                                        height={'auto'}
                                                        width={'550px'}
                                                    />
                                                    <ButtonForm
                                                        height={'40px'}
                                                        width={'40px'}
                                                        onClick={() => editComment(comment.id, newComments)}
                                                    >
                                                        С
                                                    </ButtonForm>
                                                </>
                                            ) : (
                                                <>
                                                    <TextArea
                                                        value={comment.message}
                                                        readOnly
                                                        height={'auto'}
                                                        width={'550px'}
                                                    />
                                                    <ButtonForm
                                                        height={'40px'}
                                                        width={'40px'}
                                                        onClick={() => setEditingCommentId(comment.id)}
                                                    >
                                                        И
                                                    </ButtonForm>
                                                    <ButtonForm
                                                        height={'40px'}
                                                        width={'40px'}
                                                        onClick={() => deleteComment(comment.id)}
                                                    >
                                                        У
                                                    </ButtonForm>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ViewForm;
