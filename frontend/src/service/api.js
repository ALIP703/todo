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
    }
}