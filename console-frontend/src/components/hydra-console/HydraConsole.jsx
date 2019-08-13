import React from 'react'
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import GuiTheme from '../../app/gui-theme';
import { withStyles } from '@material-ui/styles';

import { Scrollbars } from 'react-custom-scrollbars';

import EndpointsButtons from './endpoints-buttons/EndpointsButtons'
import OperationsButtons from './operations-buttons/OperationsButtons'

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: GuiTheme.palette.primary.light,
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: GuiTheme.palette.secondary.main,
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: GuiTheme.palette.primary.light,
                height: '55px',
            },
            '&:hover fieldset': {
                borderColor: GuiTheme.palette.secondary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: GuiTheme.palette.primary.light,
            },
        },
    },
})(TextField);

const styles = theme => ({
    outContainer: {
        height: '87vh',
        backgroundColor: GuiTheme.palette.primary.dark,
    },
    propertiesContainer: {
        maxHeight: '40vh',
        width: '100%',
        maxWidth: '80%',
        padding: '20px',
        backgroundColor: GuiTheme.palette.primary.light,
        overflowY: 'auto',
        border: '3px solid Gray',
        borderRadius: '25px',
    },
    propertyContainer: {
        marginTop: '2px',
        marginBottom: '2px'
    },
    propertyInput: {
        color: GuiTheme.palette.primary.dark,
        marginLeft: '10px',
        marginRight: '6px',
    },
    outputContainer: {
        height: '40vh',
        width: '90%',
        backgroundColor: GuiTheme.palette.primary.light,
        whiteSpace: 'pre',
        overflowY: 'auto',
    },
    outputContainerHeader: {
        width: '90%',
        backgroundColor: GuiTheme.palette.primary.light,
        fontSize: '1.0em',
        padding: '7px',
        border: '2px solid Gray',
        borderRadius: '6px',
    },
    textField: {
        width: '68%',
        marginRight: '1%',
        color: '#000',
        borderColor: '#0f0'
    },
    sendRequest: {
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
        height: 48,
        width: '22%',
    },
});

class HydraConsole extends React.Component {
    constructor(props) {
        super(props);
        var endpoints = null;
        debugger
        for(var index in this.props.hydraClasses){
            if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }
        debugger
        this.state = {
            hydraClasses: this.props.hydraClasses,
            endpoints: endpoints,
            selectedEndpointIndex: 0,
            selectedOperationIndex: 0,
        };
        
    }

    selectEndpoint(endpointIndex) {
        this.setState(
            {selectedEndpointIndex: endpointIndex}
        )
    }

    selectOperation(operationIndex) {
        this.setState(
            {selectedOperationIndex: operationIndex}
        )
    }

    render() {
        const { classes } = this.props;
        const selectedEndpoint = this.state.endpoints[this.state.selectedEndpointIndex];
        const selectedOperation = selectedEndpoint.property.supportedOperation[
            this.state.selectedOperationIndex];

        var outputText = '{ \n \
                "@id": "/serverapi/DroneCollection/eb37280c-2c65-4c85-a3dc-cfc10be91ac2", \n \
                "@type": "Drone" \n \
            }, \n \
            { \n \
                "@id": "/serverapi/DroneCollection/c22d925c-6626-426e-b94c-b6348d1c728f", \n \
                "@type": "Drone" \n \
            }, \n \
            { \n \
                "@id": "/serverapi/DroneCollection/c22d925c-6626-426e-b94c-b6348d1c728f", \n \
                "@type": "Drone" \n \
            }, \n \
            { \n \
                "@id": "/serverapi/DroneCollection/c22d925c-6626-426e-b94c-b6348d1c728f", \n \
                "@type": "Drone" \n \
            }, \n \
            { \n \
                "@id": "/serverapi/DroneCollection/c22d925c-6626-426e-b94c-b6348d1c728f", \n \
                "@type": "Drone" \n \
            }, \n \
            { \n \
                "@id": "/serverapi/DroneCollection/c22d925c-6626-426e-b94c-b6348d1c728f", \n \
                "@type": "Drone" \n \
            }, \n \
            { \n \
                "@id": "/serverapi/DroneCollection/15ba987b-ddd6-4084-af52-7167fb1fc8ab", \n \
                "@type": "Drone" \n \
            }, \n \
        { \n \
                "@id": "/serverapi/DroneCollection/15ba987b-ddd6-4084-af52-7167fb1fc8ab", \n \
                "@type": "Drone" \n \
            }, \n \
        { \n \
                "@id": "/serverapi/DroneCollection/15ba987b-ddd6-4084-af52-7167fb1fc8ab", '

        return (
            <Grid container className={classes.outContainer}>
                <Grid item md={4} xs={12} container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center">
                    <EndpointsButtons
                        selectEndpoint={ (currProperty) => {
                            this.selectEndpoint(currProperty) }}
                        endpoints={this.state.endpoints}>   
                    </EndpointsButtons>
                </Grid>
                <Grid
                    item md={2} xs={12} container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center">
                    <OperationsButtons
                        operations={selectedEndpoint.property.supportedOperation}
                        selectOperation={ (currProperty) => {
                            this.selectOperation(currProperty)
                        }}> 
                    </OperationsButtons>
                </Grid>
                <Grid
                    item md={6} xs={12} container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Grid className={classes.propertiesContainer}
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center">
                        <label> {"{"} </label>
                        <Grid
                            className={classes.propertyContainer}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <label className={classes.propertyInput}>label: </label>
                            <Input
                                placeholder=" default value"
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </Grid>
                        <Grid
                            className={classes.propertyContainer}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <label className={classes.propertyInput}>label: </label>
                            <Input
                                placeholder=" default value"
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </Grid>
                        <Grid
                            className={classes.propertyContainer}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <label className={classes.propertyInput}>label: </label>
                            <Input
                                placeholder=" default value"
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </Grid>
                        <Grid
                            className={classes.propertyContainer}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <label className={classes.propertyInput}>label: </label>
                            <Input
                                placeholder=" default value"
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </Grid>
                        <Grid
                            className={classes.propertyContainer}
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <label className={classes.propertyInput}>label: </label>
                            <Input
                                placeholder=" default value"
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </Grid>
                        <label> {"}"} </label>
                    </Grid>
                </Grid>
                <Grid item xs={12}
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <CssTextField
                        id="outlined-name"
                        label="Raw Command"
                        inputProps={{
                            style: { color: GuiTheme.palette.primary.light },
                        }}
                        InputLabelProps={{
                            style: { color: GuiTheme.palette.primary.light },
                        }}
                        className={classes.textField}
                        onChange={() => { }}
                        margin="normal"
                        variant="outlined"
                        value={"agent." + selectedOperation.method.toLowerCase() +
                               "(\"" + selectedEndpoint.property.label + "\")"}
                    />
                    <Button variant="contained" color="secondary"
                            className={classes.sendRequest}> 
                        Send Request
                    </Button>
                </Grid>
                <Grid item xs={12}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <span className={classes.outputContainerHeader} > Output</span>
                    <div className={classes.outputContainer}>
                        <Scrollbars>
                            {outputText}
                        </Scrollbars>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(HydraConsole);