import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar/NavBar";
import Loader from "../components/loader/Loader";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import HydraConsole from "../components/hydra-console/HydraConsole";
import HydraGraph from "../components/hydra-graph/HydraGraph";
import "./app.scss";
import GuiTheme from "./gui-theme";
import { ThemeProvider } from "@material-ui/styles";
import getHydraDoc from "../services/hydra-doc-service";
import getApiDocGraph from "../services/api-doc-graph-service";
import startAgent from "../services/start-agent-service";
const styles = () => ( {
  serverInputContainer: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    margin: "0 auto",
    borderRadius: "4px 4px 0px 0px",
    ["@media (min-width:780px)"]: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
    },
  },
  inputContainer: {
    backgroundColor: "white",
    padding: "0 10px",
    ["@media (min-width:780px)"]: {
      width: "35%",
    },
  },
  serverInput: {
    width: "90%",
    padding: "5px",
    borderBottom: "1px solid black",
    paddingBottom: "0px",
    borderColor: "#000",
    borderRadius: "4px 4px 0px 0px",
    ["@media (min-width:780px)"]: {
      width: "100%",
    },
  },
  inputLabel: {
    ["@media (min-width:780px)"]: {
      display: "block",
      paddingTop: "5px",
    },
  },
  goBtn: {
    display: "block",
    margin: "1em 0em",
    width: "90%",
    backgroundColor: "#F2C94C",
    boxShadow: "0px",
    ["@media (min-width:780px)"]: {
      display: "inline-block",
      width: "5%",
      marginLeft: "1em",
      padding: "1em",
    },
  },
  consoleGrid: {
    borderRadius: "8px",
    ["@media (min-width:780px)"]: {
      order: 2,
    },
  },
  graphGrid: {
    ["@media (min-width:780px)"]: {
      order: 1,
    },
  },
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#F9F9F9",
    padding: "1em",
  },
} );

const AgentGUI = ( props ) => {
  let child = React.createRef();
  const [state, setState] = useState( {
    consoleWidth: 6,
    hidden: false,
    classes: null,
    apidocGraph: { edges: null, nodes: null },
    serverURL: "http://localhost:8080/serverapi/",
    selectedNodeIndex: null,
  } );
  // Empty when hosted using flask
  let agentEndpoint = "";

  useEffect( () => {
    const getData = async () => {

      const data = await getHydraDoc();
      //for supportedClass > if @id="vocab:EntryPoint" then supportedProperty.property.label
      setState( {
        classes: data.supportedClass,
        serverURL: data.serverURL.replace( /\/$/, "" ) + "/",
      } );
      const apidocGraph = await getApiDocGraph();
      //for supportedClass > if @id="vocab:EntryPoint" then supportedProperty.property.label
      setState( {
        apidocGraph,
      } );
    }
    getData()

  }, [] )

  const selectNode = ( selectedRequest ) => {
    child.current.selectEndpoint(
      selectedRequest.Index,
      selectedRequest.operation
    );
  };
  const toggleGraph = () => {
    if ( state.hidden ) {
      setState( {
        consoleWidth: 6,
        hidden: false,
      } );
    } else {
      setState( {
        consoleWidth: 12,
        hidden: true,
      } );
    }
  }

  function handleChangeServerURL( e ) {
    setState( {
      serverURL: e.target.value,
    } );
  }

  async function submitServerURL( e ) {
    await startAgent( state.serverURL );
    const hydradoc = await getHydraDoc();
    setState( {
      classes: hydradoc.supportedClass,
    } );
    window.location.reload();
  }

  const { classes } = props;
  if ( state.classes && state.apidocGraph.nodes ) {
    return (
      <ThemeProvider theme={GuiTheme}>
        <NavBar
          text="Hydra Agent GUI"
          backgroundColor={GuiTheme.palette.primary.main}
          color="primary"
          onClick={() => toggleGraph()}
        ></NavBar>
        <Grid container className={classes.appContainer}>
          <Grid item className={classes.serverInputContainer}>
            <div className={classes.inputContainer}>
              <InputLabel
                className={classes.inputLabel}
                htmlFor="server_url_input"
              >
                Server URL:
              </InputLabel>
              <Input
                id="server_url_input"
                placeholder="Server URL - Default: https://localhost:8080/serverapi/"
                onKeyPress={( e ) => {
                  if ( e.key === "Enter" ) {
                    submitServerURL( e );
                  }
                }}
                value={state.serverURL}
                onChange={( e ) => handleChangeServerURL( e )}
                className={classes.serverInput}
                disableUnderline={true}
                inputProps={{
                  "aria-label": "hydrus-url",
                }}
              />
            </div>
            <Button
              variant="contained"
              className={classes.goBtn}
              onClick={( e ) => submitServerURL( e )}
              disableElevation
            >
              GO{" "}
            </Button>
          </Grid>
          <Grid container display="flex">
            <Grid
              item
              order={2}
              md={state.consoleWidth}
              xs={12}
              color="primary"
              className={classes.consoleGrid}
            >
              <HydraConsole
                ref={child}
                serverUrl={state.serverURL}
                hydraClasses={state.classes}
                color="primary"
              ></HydraConsole>
            </Grid>
            {!state.hidden && (
              <Grid item md={6} xs={12} className={classes.graphGrid}>
                <HydraGraph
                  apidocGraph={state.apidocGraph}
                  serverUrl={state.serverURL}
                  hydraClasses={state.classes}
                  selectNode={selectNode}
                ></HydraGraph>
              </Grid>
            )}
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  } else {
    // This should return a loading screen
    return <Loader />;
  }

}
export default withStyles( styles )( AgentGUI );
