import React from 'react'

const PrintObject = ({classes, ObjectKey, value, printObjectValue, isFirst}) => {
    return(
        <div className={classes.objectValue}>
            <div className={classes.objectValueKey}>{ObjectKey} :</div> 
            <div className={classes.objectValueKeyValue}>{
            // printObject(value[key])
            Object.keys(value).length === 0 ? <div className={classes.emptyObject}>&#123; &#125;</div> :
            <div className={classes.printObjectClass}>
                <div>&#123;</div>
                    <div className={classes.outputConsoleBraces}>
                    {printObjectValue(value)}
                    </div>
                <div>&#125;{(!isFirst)?",":""}</div>
            </div>
            }</div>
        </div>
    )
}

export default PrintObject;