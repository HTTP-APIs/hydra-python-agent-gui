import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import GuiTheme from "../../app/gui-theme";
import { withStyles } from "@material-ui/styles";
import ReactJson from "react-json-view";
// Custom imports
import { Scrollbars } from "react-custom-scrollbars";

// Local components
import EndpointsButtons from "./endpoints-buttons/EndpointsButtons";
import OperationsButtons from "./operations-buttons/OperationsButtons";
import PropertiesEditor from "./properties-editor/PropertiesEditor";
// utils imports
import {
  setInLocalStorage,
  getFromLocalStorage,
  jsonStringifyReplacer,
} from "../../utils/utils";
// Service Import
import getRawOutput from "../../services/send-command.js";
// Custom Css modification to Raw Command Input field
const CssTextField = withStyles({
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
})(TextField);

// Css Styles to the Components
const styles = (theme) => ({
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
});

class HydraConsole extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    let endpoints = null;
    const classesMapping = [];
    this.agentEndpoint = "";

    // util variables
    this.temporaryEndpoint = null;
    this.previousEndpointIndex = 0; // for managing the state and local storage
    this.selectedEndpoint = null;
    this.selectedOperation = null;
    this.getURL = true;

    // Modifying reference from indexed array[0, 1, 2] to name ["vocab:Drone", "vocab:.."]
    for (const index in this.props.hydraClasses) {
      classesMapping[
        this.props.hydraClasses[index]["@id"]
      ] = this.props.hydraClasses[index];
      if (this.props.hydraClasses[index]["@id"] === "vocab:EntryPoint") {
        endpoints = this.props.hydraClasses[index].supportedProperty;
      }
    }

    // Initializing empty array with all properties in the ApiDoc
    let classesProperties = {};
    let resourcesIDs = {};
    let classesPropertiesWithMetaData = {};
    for (const auxClass in classesMapping) {
      classesProperties[classesMapping[auxClass]["@id"]] = {};
      classesPropertiesWithMetaData[auxClass] = [];
      // Creating the array that will maintain the Resources IDs
      resourcesIDs[classesMapping[auxClass]["@id"]] = {};
      resourcesIDs[classesMapping[auxClass]["@id"]]["ResourceID"] = "";
      for (const auxProperty in classesMapping[auxClass].supportedProperty) {
        classesProperties[classesMapping[auxClass]["@id"]][
          classesMapping[auxClass].supportedProperty[auxProperty].title
        ] = "";
        classesPropertiesWithMetaData[auxClass].push({
          property:
            classesMapping[auxClass].supportedProperty[auxProperty].title,
          required:
            classesMapping[auxClass].supportedProperty[auxProperty].required,
        });
      }
    }

    // Initialize the local storage with the empty values
    if (getFromLocalStorage("properties") === null) {
      setInLocalStorage("properties", JSON.stringify(classesProperties));
    } else {
      classesProperties = JSON.parse(getFromLocalStorage("properties"));
    }

    if (getFromLocalStorage("resourceIDs") === null) {
      setInLocalStorage("resourceIDs", JSON.stringify(resourcesIDs));
    } else {
      resourcesIDs = JSON.parse(getFromLocalStorage("resourceIDs"));
    }

    this.state = {
      hydraClasses: classesMapping,
      classesPropertiesWithMetaData,
      endpoints: endpoints,
      properties: classesProperties,
      resourcesIDs: resourcesIDs,
      selectedEndpointIndex: 0,
      selectedOperationIndex: 0,
      outputText: " Your request output will be displayed here...",
    };
  }
  componentDidUpdate() {
    this.restorePropertiesAndResourceIDs();
  }

  restorePropertiesAndResourceIDs() {
    if (this.previousEndpointIndex !== this.state.selectedEndpointIndex) {
      const storedProperties = JSON.parse(getFromLocalStorage("properties"));
      const storedResourceIDs = JSON.parse(getFromLocalStorage("resourceIDs"));

      this.setState({
        properties: storedProperties,
        resourcesIDs: storedResourceIDs,
      });

      // updating for next time
      this.previousEndpointIndex = this.state.selectedEndpointIndex;
    }
  }

  selectEndpoint(endpointIndex, op = "GET") {
    const selectedEndpoint = this.state.endpoints[endpointIndex];
    this.selectedEndpoint = selectedEndpoint;
    this.child.current.selectButton(endpointIndex);

    const temporaryEndpoint = selectedEndpoint.property.range.replace(
      "Collection",
      ""
    );
    this.temporaryEndpoint = temporaryEndpoint;

    const selectedHydraClass = this.state.hydraClasses[temporaryEndpoint];
    const operations = selectedHydraClass.supportedOperation;
    let selectedOperationIndex = 0;
    operations.forEach((operation, index) => {
      if (operation.method === op) selectedOperationIndex = index;
    });

    this.setState({
      selectedEndpointIndex: endpointIndex,
      selectedOperationIndex: selectedOperationIndex,
    });
  }

  selectOperation(operationIndex) {
    this.setState({ selectedOperationIndex: operationIndex });
  }

  handleChange(e) {
    // Boolean variable that says we will fetch by resource type
    this.getURL = false;

    const auxProperties = Object.assign({}, this.state.properties);
    auxProperties[this.temporaryEndpoint][e.target.name] = e.target.value;

    setInLocalStorage("properties", JSON.stringify(auxProperties));

    this.setState({
      properties: auxProperties,
    });
  }

  handleChangeResourceID(e) {
    // Fetch will work by URL
    this.getURL = true;

    const resourcesIDs = Object.assign({}, this.state.resourcesIDs);
    resourcesIDs[e.target.name]["ResourceID"] = e.target.value;

    setInLocalStorage("resourceIDs", JSON.stringify(resourcesIDs));

    this.setState({
      resourcesIDs: resourcesIDs,
    });
  }

  clearAllInputs(e) {
    // Will clear the current endpoints input
    const auxProperties = Object.assign({}, this.state.properties);
    Object.keys(auxProperties[this.temporaryEndpoint]).forEach((name) => {
      auxProperties[this.temporaryEndpoint][name] = "";
    });

    const resourcesIDs = Object.assign({}, this.state.resourcesIDs);
    Object.keys(resourcesIDs).forEach((name) => {
      resourcesIDs[name]["ResourceID"] = "";
    });

    setInLocalStorage("properties", JSON.stringify(auxProperties));
    setInLocalStorage("resourceIDs", JSON.stringify(resourcesIDs));

    this.setState({
      properties: auxProperties,
      resourcesIDs: resourcesIDs,
    });
  }

  setResourceID(name, value) {
    // This is a ulitlity method to set the Resource Field id from clicking on the output link in output console
    this.getURL = true;
    const resourcesIDs = Object.assign({}, this.state.resourcesIDs);
    resourcesIDs[name]["ResourceID"] = value.split("/").pop();
    setInLocalStorage("resourceIDs", JSON.stringify(resourcesIDs));
    this.setState({
      resourcesIDs: resourcesIDs,
    });
  }
  // Put this in service
  async sendCommand() {
    const properties = this.state.properties[this.temporaryEndpoint];
    const filteredProperties = {};
    for (const property in properties) {
      if (properties[property] !== "") {
        filteredProperties[property] = properties[property];
      }
    }

    const resourceType = this.selectedEndpoint.property.label.replace(
      "Collection",
      ""
    );

    if (this.selectedOperation.method.toLowerCase() === "get") {
      let getBody = null;
      if (this.getURL) {
        getBody = {
          method: "get",
          url:
            this.props.serverUrl +
            this.selectedEndpoint.property.label +
            "/" +
            this.state.resourcesIDs[this.temporaryEndpoint]["ResourceID"],
        };
      } else {
        getBody = {
          method: "get",
          resource_type: resourceType,
          filters: filteredProperties,
        };
      }
      // Call 1
      const rawOutput = await getRawOutput(getBody);
      const outputText = rawOutput.data;
      this.setState({
        outputText,
      });
    } else if (this.selectedOperation.method.toLowerCase() === "put") {
      let putBody = null;
      putBody = {
        method: "put",
        url:
          this.props.serverUrl +
          this.selectedEndpoint.property.label +
          "/" +
          this.state.resourcesIDs[this.temporaryEndpoint]["ResourceID"],
        new_object: filteredProperties,
      };
      filteredProperties["@type"] = resourceType;
      // Call 2
      const rawOutput = await getRawOutput(putBody);
      const outputText = rawOutput.data;
      this.setState({
        outputText,
      });
    } else if (this.selectedOperation.method.toLowerCase() === "post") {
      let postBody = null;
      postBody = {
        method: "post",
        url:
          this.props.serverUrl +
          this.selectedEndpoint.property.label +
          "/" +
          this.state.resourcesIDs[this.temporaryEndpoint]["ResourceID"],
        updated_object: filteredProperties,
      };
      filteredProperties["@type"] = resourceType;
      const rawOutput = await getRawOutput(postBody);
      const outputText = rawOutput.data;
      this.setState({
        outputText,
      });
    } else if (this.selectedOperation.method.toLowerCase() === "delete") {
      let deleteBody = null;
      deleteBody = {
        method: "delete",
        url:
          this.props.serverUrl +
          this.selectedEndpoint.property.label +
          "/" +
          this.state.resourcesIDs[this.temporaryEndpoint]["ResourceID"],
      };
      const rawOutput = await getRawOutput(deleteBody);
      const outputText = rawOutput.data;
      this.setState({
        outputText,
      });
    }
  }

  render() {
    // Block of values that need to be re assigned every rendering update
    // They are used below along the html
    const { classes } = this.props;
    const selectedEndpoint = this.state.endpoints[
      this.state.selectedEndpointIndex
    ];
    this.selectedEndpoint = selectedEndpoint;

    const temporaryEndpoint = selectedEndpoint.property.range.replace(
      "Collection",
      ""
    );
    this.temporaryEndpoint = temporaryEndpoint;

    const selectedHydraClass = this.state.hydraClasses[temporaryEndpoint];

    const selectedOperation =
      selectedHydraClass.supportedOperation[this.state.selectedOperationIndex];
    this.selectedOperation = selectedOperation;

    const stringProps = JSON.stringify(
      this.state.properties[temporaryEndpoint],
      jsonStringifyReplacer
    );

    let rawCommand = "";
    if (this.getURL) {
      rawCommand =
        "agent." +
        this.selectedOperation.method.toLowerCase() +
        '("' +
        this.props.serverUrl +
        this.selectedEndpoint.property.label +
        "/" +
        this.state.resourcesIDs[this.temporaryEndpoint]["ResourceID"] +
        '")';
    } else {
      rawCommand =
        "agent." +
        this.selectedOperation.method.toLowerCase() +
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
                ref={this.child}
                selectEndpoint={(currProperty) => {
                  this.selectEndpoint(currProperty);
                }}
                endpoints={this.state.endpoints}
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
                selectedOperationIndex={this.state.selectedOperationIndex}
                selectOperation={(currProperty) => {
                  this.selectOperation(currProperty);
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
                value={this.state.resourcesIDs[temporaryEndpoint]["ResourceID"]}
                onChange={(e) => this.handleChangeResourceID(e)}
                onFocus={(e) => this.handleChangeResourceID(e)}
                className={classes.input}
                inputProps={{
                  "aria-label": "description",
                }}
              />
            </Grid>
            {this.selectedOperation.method !== "DELETE" && (
              <PropertiesEditor
                endpoint={this.temporaryEndpoint}
                properties={this.state.properties[temporaryEndpoint]}
                metaProps={this.state.classesPropertiesWithMetaData}
                onChange={(updatedField) => {
                  this.handleChange(updatedField);
                }}
              ></PropertiesEditor>
            )}
          </Grid>
          <Button
            aria-label="delete"
            size="medium"
            variant="outlined"
            className={classes.deleteIconButton}
            onClick={(e) => this.clearAllInputs(e)}
          >
            CLEAR
          </Button>
          <Button
            className={classes.sendRequest}
            onClick={() => this.sendCommand()}
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
            onChange={() => {}}
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
            {typeof this.state.outputText === "string" ? (
              <ReactJson defaultValue="Your Output will be displayed here" />
            ) : (
              <ReactJson src={this.state.outputText} name={null} />
            )}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(HydraConsole);
