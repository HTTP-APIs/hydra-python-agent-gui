import React from 'react'
import { withStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import GuiTheme from './../../../app/gui-theme';

const styles = theme => ({
    propertyInput: {
        color: GuiTheme.palette.primary.dark,
        marginLeft: '10px',
        marginRight: '6px',
    },
    propertyContainer: {
        marginTop: '2px',
        marginBottom: '2px'
    },
    input: {
        flex: '100'
    }
});

class PropertiesEditor extends React.Component {
    generateField(propertyName, placeholder = null){
        const { classes } = this.props;
        //this.filledProperties[fieldName];
        return (
        <Grid
            className={classes.propertyContainer}
            container
            direction="row"
            justify="flex-start"
            alignItems="center">
            <label className={classes.propertyInput}> 
                {propertyName}:
            </label>
            <Input
                placeholder={placeholder}
                name={propertyName}
                value={this.props.properties[propertyName]}
                onChange={this.props.onChange}
                className={classes.input}
                inputProps={{
                    'aria-label': 'description',
                }}
            />
        </Grid>)
    }

    generateProperties(){
        let fields = []
    
        for(let property in this.props.properties){
            fields.push(this.generateField(property, null));
        }
        return fields;
    }

    render() {
        return this.generateProperties()
    }
}

export default withStyles(styles)(PropertiesEditor);
