import React from "react";
import { isString, isObject, isArray } from "../../../utils/utils";
import PrintString from "../print-components/PrintString";
import PrintArray from "../print-components/PrintArray";
import PrintID from "../print-components/PrintId";

const printObjectValue = (value, classes, setResourceID, temporaryEndpoint) => {
  //  A helper method printObject() method to print its key value
  return Object.keys(value).map((key, index) => {
    if (key === "@id") {
      return (
        <PrintID
          key={index}
          classes={classes}
          value={value}
          setResourceID={() => setResourceID(temporaryEndpoint, value["@id"])}
        />
      );
    }
    if (isString(value[key])) {
      return (
        <PrintString
          key={index}
          classes={classes}
          value={value}
          objectKey={key}
        />
      );
    }
    if (isObject(value[key])) {
      return (
        <PrintObject
          key={index}
          classes={classes}
          value={value}
          isFirst={false}
        />
      );
    }
    if (isArray(value[key])) {
      return (
        <PrintArray
          key={index}
          classes={classes}
          value={value}
          isFirst={false}
        />
      );
    }
    return <div key={index}></div>;
  });
};

const PrintObject = ({
  classes,
  value,
  isFirst,
  setResourceID,
  temporaryEndpoint,
}) => {
  return (
    <div className={classes.objectValue}>
      <div className={classes.objectValueKeyValue}>
        {Object.keys(value).length === 0 ? (
          <div className={classes.emptyObject}>&#123; &#125;</div>
        ) : (
          <div className={classes.printObjectClass}>
            <div>&#123;</div>
            <div className={classes.outputConsoleBraces}>
              {printObjectValue(
                value,
                classes,
                setResourceID,
                temporaryEndpoint
              )}
            </div>
            <div>&#125;{!isFirst ? "," : ""}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintObject;
