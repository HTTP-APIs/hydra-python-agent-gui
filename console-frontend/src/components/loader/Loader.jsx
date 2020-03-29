import React from 'react'
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    image: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "120px",
        height: "120px",
        margin: `-60px 0 0 -60px`,
        animation:`spin 4s linear infinite`,
        borderRadius: `30%`
    },
    "@keyframes spin" : { 
        "100%" : { 
            transform: "rotate(360deg)" 
        } 
    }
});



const Loader = (props) => {
    const classes = props.classes
    return(
        <div className={classes.loader}>
            <img className={classes.image} src="https://avatars1.githubusercontent.com/u/24541949?s=100&v=4" alt="Loader Image"  />
        </div>
    )
}


export default withStyles(styles)(Loader);