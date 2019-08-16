import React from 'react'
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import GuiTheme from '../../app/gui-theme';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';

import { Scrollbars } from 'react-custom-scrollbars';

import EndpointsButtons from './endpoints-buttons/EndpointsButtons'
import OperationsButtons from './operations-buttons/OperationsButtons'
import PropertiesEditor from './properties-editor/PropertiesEditor'

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
        var classesMapping = []

        // Modifying reference from indexed array[0, 1, 2] to name ["vocab:Drone", "vocab:.."]
        for(var index in this.props.hydraClasses){
            classesMapping[this.props.hydraClasses[index]['@id']] = this.props.hydraClasses[index];
            if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }

        // Initializing empty array with all properties in the ApiDoc
        var classesProperties = {}
        for( var auxClass in classesMapping){
            classesProperties[classesMapping[auxClass]['@id']] = {}
            for( var auxProperty in  classesMapping[auxClass].supportedProperty ) {
                classesProperties[classesMapping[auxClass]['@id']][
                    classesMapping[auxClass].supportedProperty[auxProperty].title] = ""
            }
        }
        this.state = {
            hydraClasses: classesMapping,
            endpoints: endpoints,
            properties: classesProperties,
            selectedEndpointIndex: 0,
            selectedOperationIndex: 0,
        };      
        
        this.temporaryEndpoint = null;
        this.selectedEndpoint = null;
        this.selectedOperation = null;
    }

    componentDidMount() {
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

    handleChange(e){
        // Boolean variable that says we will fetch by resource type
        this.getURL = false;

        let auxProperties = Object.assign({}, this.state.properties);
        auxProperties[this.temporaryEndpoint][e.target.name] = e.target.value;
        this.setState({
            properties: auxProperties
        })
    }

    handleChangeResourceID(e){
        // Fetch will work by URL
        this.getURL = true;

        let resourcesIDs = Object.assign({}, this.state.resourcesIDs);
        resourcesIDs[e.target.name]['ResourceID'] = e.target.value;
        this.setState({
            resourcesIDs: resourcesIDs
        })

        //debugger
        //this.resourcesIDs[e.target.name]['ResourceID'] = e.target.value;
    }

    sendCommand(){
        const properties = this.state.properties[this.temporaryEndpoint];
        var filteredProperties = {}
        for(var property in properties){
            if(properties[property] !== ""){
                filteredProperties[property] = properties[property];
            }
        }

        const resourceType = this.selectedEndpoint.property.label.replace("Collection", "")

        if(this.selectedOperation.method.toLowerCase() === 'get'){
            var getBody = null
            if(this.getURL){
                getBody = {
                    method: 'get',
                    url: this.props.serverUrl + this.selectedEndpoint.property.label + "/" + this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID']
                }
            }else{    
                getBody = {
                    method: 'get',
                    resource_type: resourceType,
                    filters: filteredProperties,
                }
            }
            axios.post('http://localhost:5000/send-command', getBody)
              .then( (response) =>  {
                this.setState({
                    outputText: JSON.stringify(response.data, this.jsonStringifyReplacer, 8),
                })
              })
              .catch(function (error) {
                console.log(error);
              });
              return;
        }
        else if(this.selectedOperation.method.toLowerCase() === 'put'){
            var putBody = null;
            putBody = {
                method: 'put',
                url: this.props.serverUrl + this.selectedEndpoint.property.label + "/" +
                     this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'],
                new_object: filteredProperties,
            }
            filteredProperties['@type'] = resourceType;
            //debugger
            axios.post('http://localhost:5000/send-command', putBody)
            .then( (response) =>  {
              this.setState({
                  outputText: JSON.stringify(response.data, this.jsonStringifyReplacer, 8),
              })
            })
            .catch(function (error) {
              console.log(error);
            });
            return
        }
        else if(this.selectedOperation.method.toLowerCase() === 'post'){
            var postBody = null;
            postBody = {
                method: 'post',
                url: this.props.serverUrl + this.selectedEndpoint.property.label + "/" +
                     this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'],
                updated_object: filteredProperties,
            }
            filteredProperties['@type'] = resourceType;
            axios.post('http://localhost:5000/send-command', postBody)
            .then( (response) =>  {
              this.setState({
                  outputText: JSON.stringify(response.data, this.jsonStringifyReplacer, 8),
              })
            })
            .catch(function (error) {
              console.log(error);
            });
            return
        }else if(this.selectedOperation.method.toLowerCase() === 'delete'){
            var deleteBody = null;
            deleteBody = {
                method: 'delete',
                url: this.props.serverUrl + this.selectedEndpoint.property.label +
                     "/" + this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'],
            }
            axios.post('http://localhost:5000/send-command', deleteBody)
            .then( (response) =>  {
              this.setState({
                  outputText: JSON.stringify(response.data, this.jsonStringifyReplacer, 8),
              })
            })
            .catch(function (error) {
              console.log(error);
            });
            return
        }
        // this.props.serverUrl  url

        // this.resourcesIDs[this.temporaryEndpoint]['ResourceID']

        axios.post('http://localhost:5000/send-command', {
            method: this.selectedOperation.method.toLowerCase(),
            resource_type: this.selectedEndpoint.property.label,
            filters: this.state.properties[this.temporaryEndpoint],
            //url: 'Flintstone',
          })
          .then(function (response) {
                this.setState({
                    outputText: response,
                })
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        
        //this.outputText 
    }

    jsonStringifyReplacer(key, value) {
        // Filtering out properties
        if (value === "") {
          return undefined;
        }
        return value;
      }
      

    render() {
        const { classes } = this.props;

        const selectedEndpoint = this.state.endpoints[this.state.selectedEndpointIndex];
        this.selectedEndpoint = selectedEndpoint;

        const selectedOperation = selectedEndpoint.property.supportedOperation[
            this.state.selectedOperationIndex];
        this.selectedOperation = selectedOperation;

        const temporaryEndpoint = selectedEndpoint.property.range.replace("Collection", "")
        this.temporaryEndpoint = temporaryEndpoint;

        var stringProps = JSON.stringify(this.state.properties[temporaryEndpoint], this.jsonStringifyReplacer);
        
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
                            <label className={classes.propertyInput}> 
                                ResourceID:
                            </label>
                            <Input
                                placeholder="Object ID"
                                name={temporaryEndpoint}
                                value={ this.state.resourcesIDs[temporaryEndpoint]['ResourceID'] }
                                onChange={ (e) => this.handleChangeResourceID(e) }
                                onFocus={ (e) => this.handleChangeResourceID(e) }
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                        </Grid>
                        {this.selectedOperation.method !== "DELETE" &&
                        <PropertiesEditor
                            properties={this.state.properties[temporaryEndpoint]}
                            onChange={ (updatedField) => {this.handleChange(updatedField) }}>
                        </PropertiesEditor>}
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
                        value={rawCommand}
                    />
                    <Button variant="contained" color="secondary"
                            className={classes.sendRequest}
                            onClick={() => this.sendCommand()}> 
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