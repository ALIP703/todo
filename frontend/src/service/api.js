import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
    baseURL: 'http://localhost:3000', // Replace with your API base URL
});

export const ApiServices = {
    getAllTasks: () => {
        return api.get("/tasks");
    }
}