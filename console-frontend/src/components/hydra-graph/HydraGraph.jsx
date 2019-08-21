import React from 'react'
import { withStyles } from '@material-ui/styles';
// eslint-disable-next-line
import { DataSet, Network } from 'visjs-network';

const styles = theme => ({
    graphContainer: {
        width: '100%',
        height: '82vh',
        //backgroundColor: '#f00'
        //backgroundColor: GuiTheme.palette.primary.dark,
    },
});

class HydraGraph extends React.Component {

    componentDidMount(){
        debugger
        var { DataSet, Network } = require('visjs-network');

        // create an array with edges and nodes
        var nodes = new DataSet(this.props.apidocGraph.nodes)
        var edges = new DataSet(this.props.apidocGraph.edges)

        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
        nodes: nodes,
        edges: edges
        };
        var options = {};
        // eslint-disable-next-line
        var network = new Network(container, data, options);
    }

   render() {
    const { classes } = this.props;
       return (
            <header className="app-header">
                <div className={classes.graphContainer} id="mynetwork"></div>
            </header>
       )
    }
}

export default withStyles(styles)(HydraGraph);