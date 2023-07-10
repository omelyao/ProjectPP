import api from "./api";

const token = localStorage.getItem("access")

export const getAllTask = async (type) => {
    try {
        const response = await api.get(`/scheduler/api/v1/tasks?view_type=${type}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
    }
};

export const getAllTaskFilter = async (id) => {
    try {
        const response = await api.get(`/scheduler/api/v1/tasks?project_id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
    }
};

export const createTask = async (task, stages) => {
    const createTask = {
        parent_id: task.parent || null,
        project_id: task.projectId,
        team_id: task.teamId,
        name: task.name,
        description: task.description,
        planned_start_date: task.startDate,
        planned_final_date: task.finalDate,
        deadline: task.deadline,
        executor_id: task.executorId,
    };

    let stagesList = [];

    if (Array.isArray(stages)) {
        stagesList = stages.map((stage) => ({ description: stage }));
    }

    const data = {
        task: createTask,
        stages: stagesList,
    };

    try {
        await api.post('/scheduler/api/v1/tasks', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e);
    }
};


export const getIdTask = async (id) => {
    try {
        const response = await api.get(`/scheduler/api/v1/task/${id}`, {
            headers: {
                Authorization: 'Bearer token'
            }
        })
        return response.data
    } catch (e) {
        console.log(e)
    }
}

export const updateIdTask = async (id, task, stages) => {
    const updateTask = {
        parent_id: task.parent || null,
        project_id: task.projectId,
        team_id: task.teamId,
        name: task.name,
        description: task.description,
        planned_start_date: task.startDate,
        planned_final_date: task.finalDate,
        deadline: task.deadline,
        executor_id: task.executorId,
    };

    let stagesList = [];

    if (Array.isArray(stages)) {
        stagesList = stages.map((stage) => ({ description: stage }));
    }

    const data = {
        task: updateTask,
        stages: stagesList,
    };
    try {
        await api.put(`/scheduler/api/v1/task/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(data)
    }catch (e){
        console.log(e)
    }
}

export const deleteIdTask = async (id) => {
    try {
        await api.delete(`/scheduler/api/v1/task/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }catch (e){
        console.log(e)
    }
}


export const kanbanView = async (id) => {
    try {
        await api.post(`/scheduler/api/v1/task/${id}/is_on_kanban `, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }catch (e){
        console.log(e)
    }
}


export const editDates = async (id, task) => {
    const data = {
        planned_start_date: task.planned_start_date,
        planned_final_date: task.planned_final_date,
        deadline: task.deadline,
    };
    try {
        await api.post(`/scheduler/api/v1/task/${id}/dates`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.log(e);
        throw e
    }
};
