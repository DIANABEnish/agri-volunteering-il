import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/components/ui/dialog';
import { styled } from '@mui/material/styles';

const RTLDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    direction: 'rtl'
  },
  '& .MuiDialogTitle-root': {
    textAlign: 'right',
    fontFamily: 'inherit'
  },
  '& .MuiDialogContent-root': {
    textAlign: 'right'
  },
  '& .MuiInputLabel-root': {
    right: 14,
    left: 'auto',
    '&.MuiInputLabel-shrink': {
      transformOrigin: 'top right'
    }
  },
  '& .MuiOutlinedInput-root': {
    '& input': {
      textAlign: 'right'
    }
  },
  '& .MuiFormControl-root': {
    direction: 'rtl'
  },
  '& .MuiInputBase-root': {
    direction: 'rtl'
  }
});

export default RTLDialog;