import React from 'react'

const PrintString = ({classes, value, ObjectKey}) => {
    return(
        <div className={classes.objectValue}>
            <div className={classes.objectValueKey}>{ObjectKey} :
            </div>
            <div className={classes.objectValueKeyValue}>{value[ObjectKey]},
            </div>
        </div>
    )
}

export default PrintString

