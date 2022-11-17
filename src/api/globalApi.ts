import axios from "axios";

const globalApi = axios.create({
    baseURL: "/api"
});

export default globalApi;