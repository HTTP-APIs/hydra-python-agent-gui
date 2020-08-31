import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  endpointButton: {
    minWidth: "auto",
    padding: "1em",
    borderRight: "1px solid #E4E4E4",
    marginBottom: "0px",
    backgroundColor: "#F9F9F9",

    ["@media (min-width:780px)"]: {
      width: "95%",
      textAlight: "start",
      justifyContent: "start",
      borderBottom: "1px solid #E4E4E4",
      display: "flex",
      justifyContent: "space-between",
    },
  },
  endpointSelectedButton: {
    backgroundColor: "grey",
  },
  active: {
    backgroundColor: "white",
    borderRight: "none",
  },
  rightArrow: {
    display: "none",
    ["@media (min-width:780px)"]: {
      display: "flex",
    },
  },
});

class EndpointsButtons extends React.Component {
  constructor(props) {
    super(props);
    const buttons = [];

    Object.keys(this.props.endpoints).forEach((endpoint) => {
      buttons[endpoint] = false;
    });

    const selectedButton = 0;
    buttons[selectedButton] = true;
    this.state = {
      buttons: buttons,
      selectedButton: selectedButton,
    };
  }

  selectButton(clickedButton) {
    const updatedButtons = this.state.buttons.slice();
    updatedButtons[this.state.selectedButton] = false;
    updatedButtons[clickedButton] = true;
    this.setState({
      buttons: updatedButtons,
      selectedButton: clickedButton,
    });
  }

  generateButtons() {
    const endpointsArray = Object.keys(this.props.endpoints);
    const { classes } = this.props;

    const buttons = endpointsArray.map((currProperty, index) => {
      const labelEndpoint = this.props.endpoints[currProperty].property.label;
      //color={this.state.buttons[currProperty] ? "secondary" : "default"}
      const selectedClass = this.state.buttons[currProperty]
        ? classes.active
        : classes.endpointButton;
      return (
        <Button
          key={currProperty}
          className={`${classes.endpointButton} ${
            this.state.buttons[currProperty] ? classes.active : ""
          }`}
          onClick={(e) => {
            this.selectButton(currProperty);
            this.props.selectEndpoint(currProperty);
          }}
        >
          {labelEndpoint}
          <span className={classes.rightArrow}>&gt;</span>
        </Button>
      );
    });
    return buttons;
  }

  render() {
    return this.generateButtons();
  }
}

export default withStyles(styles)(EndpointsButtons);
