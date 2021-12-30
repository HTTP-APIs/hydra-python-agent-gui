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

function PropertiesEditor(props) {
  const generateField = (propertyName, placeholder = null, metaProps, endpoint) => {
    const { classes } = props;
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
          value={props.properties[propertyName]}
          onChange={props.onChange}
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

  const generateProperties = ()  =>{
    const fields = [];
    
    for (const property in props.properties) {
      fields.push(
        generateField(
          property,
          null,
          props.metaProps,
          props.endpoint
        )
      );
    }
    return fields;
  }
  return generateProperties();  
}

export default withStyles(styles)(PropertiesEditor);
