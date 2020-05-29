import axios from "axios"
const agentEndpoint = "http://localhost:30001";

const startAgent = (serverURL) => {
    return axios.post(`${agentEndpoint}/start-agent`,{url: serverURL}).then(res => {
        return res;
    })
}

export default startAgent;