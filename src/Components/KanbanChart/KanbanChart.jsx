import React, { useEffect, useState } from 'react';
import s from './KanbanChart.module.css';
import Column from './Column/Column';
import { useRecoilValue } from 'recoil';
import { tasksState } from '../../store/atom';

const KanbanChart = () => {
    const tasks = useRecoilValue(tasksState);

    const [boards, setBoards] = useState([
        { id: 1, title: 'В РАБОТУ', status: 'inwork', idStatus: 'TO WORK', items: [] },
        { id: 2, title: 'ВЫПОЛНЯЮТСЯ', status: 'except', idStatus: 'IN PROGRESS', items: [] },
        { id: 3, title: 'ТЕСТИРОВАНИЕ', status: 'test', idStatus: 'TESTING', items: [] },
        { id: 4, title: 'ПРОВЕРКА', status: 'check', idStatus: 'CHECKING', items: [] },
        { id: 5, title: 'ЗАВЕРШЕННЫЕ', status: 'complete', idStatus: 'COMPLETED', items: [] },
    ]);

    useEffect(() => {
        if (tasks && tasks.tasks) { // Add a check to ensure tasks and tasks.tasks are not undefined
            const updatedBoards = boards.map(board => {
                const filteredTasks = tasks.tasks.filter(task => task.task_id__status_id__name === board.idStatus);
                return { ...board, items: filteredTasks };
            });

            setBoards(updatedBoards);
        }
    }, [tasks]);

    return (
        <div className={s.container}>
            <Column tasks={tasks} boards={boards} setBoards={setBoards} />
        </div>
    );
};

export default KanbanChart;
