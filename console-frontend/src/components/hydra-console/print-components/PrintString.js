import React from "react";

const PrintString = ({ value, objectKey }) => {
  return <div>{`${objectKey} : ${value[objectKey]}`} </div>;
};

export default PrintString;
