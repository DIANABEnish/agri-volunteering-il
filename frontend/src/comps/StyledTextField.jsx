import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputLabel-root': {
        right: '1.5rem',
        left: 'unset',
        direction: 'rtl',
        transformOrigin: 'right',
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
            color: theme.palette.primary.main,
        }
    },
    '& .MuiInputLabel-shrink': {
        transform: 'translate(0, -1.5rem) scale(0.75)',
        right: '0.75rem',
    },
    '& .MuiInputBase-root': {
        direction: 'rtl',
        '& input': {
            textAlign: 'right',
            direction: 'rtl',
            color: theme.palette.text.primary,
        },
        '& textarea': {
            textAlign: 'right',
            direction: 'rtl',
        }
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.divider,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        }
    }
}));

export default StyledTextField;