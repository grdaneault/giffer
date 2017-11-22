import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://giffer.greggernaut.com/api/v1/',
    timeout: 5000,
});