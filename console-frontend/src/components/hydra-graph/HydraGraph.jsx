import React from 'react'
import { withStyles } from '@material-ui/styles';
// eslint-disable-next-line
import { DataSet, Network } from 'visjs-network';

const styles = theme => ({
    graphContainer: {
        width: '100%',
        height: '82vh',
        backgroundColor: '#EEEEEE',
    },
});

class HydraGraph extends React.Component {

    componentDidMount(){
        debugger
        var { DataSet, Network } = require('visjs-network');

        // Create Node and Edge Datasets
        var nodes = new DataSet(this.props.apidocGraph.nodes)
        var edges = new DataSet(this.props.apidocGraph.edges)

        // Get reference to the mynetwork div
        var container = document.getElementById('mynetwork');

        var data = {
            nodes: nodes,
            edges: edges
        };

        // See vis.js network options for more details on how to use this
        var options = {};
        // Create a network
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
