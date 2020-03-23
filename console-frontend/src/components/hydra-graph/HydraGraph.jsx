import React from 'react'
import { withStyles } from '@material-ui/styles';
// eslint-disable-next-line
import { DataSet, Network } from 'visjs-network';

const styles = theme => ({
    graphContainer: {
        width: '100%',
        height: '82vh',
    },
});

class HydraGraph extends React.Component {

    componentDidMount(){
        debugger
        let { DataSet, Network } = require('visjs-network');

        // Create Node and Edge Datasets 
        let nodes = new DataSet(this.props.apidocGraph.nodes)
        let edges = new DataSet(this.props.apidocGraph.edges)

        // Get reference to the mynetwork div
        let container = document.getElementById('mynetwork');

        let data = {
            nodes: nodes,
            edges: edges
        };

        // See vis.js network options for more details on how to use this
        let options = {};
        // Create a network
        // eslint-disable-next-line
        let network = new Network(container, data, options);
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