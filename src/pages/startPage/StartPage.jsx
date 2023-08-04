import s from './StartPage.module.css'
import TableRow from "../../Components/GanttTaskForm/UI/TableRow";
import ButtonForm from "../../Components/GanttTaskForm/UI/Button";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectInterns, projectsId, projectsList, tasksState, userState} from "../../store/atom";
import {useEffect, useState} from "react";
import {getAllTask, getProjectInterns, getUserInfo} from "../../services/task";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


const StartPage = () => {

    const navigate = useNavigate();
    const User = useRecoilValue(userState)
    const setUser = useSetRecoilState(userState);
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const setProjectList = useSetRecoilState(projectsList)
    const setInterns = useSetRecoilState(projectInterns)
    const [activeCategory, setActiveCategory] = useState("");
    const {user} = useSelector(state => state.auth);
    const setTasks = useSetRecoilState(tasksState);

    const handleCategoryClick = async (category, projectId) => {
        setActiveCategory(category);
        try {

            console.log(localStorage.getItem('projectIds'))

            if (category === 'gantt') {
                localStorage.setItem('projectIds', projectId)
            } else if (category === 'kanban') {
                localStorage.setItem('projectIds', projectId)
            }

            console.log(localStorage.getItem('projectIds'))

            const [userInfo, tasks, interns] = await Promise.all([
                getUserInfo(),
                getAllTask(category, projectId),
                getProjectInterns(projectId)
            ]);

            setUser(userInfo);
            setProjectList(userInfo);
            setProjectId(parseInt(localStorage.getItem('projectIds')));
            setTasks(tasks);
            setInterns(interns);

            if (category === 'gantt') {
                navigate(`/user/${user.user_id}/gantt`)
            } else if (category === 'kanban') {
                navigate(`/user/${user.user_id}/kanban`)
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // if (parseInt(localStorage.getItem('projectIds'))) {
        //     setProjectId(parseInt(localStorage.getItem('projectIds')))
        // }
        const fetchData = async () => {
            try {
                const [userInfo] = await Promise.all([
                    getUserInfo(),
                ]);

                setUser(userInfo);
                setProjectList(userInfo);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [setUser, setProjectList]);

    return (
        <div className={s.container}>
            <div className={s.elements}>
                <p className={s.title}>Мои проекты</p>
            </div>

            <div className={s.projectsContainer}>
                <ul className={s.table}>
                    <li className={s.tableHeader}>
                        <div className={s.col1}>Название</div>
                        <div className={s.col2}>Планировщики</div>
                        <div className={s.col3}>Дата начала</div>
                        <div className={s.col4}>Дата окончания</div>
                    </li>
                    {User?.map((val, i) => (
                        <>
                            <TableRow
                                key={i}
                                project={val.title}
                                value={val.id}
                                handleCategoryClick={handleCategoryClick}
                                startDate={val.start_date}
                                endDate={val.end_date}/>
                        </>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StartPage;
