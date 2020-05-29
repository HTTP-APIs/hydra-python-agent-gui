import axios from "axios";
const agentEndPoint = "http://localhost:3001";
const getHydraDoc = () => {
  return axios.get(`${agentEndPoint}/hydra-doc`).then((res) => {
    return res.data;
  });
};

export default getHydraDoc;
