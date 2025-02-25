import { Paper, PaperProps } from "@mui/material";
import React from "react";
import Draggable from "react-draggable";

export function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle=".draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}