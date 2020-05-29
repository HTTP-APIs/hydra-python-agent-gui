import React from "react";

function PrintID({ classes, value, setResourceID }) {
  return (
    <div className={classes.objectValue}>
      <div className={classes.objectValueKey}>@id :</div>
      <div className={classes.objectValueKeyValueLink} onClick={setResourceID}>
        {value["@id"]}
      </div>
    </div>
  );
}

export default PrintID;
