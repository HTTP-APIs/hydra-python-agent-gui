import axios from "axios";
const agentEndpoint = "";

const startAgent = async (serverURL) => {
  const res = await axios
    .post( `${ agentEndpoint }/start-agent`, { url: serverURL } );
  return res;
};

export default startAgent;
