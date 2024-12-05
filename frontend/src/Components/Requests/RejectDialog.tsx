import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from '@mui/material';

interface RejectDialogProps {
    open: boolean;
    onClose: () => void;
    onReject: (comment: string) => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({ open, onClose, onReject }) => {
    const [comment, setComment] = useState('');

    const handleReject = () => {
        onReject(comment);
        setComment(''); // Reset the comment after rejection
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '701px', borderRadius: '8px', padding: '20px' } }}>
            <DialogTitle>Reject Request?</DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ marginBottom: '20px' }}>
                    This action cannot be undone.
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Please leave a comment to explain the rejection"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ marginBottom: '20px' , backgroundColor:'#E5E5EA'}}
                />
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
                    Close
                </Button>
                <Button onClick={handleReject}sx={{
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
                    Reject
                </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default RejectDialog;
