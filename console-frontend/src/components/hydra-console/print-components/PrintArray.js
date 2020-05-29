import React from "react";
import { isString, isObject, isArray } from "../../../utils/utils";
import PrintObject from "../print-components/PrintObject";

const printArrayValue = (value, classes, setResourceID, temporaryEndpoint) => {
  // A helper method for printArray() to print all the values inside the Array
  return value.map((v, index) => {
    if (isString(v)) return <div className={classes.arrayValue}>{v},</div>;
    if (isObject(v))
      return (
        <div className={classes.arrayValue} key={index}>
          <PrintObject
            classes={classes}
            value={v}
            isFirst={false}
            setResourceID={() => setResourceID(temporaryEndpoint, v["@id"])}
          />
        </div>
      );

    if (isArray(v))
      return (
        <div className={classes.arrayValue}>
          <PrintArray classes={classes} value={v} isFirst={false} />
        </div>
      );
    return null;
  });
};

const PrintArray = ({
  classes,
  value,
  isFirst,
  setResourceID,
  temporaryEndpoint,
}) => {
  return (
    <div>
      {value.length === 0 ? (
        <div className={classes.emptyArray}>[]</div>
      ) : (
        <div className={classes.printArrayClass}>
          <div>[</div>
          <div className={classes.outputConsoleBraces}>
            {printArrayValue(value, classes, setResourceID, temporaryEndpoint)}
          </div>
          <div>]{!isFirst ? "," : ""}</div>
        </div>
      )}
    </div>
  );
};

export default PrintArray;
