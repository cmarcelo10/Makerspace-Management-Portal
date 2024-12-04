import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions,Box, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
interface CancelReservationDialogProps {
    open: boolean;
    onClose: () => void;
    onCancel: () => void;
}


const customTheme = createTheme({
    palette: {
        primary: {
            main: "#65558F", 
        },
        secondary: {
            main: "#ECE6F0", 
        },
        text: {
            primary: "#000000",
            secondary: "#5F5F5F", 
        },
        background: {
            default: "#FFFFFF", 
        },
    },
    typography: {
        fontFamily: "Arial, sans-serif", 
    },
});

const CancelReservationDialog: React.FC<CancelReservationDialogProps> = ({
    open,
    onClose,
    onCancel,
}) => {
    return (
        <ThemeProvider theme={customTheme}>
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '457px', borderRadius: '8px',  padding: '20px' } }}>
            <DialogTitle>Cancel Reservation?</DialogTitle>
            <DialogContent sx={{ fontFamily: "Arial, sans-serif", color:'#8E8E93'}}>
            This action cannot be undone.
            </DialogContent>
            <DialogActions>
            <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                <Button onClick={onClose} sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.7)',
                                    paddingLeft: '30px',
                                    paddingRight: '30px',
                                    fontWeight: 'bold',
                                }}>
                    Cancel
                </Button>
                <Button onClick={onCancel} sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.7)',
                                    marginLeft: '15px',
                                    paddingLeft: '30px',
                                    paddingRight: '30px',
                                    fontWeight: 'bold',
                                }} >
                    Continue
                </Button>

                </Box>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );
};

export default CancelReservationDialog;
