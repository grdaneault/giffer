import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_HOST || 'http://giffer.greggernaut.com/api/v1/',
    timeout: 15000,
});