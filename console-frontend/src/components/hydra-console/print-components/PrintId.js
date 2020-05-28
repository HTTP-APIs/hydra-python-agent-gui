import React from 'react';


// props required are: classes, key, value, temporaryEndPoint, setResourceID
function PrintID({classes, Objectkey, value, setResourceID }){
    return (
        <div className={classes.objectValue}>
            <div className={classes.objectValueKey}> {Objectkey} :</div>
            <div className={classes.objectValueKeyValueLink} 
                onClick={setResourceID}>
                {value[Objectkey]}
            </div>
        </div>
    )

}

export default PrintID