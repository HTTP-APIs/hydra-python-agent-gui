import axios from "axios";
const agentEndpoint = "";

const startAgent = (serverURL) => {
  return axios
    .post(`${agentEndpoint}/start-agent`, { url: serverURL })
    .then((res) => {
      return res;
    });
};

export default startAgent;
