import axios from "axios";
const agentEndpoint = "";

const getApiDocGraph = () => {
    return axios.get(`${agentEndpoint}/apidoc-graph`).then(res => {
        return res.data;
    })
}

export default getApiDocGraph;