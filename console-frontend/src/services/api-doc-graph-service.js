import axios from "axios";
const agentEndpoint = "http://localhost:3001";

const getApiDocGraph = () => {
    return axios.get(`${agentEndpoint}/apidoc-graph`).then(res => {
        return res.data;
    })
}

export default getApiDocGraph;