import axios from 'axios';
const instance = axios.create({
    // baseURL: 'http://localhost:5000/api'
    baseURL: 'http://13.229.122.218:3000/api'
});

export default instance;
