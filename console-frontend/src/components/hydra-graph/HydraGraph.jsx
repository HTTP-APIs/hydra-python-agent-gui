import React from 'react'
import { withStyles } from '@material-ui/styles';
// eslint-disable-next-line
import { DataSet, Network } from 'visjs-network';
import { node, func } from 'prop-types';

const styles = theme => ({
    graphContainer: {
        width: '100%',
        height: '82vh',
    },
});

class HydraGraph extends React.Component {
    
    constructor(props) {
        super(props);

    }
    componentDidMount(){
        debugger
        let { DataSet, Network } = require('visjs-network');
        let self = this;
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
        let options = {
            interaction: { hover: true },
            nodes:{
            color: {
                hover: {
                    border: '#5BDE79',
                    background: '#5BDE79'
                  }
            }}
        };
        // Create a network
        // eslint-disable-next-line
        let endpoint;

        let endpoints=null;
        
        for(let index in this.props.hydraClasses){
          if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }

        let network = new Network(container, data, options);
        this.selectedNode=function(e){
            this.props.selectNode(e)
        }
        network.on("select", function(event){
            let { nodes, edges } =event;
            let element_array= Object.keys(data.nodes._data).map(function (key) { 
            return data.nodes._data[key]; 
       }); 
          
         element_array.forEach(element=>{
                
                if (element.id==nodes[0])
                {
                  endpoint = element;
                }
            });
       let i=0;
       endpoints.forEach(endpoints=>{
              if(endpoints.property.label==endpoint.label)
                {
                  self.selectedNode(i)    
                 }
              i+=1;    
           })
         
        });
   
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