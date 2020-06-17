import axios from "axios";
const agentEndPoint = "";
const getHydraDoc = () => {
  return axios.get(`${agentEndPoint}/hydra-doc`).then((res) => {
    return res.data;
  });
};

export default getHydraDoc;
