import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import GuiTheme from "../../app/gui-theme";
import { withStyles } from "@material-ui/styles";
import ReactJson from "react-json-view";
// Custom imports
// import { Scrollbars } from "react-custom-scrollbars";

// Local components
import EndpointsButtons from "./endpoints-buttons/EndpointsButtons";
import OperationsButtons from "./operations-buttons/OperationsButtons";
import PropertiesEditor from "./properties-editor/PropertiesEditor";
import Pagination from "./pagination/Pagination";
// utils imports
import {
  setInLocalStorage,
  getFromLocalStorage,
  jsonStringifyReplacer,
} from "../../utils/utils";
import {extractPageNumberFromString} from "../../utils/utils";
// Service Import
import getRawOutput from "../../services/send-command.js";
// Custom Css modification to Raw Command Input field
const CssTextField = withStyles( {
  root: {
    // "& label.Mui-focused": {
    //   color: GuiTheme.palette.primary.light,
    // },
    // "& .MuiInput-underline:after": {
    //   borderBottomColor: GuiTheme.palette.secondary.main,
    // },
    // "& .MuiOutlinedInput-root": {
    //   "& fieldset": {
    //     borderColor: GuiTheme.palette.primary.light,
    //     height: "55px",
    //   },
    //   "&:hover fieldset": {
    //     borderColor: GuiTheme.palette.secondary.main,
    //   },
    //   "&.Mui-focused fieldset": {
    //     borderColor: GuiTheme.palette.primary.light,
    //   },
    // },
  },
} )( TextField );

// Css Styles to the Components
const styles = ( theme ) => ( {
  propertiesContainer: {
    maxHeight: "30vh",
    width: "100%",
    padding: "1em",
    overflowY: "auto",
    backgroundColor: "white",
  },
  propertyContainer: {
    marginTop: "2px",
    marginBottom: "2px",
  },
  propertyInput: {
    color: GuiTheme.palette.primary.dark,
    marginTop: "1em",
  },
  input: {
    display: "block",
    width: "100%",
  },
  outputContainer: {
    width: "100%",
    padding: "1em",
    overflowY: "auto",
    marginBottom: "1em",
    backgroundColor: "white",
    marginTop: "1em",
    maxHeight: "50vh",
    ["@media (min-width:780px)"]: {
      width: "100%",
      fontSize: "0.8em",
    },
  },
  rawCommandGrid: {
    backgroundColor: "white",
    marginBottom: "1em",
  },
  outputContainerHeader: {
    fontSize: "1.0em",
    padding: "1em",
    letterSpacing: "1px",
  },
  textField: {
    width: "100%",
    margin: "1em",
    color: "#000",
    borderColor: "#0f0",
    fontFamily:
      "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  deleteIconButton: {
    marginLeft: "1em",
    color: GuiTheme.palette.primary.dark,
  },

  endpointButtonContainerOuter: {
    backgroundColor: "white",
    overflow: "auto",
    marginLeft: "1em",
    maxHeight: "50vh",
    ["@media (min-width:780px)"]: {
      backgroundColor: "white",
      marginLeft: "0em",
      width: "100%",
    },
  },
  endpointButtonContainerInner: {
    display: "flex",
    width: "100%",
    borderBottom: "1px solid #E4E4E4",
    ["@media (min-width:780px)"]: {
      flexDirection: "column",
      borderBottom: "none",
    },
  },
  operationsButtonContainer: {
    width: "100%",
    paddingTop: "1em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "column",
    ["@media (min-width:780px)"]: {},
  },
  description: {
    marginBottom: "1em",
    color: "grey",
    letterSpacing: "1px",
  },
  sendRequest: {
    backgroundColor: "#F2C94C",
    float: "right",
    marginRight: "1em",
  },
  consoleGrid: {
    backgroundColor: "white",
  },
  responseGrid: {
    ["@media (min-width:780px)"]: {},
  },
  classDescription: {
    width: "100%",
    margin: "0 auto",
    marginBottom: "0.5em",
    textAlign: "center",
  },
  pages: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
} );

