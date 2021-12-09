import axios from "axios";

const agentEndpoint = "";

const getRawOutput = async (body) => {
  try {
    const response = await axios
      .post( `${ agentEndpoint }/send-command`, body );
    return response;
  } catch ( err ) {
    return console.error( err );
  }
};

export default getRawOutput;
