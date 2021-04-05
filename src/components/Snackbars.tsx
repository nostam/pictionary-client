import { useState, SyntheticEvent, createRef } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Severity } from "../utils/interfaces";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface IProps {
  severity: Severity;
  content: string | undefined;
  isOpen: boolean;
}

export default function Snackbars({ severity, content, isOpen }: IProps) {
  const ref = createRef<HTMLDivElement>();
  const classes = useStyles();
  const [open, setOpen] = useState(isOpen);

  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <div ref={ref} className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={severity} onClose={handleClose}>
          {content}
        </Alert>
      </Snackbar>
    </div>
  );
}
