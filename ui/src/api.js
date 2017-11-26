import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1/', //http://giffer.greggernaut.com/api/v1/',
    timeout: 5000,
});