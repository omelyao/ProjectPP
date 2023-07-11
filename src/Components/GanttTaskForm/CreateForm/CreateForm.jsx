import React, {useEffect, useState} from 'react';
import s from './CreateForm.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectInterns, projectsList, tasksState, teamsList, usersList, userState} from "../../../store/atom";
import {createTask, getAllTask, getIdTask} from "../../../services/task";
import Text from "../UI/Text";
import Select from "../UI/Select";
import {ReactComponent as Project} from  '../../../assets/img/projects.svg'
import {ReactComponent as Add} from  '../../../assets/img/addButtForm.svg'
import {ReactComponent as Del} from  '../../../assets/img/delButtForm.svg'
import InputDate1 from "../UI/InputDate1";
import ButtonForm from "../UI/Button";
import TextArea from "../UI/TextArea";
import {toast} from "react-toastify";
import { Right } from '../../GanttChart/GanttTable/TaskRow/UI/Right';
import {ReactComponent as Clock} from  '../../../assets/img/clock.svg'

const CreateForm = ({parentId, setShowModal}) => {
    // const [projectId, setProjectId] = useRecoilState(projectsList)
    // const [teamId, setTeamId] = useRecoilState(teamsList)
    // const [userId, setUserId] = useRecoilState(usersList)
    const interns = useRecoilState(projectInterns)
    const User = useSetRecoilState(userState)

    const [teamId, setTeamId] = useState(0)
    const [executorId, setExecutorId] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [finalDate, setFinalDate] = useState('')
    const [deadline, setDeadline] = useState('')
    const [stages, setStages] = useState([])
    const [performers, setPerformers] = useState([]);
    const setTasks = useSetRecoilState(tasksState);

    const options = [
        { id: 1, name: 'Название проекта' },
        { id: 4, name: 'ЛК оценка' },
        { id: 21, name: 'ЛК оценка' },
        { id: 22, name: 'ЛК Гант' },
        { id: 23, name: 'ЛК Канбан' },
        { id: 24, name: 'ЛК Канбан fefe hththt  htht' }
    ];

    const handleAddPerformer = () => {
        const newPerformer = {
            id: performers.length > 0 ? performers[performers.length - 1].id + 1 : 1,
            name: options.id === 1?.name
        };
        setPerformers([...performers, newPerformer]);
    };


    const handleDeletePerformer = (id) => {
        const newData = performers.filter(stage => stage.id !== id);
        setPerformers(newData);
    };

    const handleAddStages = () => {
        const newStage = {
            id: stages.length > 0 ? stages[stages.length - 1].id + 1 : 1,
            checked: false,
            description: ''
        };
        const updatedStages = [...stages, newStage];
        setStages(updatedStages);
    };



    const handleDeleteStages = (id) => {
        const newData = stages.filter(stage => stage.id !== id);
        setStages(newData);
    };

    const validateDates = () => {
        if (!parentId) {
            return true;
        }

        const parentStartDate = Date.parse(parentId.planned_start_date);
        const parentFinalDate = Date.parse(parentId.planned_final_date);

        if (Date.parse(startDate) === parentStartDate || Date.parse(finalDate) === parentFinalDate) {
            return true;
        } else if (Date.parse(startDate) < parentStartDate || Date.parse(finalDate) > parentFinalDate) {
            return false;
        }

        return true;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const missingData = [];

        if (!name) {
            missingData.push('Название задачи');
        }
        // if (!projectId) {
        //     missingData.push('Проект');
        // }
        // if (!teamId) {
        //     missingData.push('Тег команды');
        // }
        if (!startDate) {
            missingData.push('Дата начала');
        }
        if (!finalDate) {
            missingData.push('Дата окончания');
        }
        if (!executorId) {
            missingData.push('Ответственный');
        }

        if (missingData.length > 0) {
            const message = `Вы не ввели следующие обязательные данные:\n${missingData.join('\n')}`;
            alert(message);
            return;
        }

        if(startDate > finalDate ){
            alert("Дата начала не может быть больше Даты окончания");
            return
        }

        if (!validateDates()) {
            alert("Подзадача не может выходить за отрезок времени базовой задачи");
            return
        }

        const parent = parentId ? parentId.id : null;
        const taskList = {
            parent,
            projectId: User.id,
            name,
            description,
            startDate,
            finalDate,
            deadline: deadline ? deadline : finalDate,
        }
        const stagesList = stages.map((stage) => (stage.description));
        try {
            await createTask(taskList, stagesList, executorId)
            setShowModal(false)
            const updatedTasks = await getAllTask("gantt", 1);
            setTasks(updatedTasks);
            // toast.success('Задача создана!', {
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
    };

    return (
        <div className={s.container}>
            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.title}>
                    <Text optional={true} width={"606px"} height={"36px"} padding={"10px"} border={"1px solid #ccc"} background={"#FFFFFF"} fontSize={"20px"} fontWeight={"700"} onChange={(event) => setName(event.target.value)}/>
                    <span style={{padding:'0px 4px'}}>
                        Базовая задача:
                        <span>&nbsp;</span>
                        <span style={{textDecoration:'underline'}}>
                            {parentId !== null ? parentId.name : "Отсутствует"}
                        </span>
                    </span>
                </div>
                <div className={s.elements}>
                    <div className={s.project}>
                        <Select
                            label="Проект"
                            icon={<Project/>}
                            disabled
                            value={User.id}
                            dis={User.title}
                        />
                    </div>
                    <div className={s.element}>
                        <Select
                        label="Тег команды"
                        value={teamId}
                        icon={<Project/>}
                        options={interns.teams.map(opt => ({value: opt.id, name: opt.title}))}
                        onChange={(event) => setTeamId(event.target.value)}
                        dis={"Тег команды"}
                        />
                    </div>
                    <div className={s.element}>
                        <span>Дедлайн</span>
                        <InputDate1
                            onChange={(event) => setDeadline(event.target.value)}
                            icon={<Clock/>}
                        />
                    </div>
                </div>
                <div className={s.elements}>
                    <div className={`${s.element} ${s.deadlines}`}>
                        <span>Планируемые сроки выполнения</span>
                        <div className={s.elements}>
                            <InputDate1
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    icon={<Clock/>}
                                />
                                <span style={{alignSelf:'center'}}>-</span>
                            <InputDate1
                                    value={finalDate}
                                    onChange={(event) => setFinalDate(event.target.value)}
                                    icon={<Clock/>}
                                />
                        </div>
                        {/* <div className={s.date}>
                            <input type="date"
                                   value={startDate}
                                   onChange={(event) => setStartDate(event.target.value)} />
                            <span> - </span>
                            <input type="date"
                                   value={finalDate}
                                   onChange={(event) => setFinalDate(event.target.value)} />
                        </div> */}
                    </div>
                </div>
                <div className={s.description}>
                    <TextArea
                        placeholder="Введите описание..."
                        width={"606px"}
                        height={"128px"}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <div className={s.important}>
                    <Select
                        label="Постановщик"
                        icon={<Project/>}
                        value={User.id}
                        dis={User.title}
                        disabled
                    />
                    <Select
                        label="Ответственный"
                        icon={<Project/>}
                        options={interns.interns.map(opt => ({value: opt.id, name: opt.title}))}
                        onChange={(event) => setExecutorId(event.target.value)}
                    />
                </div>
                <div className={s.unimportant}>
                    <div className={s.unimportantTop}>
                        <span className={s.label}>Исполнители</span>
                        <button type="button"  onClick={handleAddPerformer}>
                            <Add />
                        </button>
                    </div>
                    <div className={s.unimportantLists}>
                        {performers.map((performer, index) => (
                            <div className={s.unimportantList} key={index}>
                                <Select
                                    options={options.map(opt => ({value: opt.id, name: opt.name}))}
                                    value={performer.name}
                                    onChange={(event) => {
                                        const newData = [...performers];
                                        newData[index].name = event.target.value;
                                        setPerformers(newData);
                                    }}
                                />
                                <button className={s.deleteButton} type="button" onClick={() => handleDeletePerformer(performer.id)}>
                                    <Del style={{width: "16px", height: "16px"}} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={s.checklist}>
                    <div className={s.checklistTop}>
                        <span className={s.label}>Чек-лист</span>
                        <button type="button"  onClick={handleAddStages}>
                            <Add />
                        </button>
                    </div>
                    <div className={s.checkLists}>
                        {stages.map((stage, index) => (
                            <div className={s.checkList} key={index}>
                                <Right>
                                    <input type="checkbox"/>
                                </Right>
                                <Text
                                    width={"60%"}
                                    height={"21px"}
                                    padding={"10px"}
                                    border={"1px solid #ccc"}
                                    background={"#FFFFFF"}
                                    value={stage.description}
                                    onChange={(event) => {
                                        const newData = [...stages];
                                        newData[index].description = event.target.value;
                                        setStages(newData);
                                    }}
                                />
                                <button className={s.deleteButton} type="button" onClick={() => handleDeleteStages(stage.id)}>
                                    <Del style={{width: "16px", height: "16px"}}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={s.buttons}>
                    <ButtonForm type="submit">Сохранить</ButtonForm>
                    <ButtonForm status='notActive' onClick={() => setShowModal(false)}>Отменить</ButtonForm>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