const HydraConsole = ( props ) => {
  var child = React.createRef();
  let endpoints = null;
  const classesMapping = [];
  // var agentEndpoint = "";

  // util variables
  let previousEndpointIndex = 0; // for managing the state and local storage
  let getURL = true;

  // Modifying reference from indexed array[0, 1, 2] to name ["vocab:Drone", "vocab:.."]
  for ( const index in props.hydraClasses ) {
    classesMapping[
      props.hydraClasses[index]["@id"]
    ] = props.hydraClasses[index];
    if ( props.hydraClasses[index]["@id"] === "vocab:EntryPoint" ) {
      endpoints = props.hydraClasses[index].supportedProperty;
    }
  }

  // Initializing empty array with all properties in the ApiDoc
  let classesProperties = {};
  let resourcesIDs = {};
  const classesPropertiesWithMetaData = {};
  for ( const auxClass in classesMapping ) {
    classesProperties[classesMapping[auxClass]["@id"]] = {};
    classesPropertiesWithMetaData[auxClass] = [];
    // Creating the array that will maintain the Resources IDs
    resourcesIDs[classesMapping[auxClass]["@id"]] = {};
    resourcesIDs[classesMapping[auxClass]["@id"]]["ResourceID"] = "";
    for ( const auxProperty in classesMapping[auxClass].supportedProperty ) {
      classesProperties[classesMapping[auxClass]["@id"]][
        classesMapping[auxClass].supportedProperty[auxProperty].title
      ] = "";
      classesPropertiesWithMetaData[auxClass].push( {
        property:
          classesMapping[auxClass].supportedProperty[auxProperty].title,
        required:
          classesMapping[auxClass].supportedProperty[auxProperty].required,
      } );
    }
  }

  // Initialize the local storage with the empty values
  if ( getFromLocalStorage( "properties" ) === null ) {
    setInLocalStorage( "properties", JSON.stringify( classesProperties ) );
  } else {
    classesProperties = JSON.parse( getFromLocalStorage( "properties" ) );
  }

  if ( getFromLocalStorage( "resourceIDs" ) === null ) {
    setInLocalStorage( "resourceIDs", JSON.stringify( resourcesIDs ) );
  } else {
    resourcesIDs = JSON.parse( getFromLocalStorage( "resourceIDs" ) );
  }
  const [state, setState] = useState( {
    hydraClasses: classesMapping,
    classesPropertiesWithMetaData,
    endpoints: endpoints,
    properties: classesProperties,
    resourcesIDs: resourcesIDs,
    selectedEndpointIndex: 0,
    selectedOperationIndex: 1,
    getPage: 1,
    outputText: " Your request output will be displayed here...",
  } );
  useEffect( () => {
    restorePropertiesAndResourceIDs();
  }, [] )
  function changePage( e, page ) {
    sendCommand( page );
  }
  function restorePropertiesAndResourceIDs() {
    if ( previousEndpointIndex !== state.selectedEndpointIndex ) {
      const storedProperties = JSON.parse( getFromLocalStorage( "properties" ) );
      const storedResourceIDs = JSON.parse( getFromLocalStorage( "resourceIDs" ) );

      setState( {
        properties: storedProperties,
        resourcesIDs: storedResourceIDs,
      } );

      // updating for next time
      previousEndpointIndex = state.selectedEndpointIndex;
    }
  }

  function selectEndpoint( endpointIndex, op = "GET" ) {
    var selectedEndpoint = state.endpoints[endpointIndex];
    child.current.selectButton( endpointIndex );
    const temporaryEndpoint = selectedEndpoint.property.range.replace(
      "Collection",
      ""
    );

    const selectedHydraClass = state.hydraClasses[temporaryEndpoint];
    const operations = selectedHydraClass.supportedOperation;
    let selectedOperationIndex = 0;
    operations.forEach( ( operation, index ) => {
      if ( operation.method === op ) selectedOperationIndex = index;
    } );

    setState( {
      selectedEndpointIndex: endpointIndex,
      selectedOperationIndex: selectedOperationIndex,
    } );
  }

  function selectOperation( operationIndex ) {
    setState( { selectedOperationIndex: operationIndex } );
  }

  const handleChange = ( e ) => {
    // Boolean variable that says we will fetch by resource type
    getURL = false;

    const auxProperties = Object.assign( {}, state.properties );
    auxProperties[temporaryEndpoint][e.target.name] = e.target.value;

    setInLocalStorage( "properties", JSON.stringify( auxProperties ) );

    setState( {
      properties: auxProperties,
    } );
  }

  const handleChangeResourceID = ( e ) => {
    // Fetch will work by URL
    getURL = true;

    const resourcesIDs = Object.assign( {}, state.resourcesIDs );
    resourcesIDs[e.target.name]["ResourceID"] = e.target.value;

    setInLocalStorage( "resourceIDs", JSON.stringify( resourcesIDs ) );

    setState( {
      resourcesIDs: resourcesIDs,
    } );
  }

  const  clearAllInputs = ( e ) => {
    // Will clear the current endpoints input
    const auxProperties = Object.assign( {}, state.properties );
    Object.keys( auxProperties[temporaryEndpoint] ).forEach( ( name ) => {
      auxProperties[temporaryEndpoint][name] = "";
    } );

    const resourcesIDs = Object.assign( {}, state.resourcesIDs );
    Object.keys( resourcesIDs ).forEach( ( name ) => {
      resourcesIDs[name]["ResourceID"] = "";
    } );

    setInLocalStorage( "properties", JSON.stringify( auxProperties ) );
    setInLocalStorage( "resourceIDs", JSON.stringify( resourcesIDs ) );

    setState( {
      properties: auxProperties,
      resourcesIDs: resourcesIDs,
    } );
  }

  // var setResourceID = ( name, value ) => {
  //   // This is a utility method to set the Resource Field id from clicking on the output link in output console
  //   getURL = true;
  //   const resourcesIDs = Object.assign( {}, state.resourcesIDs );
  //   resourcesIDs[name]["ResourceID"] = value.split( "/" ).pop();
  //   setInLocalStorage( "resourceIDs", JSON.stringify( resourcesIDs ) );
  //   setState( {
  //     resourcesIDs: resourcesIDs,
  //   } );
  // }
  const sendCommand = async ( page ) => {
    const properties = state.properties[temporaryEndpoint];
    const filteredProperties = {};
    for ( const property in properties ) {
      if ( properties[property] !== "" ) {
        filteredProperties[property] = properties[property];
      }
    }

    const resourceType = selectedEndpoint.property.label.replace(
      "Collection",
      ""
    );

    if ( selectedOperation.method.toLowerCase() === "get" ) {
      filteredProperties["page"] = page;
      let getBody = null;
      let url = "";
      if ( getURL ) {
        if ( state.resourcesIDs[temporaryEndpoint]["ResourceID"] ) {
          url =
            props.serverUrl +
            selectedEndpoint.property.label +
            "/" +
            state.resourcesIDs[temporaryEndpoint]["ResourceID"];
        } else {
          url =
            props.serverUrl + selectedEndpoint.property.label + "/";
        }
        getBody = {
          method: "get",
          url: url,
          filters: filteredProperties,
        };
      } else {
        getBody = {
          method: "get",
          resource_type: resourceType,
          filters: filteredProperties,
        };
      }
      // Call 1
      const rawOutput = await getRawOutput( getBody );
      const outputText = rawOutput.data.members || rawOutput.data;
      const pagination = rawOutput.data.view;
      let lastPage = 1;
      if ( pagination ) {
        lastPage = extractPageNumberFromString( pagination["last"] );
      }

      setState( {
        outputText,
        lastPage,
      } );
    } else if ( selectedOperation.method.toLowerCase() === "put" ) {
      let putBody = null;
      putBody = {
        method: "put",
        url:
          props.serverUrl +
          selectedEndpoint.property.label +
          "/" +
          state.resourcesIDs[temporaryEndpoint]["ResourceID"],
        new_object: filteredProperties,
      };
      filteredProperties["@type"] = resourceType;
      // Call 2
      const rawOutput = await getRawOutput( putBody );
      const outputText = rawOutput.data;
      setState( {
        outputText,
      } );
    } else if ( selectedOperation.method.toLowerCase() === "post" ) {
      let postBody = null;
      postBody = {
        method: "post",
        url:
          props.serverUrl +
          selectedEndpoint.property.label +
          "/" +
          state.resourcesIDs[temporaryEndpoint]["ResourceID"],
        updated_object: filteredProperties,
      };
      filteredProperties["@type"] = resourceType;
      const rawOutput = await getRawOutput( postBody );
      const outputText = rawOutput.data;
      setState( {
        outputText,
      } );
    } else if ( selectedOperation.method.toLowerCase() === "delete" ) {
      let deleteBody = null;
      deleteBody = {
        method: "delete",
        url:
          props.serverUrl +
          selectedEndpoint.property.label +
          "/" +
          state.resourcesIDs[temporaryEndpoint]["ResourceID"],
      };
      const rawOutput = await getRawOutput( deleteBody );
      const outputText = rawOutput.data;
      setState( {
        outputText,
      } );
    }
  }
  // Block of values that need to be re assigned every rendering update
  // They are used below along the html
  const { classes } = props;

  const selectedEndpoint = state.endpoints[
    state.selectedEndpointIndex
  ];

  const temporaryEndpoint = selectedEndpoint.property.range.replace(
    "Collection",
    ""
  );

  const selectedHydraClass = state.hydraClasses[temporaryEndpoint];

  const selectedOperation =
    selectedHydraClass.supportedOperation[state.selectedOperationIndex];

  const stringProps = JSON.stringify(
    state.properties[temporaryEndpoint],
    jsonStringifyReplacer
  );

  let rawCommand = "";
  if ( getURL ) {
    rawCommand =
      "agent." +
      selectedOperation.method.toLowerCase() +
      '("' +
      props.serverUrl +
      selectedEndpoint.property.label +
      "/" +
      state.resourcesIDs[temporaryEndpoint]["ResourceID"] +
      '")';
  } else {
    rawCommand =
      "agent." +
      selectedOperation.method.toLowerCase() +
      '("/' +
      selectedEndpoint.property.label +
      '", ' +
      stringProps +
      ")";
  }

  return (
    <Grid container md={12}>
      <Grid item xs={12} md={5}>
        <div className={classes.endpointButtonContainerOuter}>
          <div className={classes.endpointButtonContainerInner}>
            <EndpointsButtons
              ref={child}
              selectEndpoint={( currProperty ) => {
                selectEndpoint( currProperty );
              }}
              endpoints={state.endpoints}
            ></EndpointsButtons>
          </div>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        md={7}
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.consoleGrid}
      >
        <Grid
          item
          justify="center"
          alignItems="center"
          className={classes.operationsButtonContainer}
        >
          <div className={classes.classDescription}>
            {selectedHydraClass.description}
          </div>
          <div>
            <OperationsButtons
              operations={selectedHydraClass.supportedOperation}
              selectedOperationIndex={state.selectedOperationIndex}
              selectOperation={( currProperty ) => {
                selectOperation( currProperty );
              }}
            ></OperationsButtons>
          </div>
        </Grid>
        <Grid
          className={classes.propertiesContainer}
          item
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid
            className={classes.propertyContainer}
            item
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <label className={classes.propertyInput}>ResourceID:</label>
            <Input
              name={temporaryEndpoint}
              value={state.resourcesIDs[temporaryEndpoint]["ResourceID"]}
              onChange={( e ) => handleChangeResourceID( e )}
              onFocus={( e ) => handleChangeResourceID( e )}
              className={classes.input}
              inputProps={{
                "aria-label": "description",
              }}
            />
          </Grid>
          {selectedOperation.method !== "DELETE" && (
            <PropertiesEditor
              activatedMethod={selectedOperation.method}
              endpoint={temporaryEndpoint}
              properties={state.properties[temporaryEndpoint]}
              metaProps={state.classesPropertiesWithMetaData}
              onChange={( updatedField ) => {
                handleChange( updatedField );
              }}
            ></PropertiesEditor>
          )}
        </Grid>
        <Button
          aria-label="delete"
          size="medium"
          variant="outlined"
          className={classes.deleteIconButton}
          onClick={( e ) => clearAllInputs( e )}
        >
          CLEAR
        </Button>
        <Button
          className={classes.sendRequest}
          onClick={() => sendCommand( 1 )}
        >
          Send Request
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.rawCommandGrid}
      >
        <CssTextField
          id="outlined-name"
          label="Raw Command"
          className={classes.textField}
          onChange={() => { }}
          margin="normal"
          variant="outlined"
          value={rawCommand}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={11}
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.responseGrid}
      >
        <span className={classes.outputContainerHeader}> RESPONSE</span>
        <div className={classes.outputContainer}>
          {typeof state.outputText === "string" ? (
            <ReactJson
              src={{ msg: "Your Output will be displayed here" }}
              name={null}
            />
          ) : (
            <ReactJson src={state.outputText} name={null} />
          )}
        </div>
        <div className={classes.pages}>
          <Pagination
            last_page={state.lastPage}
            paginate={changePage.bind( this )}
          />
        </div>
      </Grid>
    </Grid>
  );

}

export default withStyles( styles )( HydraConsole );
