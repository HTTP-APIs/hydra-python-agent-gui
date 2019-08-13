import React from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    endpointButton: {
        width: '80%'
    },
    endpointSelectedButton: { 
        backgroundColor: '#f00',  
    }
});

class EndpointsButtons extends React.Component {
    constructor(props) {
        super(props);
        var buttons = []

        Object.keys(this.props.endpoints).map( (endpoint) => {
            buttons[endpoint] = false
        })

        var selectedButton = 0;
        buttons[ selectedButton ] = true;
        this.state = {
            buttons: buttons,
            selectedButton: selectedButton,
        }
    }

    selectButton(clickedButton){
        
        var updatedButtons = this.state.buttons.slice();
        updatedButtons[this.state.selectedButton] = false;
        updatedButtons[clickedButton] = true;
        this.setState({
            buttons: updatedButtons,
            selectedButton: clickedButton
        })
         
    }

    generateButtons(){
        const endpointsArray = Object.keys(this.props.endpoints);
        const { classes } = this.props;

        var buttons = endpointsArray.map( (currProperty, index) => {
            const labelEndpoint = this.props.endpoints[currProperty].property.label 
            return(<Button
                key={currProperty}
                variant="contained"
                color={this.state.buttons[currProperty] ? "secondary" : null}
                className={classes.endpointButton}
                onClick={ (e) => {this.selectButton(currProperty); this.props.selectEndpoint(currProperty)}}>
                {labelEndpoint}
            </Button>)})
        return buttons;
    }

    render() {
        
        return this.generateButtons()
    }
}

export default withStyles(styles)(EndpointsButtons);
