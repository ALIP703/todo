import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export const ApiServices = {
    getAllTasks: () => {
        return api.get("/tasks");
    },
    getAllPriority: () => {
        return api.get("/priorities");
    },
    getAllTasksByPriorityId: (priorityId) => {
        return api.get(`/tasks/${priorityId}`);
    },
    deleteTask: (id) => {
        return api.delete(`/task/${id}`);
    },
    createTask: (formData) => {
        return api.post(`/task`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateTask: (id, formData) => {
        return api.put(`/task/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
}