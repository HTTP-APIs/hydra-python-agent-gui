import React from 'react';
import NavBar from '../components/navbar/NavBar';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Send from '@material-ui/icons/Send';
import HydraConsole from '../components/hydra-console/HydraConsole'
import HydraGraph from '../components/hydra-graph/HydraGraph'
import './app.scss';
import GuiTheme from './gui-theme'
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';

const styles = theme => ({
  serverInputContainer: {
    width: '100%',
    backgroundColor: GuiTheme.palette.primary.light,
  },
  serverInput: {
      width: '93%'
  },
});

class AgentGUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consoleWidth: 6, //6 | 12 
      hidden: false, //false | true,
      classes: null,
      apidocGraph: {edges: null, nodes: null},
      serverURL: "http://localhost:8080/serverapi/"
    }

    this.agentEndpoint = "http://localhost:5000"
  }
  
  componentDidMount() {
    axios.get(this.agentEndpoint + "/hydra-doc")
      .then(res => {
        this.setState({
          //for this.supportedClass > if @id="vocab:EntryPoint" then supportedProperty.property.labe
          classes: res.data.supportedClass,
          serverURL: res.data.serverURL.replace(/\/$/, "") + "/"
        }, () => this.render())
      });

      axios.get(this.agentEndpoint + "/apidoc-graph")
      .then(res => {
        this.setState({
          //for this.supportedClass > if @id="vocab:EntryPoint" then supportedProperty.property.labe
          apidocGraph: res.data
        }, () => this.render())
      });
  }

  toggleGraph(){
    if(this.state.hidden){
      this.setState({
        consoleWidth: 6,
        hidden: false
      })
    }else{
      this.setState({
        consoleWidth: 12,
        hidden: true
      })
    }
  }

  render() {
    if(this.state.classes){
      return (
        <ThemeProvider theme={GuiTheme}>
          <NavBar 
            text="Hydra Agent GUI"
            fontSize='1.5em'
            backgroundColor={GuiTheme.palette.primary.main}
            color='primary'
            onClick={() => this.toggleGraph()}>
          </NavBar>
          <Grid container>
            <Grid item hidden={this.state.hidden} md={12 - this.state.consoleWidth} xs={12} > 
              <NavBar text="Hydra API" fontSize='1.3em'
                backgroundColor={GuiTheme.palette.primary.light}
                fontColor="textSecondary"></NavBar>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className={classes.serverInputContainer}>
                  <InputLabel htmlFor="aaaaa">Server URL:</InputLabel>
                  <Input
                      id="aaaaa"
                      placeholder="Server URL - Default: https://localhost:8080/serverapi/"
                      onKeyPress={ (e) => {if(e.key === 'Enter'){ this.submitServerURL(e) } }}
                      value={this.state.serverURL}
                      onChange={ (e) => this.handleChangeServerURL(e) }
                      className={classes.serverInput}
                      inputProps={{
                          'aria-label': 'hydrus-url',
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) => this.submitServerURL(e) }
                          >
                            <Send/>
                          </IconButton>
                        </InputAdornment>
                      }
                  />
              </Grid>
              <HydraGraph
                apidocGraph={this.state.apidocGraph}>
              </HydraGraph>
            </Grid>
    
            <Grid item md={this.state.consoleWidth} xs={12} color='primary'>
              <NavBar text="Agent Console" fontSize='1.3em'
                backgroundColor={GuiTheme.palette.primary.dark}
              ></NavBar> 
              <HydraConsole
                serverUrl={this.state.serverURL}
                hydraClasses={this.state.classes}
                color='primary' ></HydraConsole>
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    }else{
      
      return (<div className="lds-circle"><div></div></div>)
    }
  }
}
export default withStyles(styles)(AgentGUI);