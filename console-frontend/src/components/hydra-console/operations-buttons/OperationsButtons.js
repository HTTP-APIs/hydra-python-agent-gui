import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  operationButton: {
    borderRadius: "16px",
    backgroundColor: "#F5F5F5",
    margin: "0.6em",
  },
  operationButtonActive: {
    backgroundColor: "#F2C94C",
    color: "black",
  },
});

class OperationsButtons extends React.Component {
  constructor(props) {
    super(props);
    const buttons = [];

    let selectedButton = 0;

    const operationsArray = Object.keys(this.props.operations);
    operationsArray.forEach((operation, index) => {
      buttons[operation] = false;
      if (this.props.operations[operation].method === "GET")
        selectedButton = index;
    });

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
    const operationsArray = Object.keys(this.props.operations);

    const { classes } = this.props;

    const buttons = operationsArray.map((currProperty, index) => {
      const operation = this.props.operations[currProperty].method;
      return (
        <Button
          key={currProperty}
          color={this.state.buttons[currProperty] ? "secondary" : "default"}
          className={`${classes.operationButton} ${
            this.state.buttons[index] ? classes.operationButtonActive : ""
          }`}
          onClick={(e) => {
            this.selectButton(currProperty);
            this.props.selectOperation(currProperty);
          }}
        >
          {operation}
        </Button>
      );
    });
    return buttons;
  }

  componentDidUpdate() {
    if (this.state.selectedButton !== this.props.selectedOperationIndex) {
      const updatedButtons = this.state.buttons.slice();
      updatedButtons[this.state.selectedButton] = false;
      updatedButtons[this.props.selectedOperationIndex] = true;
      this.setState({
        buttons: updatedButtons,
        selectedButton: this.props.selectedOperationIndex,
      });
    }
  }

  render() {
    return this.generateButtons();
  }
}

export default withStyles(styles)(OperationsButtons);
