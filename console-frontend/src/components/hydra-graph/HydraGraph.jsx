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
        var { DataSet, Network } = require('visjs-network');
        var self = this;
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
        var options = {
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
        var endpoint;

        var endpoints=null;
        
        for(var index in this.props.hydraClasses){
          if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }

        var network = new Network(container, data, options);
        this.selectedNode=function(e){
            this.props.selectNode(e)
        }
        network.on("select", function(event){
            var { nodes, edges } =event;
         var element_array= Object.keys(data.nodes._data).map(function (key) { 
            return data.nodes._data[key]; 
       }); 
          
         element_array.forEach(element=>{
                
                if (element.id==nodes[0])
                {
                  endpoint = element;
                }
            });
       var i=0;
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