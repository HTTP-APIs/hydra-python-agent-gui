import React, { useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AspectRatioOutlinedIcon from "@material-ui/icons/AspectRatioOutlined";
import { makeStyles } from "@material-ui/core/styles";

import logo from "../../assets/images/hydra_eco_logo.png";
import github_logo from "../../assets/images/GitHub.png";
const useStyles = makeStyles( {
  hydraEcoLogo: {
    maxWidth: "30px",
    cursor: "pointer",
    marginRight: "6px",
  },
  AppBar: {},
  Typography: {
    fontSize: "18px",
    flexGrow: 1,
    paddingLeft: "1em",
  },
  centeringSpace: {
    flexGrow: 1.21,
  },
  fab: {
    boxShadow: "none",
  },
} );

const NavBar = ( props ) => {
  const classes = useStyles();
  // Optimized as it is a static function
  const handleOnClick = useCallback( () => {
    window.open(
      "https://github.com/HTTP-APIs/hydra-python-agent-gui"
    )
  } )
  return (
    <div>
      <AppBar position="static" className={classes.AppBar} color={props.color}>
        <Toolbar>
          {props.onClick && (
            <img
              src={logo}
              onClick={() => window.open( "http://www.hydraecosystem.org/" )}
              className={classes.hydraEcoLogo}
              alt="logo"
            />
          )}
          <Typography className={classes.Typography} color={props.fontColor}>
            {props.text}
          </Typography>

          {props.onClick && (
            <Fab
              color="primary"
              onClick={props.onClick}
              aria-label="add"
              className={classes.fab}
            >
              <AspectRatioOutlinedIcon />
            </Fab>
          )}
          <div className={classes.centeringSpace}></div>
          {props.onClick && (
            <img
              src={github_logo}
              onClick={handleOnClick}
              className={classes.hydraEcoLogo}
              alt="logo"
            />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
