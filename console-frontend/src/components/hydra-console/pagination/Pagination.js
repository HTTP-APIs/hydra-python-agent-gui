import React from "react";
import { withStyles } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles({
  page: {
    padding: "0.5em",
    backgroundColor: "white",
    margin: "0.5em",
    "&:hover": {
      cursor: "pointer",
    },
    borderRadius: "5px",
  },
});

function Pagination({ last_page, paginate }) {
  const classes = useStyles();
  const paged = [];
  if (last_page > 1) {
    for (let i = 1; i <= last_page; i++) {
      paged.push(
        <span className={classes.page} onClick={(e) => paginate(e, i)}>
          {i}
        </span>
      );
    }
  }

  return paged;
}

export default Pagination;
