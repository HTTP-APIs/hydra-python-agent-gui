import React from "react";
import NavBar from "../components/navbar/NavBar";
import Loader from "../components/loader/Loader";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Send from "@material-ui/icons/Send";
import HydraConsole from "../components/hydra-console/HydraConsole";
import HydraGraph from "../components/hydra-graph/HydraGraph";
import "./app.scss";
import GuiTheme from "./gui-theme";
import { ThemeProvider } from "@material-ui/styles";

import getHydraDoc from "../services/hydra-doc-service";
import getApiDocGraph from "../services/api-doc-graph-service";
import startAgent from "../services/start-agent-service";
import axios from "axios";
import grey from "@material-ui/core/colors/grey";
const styles = (theme) => ({
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
});

class AgentGUI extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      consoleWidth: 6,
      hidden: false,
      classes: null,
      apidocGraph: { edges: null, nodes: null },
      serverURL: "http://localhost:8080/serverapi/",
      selectedNodeIndex: null,
    };
    // Empty when hosted using flask
    this.agentEndpoint = "";
  }

  async componentDidMount() {
    const data = await getHydraDoc();
    //for this.supportedClass > if @id="vocab:EntryPoint" then supportedProperty.property.label
    this.setState({
      classes: data.supportedClass,
      serverURL: data.serverURL.replace(/\/$/, "") + "/",
    });
    const apidocGraph = await getApiDocGraph();
    //for this.supportedClass > if @id="vocab:EntryPoint" then supportedProperty.property.label
    this.setState({
      apidocGraph,
    });
  }
  selectNode = (selectedRequest) => {
    console.log(selectedRequest.operation);
    this.child.current.selectEndpoint(
      selectedRequest.Index,
      selectedRequest.operation
    );
  };
  toggleGraph() {
    if (this.state.hidden) {
      this.setState({
        consoleWidth: 6,
        hidden: false,
      });
    } else {
      this.setState({
        consoleWidth: 12,
        hidden: true,
      });
    }
  }

  handleChangeServerURL(e) {
    this.setState({
      serverURL: e.target.value,
    });
  }

  async submitServerURL(e) {
    await startAgent(this.state.serverURL);
    const hydradoc = await getHydraDoc();
    this.setState({
      classes: hydradoc.supportedClass,
    });
    window.location.reload();
  }

  render() {
    const { classes } = this.props;
    if (this.state.classes && this.state.apidocGraph.nodes) {
      return (
        <ThemeProvider theme={GuiTheme}>
          <NavBar
            text="Hydra Agent GUI"
            backgroundColor={GuiTheme.palette.primary.main}
            color="primary"
            onClick={() => this.toggleGraph()}
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
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      this.submitServerURL(e);
                    }
                  }}
                  value={this.state.serverURL}
                  onChange={(e) => this.handleChangeServerURL(e)}
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
                onClick={(e) => this.submitServerURL(e)}
                disableElevation
              >
                GO{" "}
              </Button>
            </Grid>
            <Grid container display="flex">
              <Grid
                item
                order={2}
                md={this.state.consoleWidth}
                xs={12}
                color="primary"
                className={classes.consoleGrid}
              >
                <HydraConsole
                  ref={this.child}
                  serverUrl={this.state.serverURL}
                  hydraClasses={this.state.classes}
                  color="primary"
                ></HydraConsole>
              </Grid>
              <Grid
                item
                hidden={this.state.hidden}
                md={12 - this.state.consoleWidth}
                xs={12}
                className={classes.graphGrid}
              >
                <HydraGraph
                  apidocGraph={this.state.apidocGraph}
                  serverUrl={this.state.serverURL}
                  hydraClasses={this.state.classes}
                  selectNode={this.selectNode}
                ></HydraGraph>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    } else {
      // This should return a loading screen
      return <Loader />;
    }
  }
}
export default withStyles(styles)(AgentGUI);
