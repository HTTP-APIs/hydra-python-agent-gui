import React from 'react'
import { withStyles } from '@material-ui/styles';
import { DataSet, Network } from 'visjs-network';


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
        const self = this;
        // Create Node and Edge Datasets 
        const nodes = new DataSet(this.props.apidocGraph.nodes)
        const edges = new DataSet(this.props.apidocGraph.edges)
    
        // Get reference to the mynetwork div
        const container = document.getElementById('mynetwork');
        
        const data = {
            nodes: nodes,
            edges: edges
        };
        
        // See vis.js network options for more details on how to use this
        const options = {
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
        
        for(const index in this.props.hydraClasses){
          if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }

        const network = new Network(container, data, options);
        this.selectedNode=function(e){
            this.props.selectNode(e)
        }
        network.on("select", function(event){
            const { nodes} =event;
            const element_array= Object.keys(data.nodes._data).map(function (key) { 
                return data.nodes._data[key]; 
            }); 

            element_array.map((element)=>{
                if (element.id==nodes[0]) {
                  endpoint = element;
                }
            })
          
            endpoints.map((endpoints, i)=>{
                if(endpoints.property.label==endpoint.label) {
                  self.selectedNode(i)    
                 }
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