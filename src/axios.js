import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:5000/api'
    // baseURL: 'https://demo.travelogic.pk/api'
});

export default instance;
