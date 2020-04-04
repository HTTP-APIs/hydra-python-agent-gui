import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import GuiTheme from '../../app/gui-theme';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';

// Custom imports
import { Scrollbars } from 'react-custom-scrollbars';

// Local components
import EndpointsButtons from './endpoints-buttons/EndpointsButtons'
import OperationsButtons from './operations-buttons/OperationsButtons'
import PropertiesEditor from './properties-editor/PropertiesEditor'

// Custom Css modification to Raw Command Input field
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

// Css Styles to the Components
const styles = theme => ({
    outContainer: {
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
    input: {
        flex: '100',
    },
    outputContainer: {
        minHeight: '300px',
        width: '90%',
        backgroundColor: GuiTheme.palette.primary.light,
        whiteSpace: 'pre',
        overflowY: 'auto',
        ['@media (min-width:780px)']: { 
            width: '80%',
            fontSize: '0.8em'
        }
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
    deleteIconButton: {
        marginLeft: '60% !important',
        marginBottom: '10px',
        backgroundColor: GuiTheme.palette.primary.light,
        color: GuiTheme.palette.primary.dark,
        '&:hover': {
            backgroundColor: GuiTheme.palette.secondary.light,
            color: GuiTheme.palette.primary.dark,
        },
    },
    outputConsoleBraces: {
        marginLeft: '20px'
    },
    objectValue: {
        display: 'flex'
    },
    objectValueKeyValueLink: {
        marginLeft: '10px',
        color: '#0276FD',
        cursor: 'pointer'
    },
    objectValueKey: {
        marginLeft: '5px'
    },
    objectValueKeyValue: {
        marginLeft: '10px'
    }
});


function isObject(value) {
    // utility method that returns boolean value
    return value && typeof value === "object" && value.constructor === Object;
}
  
function isArray(value) {
    // utility method that returns boolean value
    return value && typeof value === "object" && value.constructor === Array;
}
  
function isString(value) {
    // utility method that returns boolean value
    return typeof value === "string" || value instanceof String;
}

class HydraConsole extends React.Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        let endpoints = null;
        const classesMapping = []
        this.agentEndpoint = ""

        // util variables
        this.temporaryEndpoint = null;
        this.previousEndpointIndex = 0; // for managing the state and local storage
        this.selectedEndpoint = null;
        this.selectedOperation = null;
        this.getURL = true;
        
        // Modifying reference from indexed array[0, 1, 2] to name ["vocab:Drone", "vocab:.."]
        for(const index in this.props.hydraClasses){
            classesMapping[this.props.hydraClasses[index]['@id']] = this.props.hydraClasses[index];
            if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }

        // Initializing empty array with all properties in the ApiDoc
        let classesProperties = {}
        let resourcesIDs = {}
        for(const auxClass in classesMapping){
            classesProperties[classesMapping[auxClass]['@id']] = {}
            // Creating the array that will maintain the Resources IDs
            resourcesIDs[classesMapping[auxClass]['@id']] = {}
            resourcesIDs[classesMapping[auxClass]['@id']]['ResourceID'] = "" 
            for( const auxProperty in  classesMapping[auxClass].supportedProperty ) {
                classesProperties[classesMapping[auxClass]['@id']][
                    classesMapping[auxClass].supportedProperty[auxProperty].title] = ""
            }
        }
        
        // Initialize the local storage with the empty values
        if (localStorage.getItem('properties') === null) {
            localStorage.setItem('properties', JSON.stringify(classesProperties))
        }else{
            classesProperties = JSON.parse(localStorage.getItem('properties'))
        }

        if (localStorage.getItem('resourceIDs') === null) {
            localStorage.setItem('resourceIDs', JSON.stringify(resourcesIDs))
        }else{
            resourcesIDs = JSON.parse(localStorage.getItem('resourceIDs'))
        }

        this.state = {
            hydraClasses: classesMapping,
            endpoints: endpoints,
            properties: classesProperties,
            resourcesIDs: resourcesIDs,
            selectedEndpointIndex: 0,
            selectedOperationIndex: 0,
            outputText: " Your request output will be displayed here..."
        };      

    }

    componentDidMount() {
    }

    componentDidUpdate() {
        this.restorePropertiesAndResourceIDs()
    }

    restorePropertiesAndResourceIDs() {
        if(this.previousEndpointIndex != this.state.selectedEndpointIndex) {
            const storedProperties = JSON.parse(localStorage.getItem('properties'))
            const storedResourceIDs = JSON.parse(localStorage.getItem('resourceIDs'))
           
            this.setState({
                properties: storedProperties,
                resourcesIDs: storedResourceIDs
            })

            // updating for next time
            this.previousEndpointIndex = this.state.selectedEndpointIndex 
        }
    }

    selectEndpoint(endpointIndex, op="GET") {
        const selectedEndpoint = this.state.endpoints[endpointIndex];
        this.selectedEndpoint = selectedEndpoint;
        this.child.current.selectButton(endpointIndex);

        const temporaryEndpoint = selectedEndpoint.property.range.replace("Collection", "")
        this.temporaryEndpoint = temporaryEndpoint;

        const selectedHydraClass = this.state.hydraClasses[temporaryEndpoint];       
        const operations = selectedHydraClass.supportedOperation;
        let selectedOperationIndex = 0;
        operations.map((operation, index) => {
            if(operation.method == op)
                selectedOperationIndex = index
        })
    
        this.setState({
                selectedEndpointIndex: endpointIndex,
                selectedOperationIndex: selectedOperationIndex
        })
     

    }

    selectOperation(operationIndex) {
        this.setState(
            {selectedOperationIndex: operationIndex}
        )
    }

    handleChange(e){
        // Boolean variable that says we will fetch by resource type
        this.getURL = false;

        const auxProperties = Object.assign({}, this.state.properties);
        auxProperties[this.temporaryEndpoint][e.target.name] = e.target.value;
       
        localStorage.setItem('properties', JSON.stringify(auxProperties))
       
        this.setState({
            properties: auxProperties
        })
    }

    handleChangeResourceID(e){
        // Fetch will work by URL
        this.getURL = true;

        const resourcesIDs = Object.assign({}, this.state.resourcesIDs);
        resourcesIDs[e.target.name]['ResourceID'] = e.target.value;

        localStorage.setItem('resourceIDs', JSON.stringify(resourcesIDs))
        
        this.setState({
            resourcesIDs: resourcesIDs
        })
    }

    clearAllInputs(e) {
        // Will clear the current endpoints input 
        const auxProperties = Object.assign({}, this.state.properties);
        Object.keys(auxProperties[this.temporaryEndpoint]).map(name => {
            auxProperties[this.temporaryEndpoint][name] = ""
        })

        const resourcesIDs = Object.assign({}, this.state.resourcesIDs);
        Object.keys(resourcesIDs).map(name => {
            resourcesIDs[name]['ResourceID'] = ""
        })

        localStorage.setItem('properties', JSON.stringify(auxProperties))
        localStorage.setItem('resourceIDs', JSON.stringify(resourcesIDs))


        this.setState({
            properties: auxProperties,
            resourcesIDs: resourcesIDs
        })
    }

    setResourceID(name, value) {
        // This is a ulitlity method to set the Resource Field id from clicking on the output link in output console
        this.getURL = true;
        const resourcesIDs = Object.assign({}, this.state.resourcesIDs);
        resourcesIDs[name]['ResourceID'] = value.split('/').pop();

        localStorage.setItem('resourceIDs', JSON.stringify(resourcesIDs))
        
        this.setState({
            resourcesIDs: resourcesIDs
        })
    }

    printObjectValue = (value) => {
        //  A helper method printObject() method to print its key value 
        const classes = this.props.classes

        return Object.keys(value).map(key => {        
            if(key == '@id'){
                // link has to be returned
                return(
                <div className={classes.objectValue}>
                    <div className={classes.objectValueKey}>{key} :</div>
                    <div className={classes.objectValueKeyValueLink} 
                         onClick={(e) => this.setResourceID(this.temporaryEndpoint, value[key])}>
                        {value[key]},
                    </div>
                </div>
                )
            }
        
            if (isString(value[key]))
              return (
                <div className={classes.objectValue}>
                    <div className={classes.objectValueKey}>{key} :</div>
                    <div className={classes.objectValueKeyValue}>{value[key]},</div>
                </div>
              );
            if (isObject(value[key]))
              return (
                <div className={classes.objectValue}>
                    <div className={classes.objectValueKey}>{key} :</div> 
                    <div className={classes.objectValueKeyValue}>{this.printObject(value[key])}</div>
                </div>
              );
            if (isArray(value[key]))
              return (
                <div className={classes.objectValue}>
                    <div className={classes.objectValueKey}>{key} :</div> 
                    <div className={classes.objectValueKeyValue}>{this.printArray(value[key])}</div>
                </div>
              );
          });
    }

    printObject(value, isFirst=false) {
        // Utility method to print key value pair of object
        const classes = this.props.classes
        
       if(Object.keys(value).length == 0){
           // empty object, &#123; is code for '{' and &125; is for '}'
           return(
               <div className={classes.emptyObject}>&#123; &#125;</div>
           )
       }

       return(
           <div className={classes.printObjectClass}>
               <div>&#123;</div>
                    <div className={classes.outputConsoleBraces}>
                    {this.printObjectValue(value)}
                    </div>
                <div>&#125;{(!isFirst)?",":""}</div>
           </div>
       )
 
     }
     
     printArrayValue = (value) => {
         // A helper method for printArray() to print all the values inside the Array
        const classes = this.props.classes
        return value.map(v => {
            if (isString(v))
              return (
                <div className={classes.arrayValue}>
                   {v},
                </div>
              );
            if (isObject(v))
              return (
                <div className={classes.arrayValue}>
                    {this.printObject(v)}
                </div>
              );
            if (isArray(v))
              return (
                <div className={classes.arrayValue}>
                    {this.printArray(v)}
                </div>
              );
            return null;
          });
     }

     printArray = (value, isFirst=false) => {
       // utility method to print values of array in output console
        const classes = this.props.classes
       if(value.length == 0){
           // Empty Array
           return (
               <div className={classes.emptyArray}>[]</div>
           )
       }
     
       return(
           <div className={classes.printArrayClass}>
               <div>[</div>
                    <div className={classes.outputConsoleBraces}>
                        {this.printArrayValue(value)}
                    </div>
               <div>]{(!isFirst)?",":""}</div>
           </div>
       )
     }
     

    convertOutput = data => {
       // a generic method to print output on console of any response provided by the server
       if (isArray(data)) {
            return (
                <div>
                    {this.printArray(data, true)}
                </div>
          );
       }
       if (isObject(data)) {
        return (
            <div>
                {this.printObject(data, true)}
            </div>
        );
       }
        return <div>{JSON.stringify(data, this.jsonStringifyReplacer, 8)}</div>
     };

    sendCommand(){
        const properties = this.state.properties[this.temporaryEndpoint];
        const filteredProperties = {}
        for(const property in properties){
            if(properties[property] !== ""){
                filteredProperties[property] = properties[property];
            }
        }

        const resourceType = this.selectedEndpoint.property.label.replace("Collection", "")

        if(this.selectedOperation.method.toLowerCase() === 'get'){
            let getBody = null
            if(this.getURL){
                getBody = {
                    method: 'get',
                    url: this.props.serverUrl + this.selectedEndpoint.property.label + "/" +
                    this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID']
                }
            }else{    
                getBody = {
                    method: 'get',
                    resource_type: resourceType,
                    filters: filteredProperties,
                }
            }
            axios.post(this.agentEndpoint + '/send-command', getBody)
              .then( (response) =>  {
                let outputText = ""
                outputText = this.convertOutput(response.data)
                this.setState({
                    outputText,
                })
              })
              .catch(function (error) {
                console.log(error);
              });
              return;
        }
        else if(this.selectedOperation.method.toLowerCase() === 'put'){
            let putBody = null;
            putBody = {
                method: 'put',
                url: this.props.serverUrl + this.selectedEndpoint.property.label + "/" +
                     this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'],
                new_object: filteredProperties,
            }
            filteredProperties['@type'] = resourceType;
            axios.post(this.agentEndpoint + '/send-command', putBody)
            .then( (response) =>  {
                let outputText = ""
                outputText = this.convertOutput(response.data)
              this.setState({
                  outputText,
              })
            })
            .catch(function (error) {
              console.log(error);
            });
            return
        }
        else if(this.selectedOperation.method.toLowerCase() === 'post'){
            let postBody = null;
            postBody = {
                method: 'post',
                url: this.props.serverUrl + this.selectedEndpoint.property.label + "/" +
                     this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'],
                updated_object: filteredProperties,
            }
            filteredProperties['@type'] = resourceType;
            axios.post(this.agentEndpoint + '/send-command', postBody)
            .then( (response) =>  {
              let outputText = ""
              outputText = this.convertOutput(response.data)
              this.setState({
                  outputText,
              })
            })
            .catch(function (error) {
              console.log(error);
            });
            return
        }else if(this.selectedOperation.method.toLowerCase() === 'delete'){
            let deleteBody = null;
            deleteBody = {
                method: 'delete',
                url: this.props.serverUrl + this.selectedEndpoint.property.label +
                     "/" + this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'],
            }
            axios.post(this.agentEndpoint + '/send-command', deleteBody)
            .then( (response) =>  {
              let outputText = ""
              outputText = this.convertOutput(response.data)
              this.setState({
                  outputText,
              })
            })
            .catch(function (error) {
              console.log(error);
            });
            return
        }
        axios.post(this.agentEndpoint + '/send-command', {
            method: this.selectedOperation.method.toLowerCase(),
            resource_type: this.selectedEndpoint.property.label,
            filters: this.state.properties[this.temporaryEndpoint],
          })
          .then(function (response) {
            let outputText = ""
            outputText = this.convertOutput(response)
                this.setState({
                    outputText,
                })
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    jsonStringifyReplacer(key, value) {
        // Filtering out properties
        if (value === "") {
          return undefined;
        }
        return value;
      }
      
    render() {
        // Block of values that need to be re assigned every rendering update
        // They are used below along the html
        const { classes } = this.props;
        const selectedEndpoint = this.state.endpoints[this.state.selectedEndpointIndex];
        this.selectedEndpoint = selectedEndpoint;

        const temporaryEndpoint = selectedEndpoint.property.range.replace("Collection", "")
        this.temporaryEndpoint = temporaryEndpoint;
       
        const selectedHydraClass = this.state.hydraClasses[temporaryEndpoint];

        const selectedOperation = selectedHydraClass.supportedOperation[this.state.selectedOperationIndex];
        this.selectedOperation = selectedOperation;
        
        const stringProps = JSON.stringify(this.state.properties[temporaryEndpoint], this.jsonStringifyReplacer);
        
        let rawCommand = "";
        if(this.getURL){
            rawCommand = "agent." + this.selectedOperation.method.toLowerCase() +
                         "(\"" + this.props.serverUrl +
                         this.selectedEndpoint.property.label + "/" +
                         this.state.resourcesIDs[this.temporaryEndpoint]['ResourceID'] + "\")"
        }else{
            rawCommand = "agent." + this.selectedOperation.method.toLowerCase() +
                               "(\"/" + selectedEndpoint.property.label + "\", "  +
                               stringProps + ")"
        }

        return (
            <Grid container className={classes.outContainer} md={12}>
                <Grid item xs={12} lg={5} container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center">
                    <EndpointsButtons
                        ref={this.child}
                        selectEndpoint={ (currProperty) => {
                            this.selectEndpoint(currProperty) }}
                        endpoints={this.state.endpoints}>   
                    </EndpointsButtons>
                </Grid>
                <Grid
                    item xs={12} lg={2} container
                    direction="column"
                    justify="space-evenly"
                    alignItems="center">
                    <OperationsButtons
                        operations={selectedHydraClass.supportedOperation}
                        selectedOperationIndex={this.state.selectedOperationIndex}
                        selectOperation={ (currProperty) => {
                            this.selectOperation(currProperty)
                        }}> 
                    </OperationsButtons>
                </Grid>
                <Grid
                    item xs={12} lg={5} container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Button aria-label="delete" 
                        size="medium"
                        variant="contained" 
                        className={classes.deleteIconButton}
                        onClick={(e) => this.clearAllInputs(e)}>
                        CLEAR
                    </Button>
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
                            {this.state.outputText}
                        </Scrollbars>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(HydraConsole);