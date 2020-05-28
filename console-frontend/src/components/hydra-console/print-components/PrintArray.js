import React from "react";

const PrintArray = ({
  classes,
  value,
  ObjectKey,
  isFirst,
  printArrayValue,
}) => {
  return (
    <div className={classes.objectValue}>
      <div className={classes.objectValueKey}>{ObjectKey} :</div>
      <div className={classes.objectValueKeyValue}>
        {
          value[ObjectKey].length === 0 ? (
            <div className={classes.emptyArray}>[]</div>
          ) : (
            <div className={classes.printArrayClass}>
              <div>[</div>
              <div className={classes.outputConsoleBraces}>
                {printArrayValue(value)}
              </div>
              <div>]{!isFirst ? "," : ""}</div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default PrintArray;
