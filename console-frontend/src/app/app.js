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
    border: 10,
    display: 'flex',
    paddingBottom: 20
  },
  serverInput: {
      width: '75%',
      backgroundColor: '#FBD20B',
      padding: '5px',
      borderColor: '#000',
      borderRadius: 10,
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
      apidocGraph: {edges: null, nodes: null},
      serverURL: "http://localhost:8080/serverapi/",
      selectedNodeIndex: null
    }

    // Empty when hosted using flask
    this.agentEndpoint = ""
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
  selectNode=(Index)=>{
  this.child.current.selectEndpoint(Index);
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

  handleChangeServerURL(e){
    debugger
    this.setState({
      serverURL: e.target.value,
    })
  }

  submitServerURL(e){
    debugger
    axios.post(this.agentEndpoint + "/start-agent" , {url: this.state.serverURL})
    .then( (successUpdate) => {
      axios.get(this.agentEndpoint + "/hydra-doc")
      .then(res => {
        this.setState({
          classes: res.data.supportedClass,
        }, () => window.location.reload() )
        .catch( (error) => {
          console.log(error)
        })
      });
    })
    .catch( (error) => {
      console.log(error)
    })
  }

  render() {
    const { classes } = this.props;

    if(this.state.classes && this.state.apidocGraph.nodes ){
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
                  display="flex"
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className={classes.serverInputContainer}>
                  <InputLabel htmlFor="server_url_input">Server URL:</InputLabel>
                  <Input
                      id="server_url_input"
                      placeholder="Server URL - Default: https://localhost:8080/serverapi/"
                      onKeyPress={ (e) => {if(e.key === 'Enter'){ this.submitServerURL(e) } }}
                      value={this.state.serverURL}
                      onChange={ (e) => this.handleChangeServerURL(e) }
                      className={classes.serverInput}
                      disableUnderline={true} 
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
                apidocGraph={this.state.apidocGraph}
                serverUrl={this.state.serverURL}
                hydraClasses={this.state.classes}
                selectNode={this.selectNode}> 
                
              </HydraGraph>
            </Grid>
    
            <Grid item md={this.state.consoleWidth} xs={12} color='primary'>
              <NavBar text="Agent Console" fontSize='1.3em'
                backgroundColor={GuiTheme.palette.primary.dark}
              ></NavBar> 
              <HydraConsole
                ref={this.child}
                serverUrl={this.state.serverURL}
                hydraClasses={this.state.classes}
                color='primary' ></HydraConsole>
            </Grid>
          </Grid>
        </ThemeProvider>
      );
    }else{
      // This should return a loading screen
      return (<div className="lds-circle"><div></div></div>)
    }
  }
}
export default withStyles(styles)(AgentGUI);