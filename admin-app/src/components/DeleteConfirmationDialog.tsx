import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog(props: DeleteConfirmationDialogProps) {
  const { onConfirm, onCancel, open } = props;

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = () => {
    onConfirm();
  };

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
  );
}
