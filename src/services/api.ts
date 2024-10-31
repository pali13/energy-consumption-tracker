import axios from 'axios';
import ENV from '../config/config';

const api = axios.create({
  baseURL: ENV,
});

export default api;