import React,{useState} from "react";
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

function EndpointsButtons(props) {
  const buttons = [];
  props.endpoints.map().forEach((endpoint) => {
    buttons[endpoint] = false;
  });
  const [selectedButton, setSelectedButton] = useState(0);
  const [buttons, setButtons] = useState([]);

  const selectButton = (clickedButton) => {
    const updatedButtons = buttons.slice();
    updatedButtons[selectedButton] = false;
    updatedButtons[clickedButton] = true;
    setButtons(updatedButtons);
    setSelectedButton(clickedButton);
  }

  const generateButtons = () => {
    const endpointsArray = props.endpoints.map()
    const { classes } = props;

    const buttons = endpointsArray.map((currProperty, index) => {
      const labelEndpoint = props.endpoints[currProperty].property.label;
      //color={this.state.buttons[currProperty] ? "secondary" : "default"}
      const selectedClass = buttons[currProperty]
        ? classes.active
        : classes.endpointButton;
      return (
        <Button
          key={currProperty}
          className={`${classes.endpointButton} ${
            buttons[currProperty] ? classes.active : ""
          }`}
          onClick={(e) => {
            selectButton(currProperty);
            selectEndpoint(currProperty);
          }}
        >
          {labelEndpoint}
          <span className={classes.rightArrow}>&gt;</span>
        </Button>
      );
    });
    return buttons;
  }
  return generateButtons();  
}

export default withStyles(styles)(EndpointsButtons);
