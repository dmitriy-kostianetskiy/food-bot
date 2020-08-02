import React from 'react'
import { Button, DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core'

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog(props: DeleteConfirmationDialogProps) {
  const { onConfirm, onCancel, open } = props

  const handleCancel = () => {
    onCancel()
  }

  const handleOk = () => {
    onConfirm()
  }

  return (
    <Dialog
      maxWidth="xs"
      open={open}>
      <DialogTitle>Delete confirmation</DialogTitle>
      <DialogContent>Are you sure want to delete this recipe?</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">Cancel</Button>
        <Button onClick={handleOk} color="secondary">Delete</Button>
      </DialogActions>
    </Dialog>
  )
}
