import React from "react";
import { withStyles } from "@material-ui/styles";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import GuiTheme from "../../../app/gui-theme";

const styles = (theme) => ({
  propertyInput: {
    color: GuiTheme.palette.primary.dark,
    marginTop: "1em",
  },
  propertyContainer: {
    marginTop: "2px",
    marginBottom: "2px",
  },
  input: {
    display: "block",
    width: "100%",
  },
  required: {
    color: "rgba(0, 0, 0, 0.5)",
  },
});

class PropertiesEditor extends React.Component {
  generateField(propertyName, placeholder = null, metaProps, endpoint) {
    const { classes } = this.props;
    //this.filledProperties[fieldName];
    let prop = metaProps[endpoint].find(
      (prop) => prop.property === propertyName
    );
    return (
      <Grid
        className={classes.propertyContainer}
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <label className={classes.propertyInput}>{propertyName}:</label>
        <Input
          placeholder={placeholder}
          name={propertyName}
          value={this.props.properties[propertyName]}
          onChange={this.props.onChange}
          className={classes.input}
          inputProps={{
            "aria-label": "description",
          }}
        />
        <small className={classes.required}>
          {prop.required === true ? "(required)" : "(optional)"}
        </small>
      </Grid>
    );
  }

  generateProperties() {
    const fields = [];
    
    for (const property in this.props.properties) {
      fields.push(
        this.generateField(
          property,
          null,
          this.props.metaProps,
          this.props.endpoint
        )
      );
    }
    return fields;
  }

  render() {
    return this.generateProperties();
  }
}

export default withStyles(styles)(PropertiesEditor);
