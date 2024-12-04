import React, { useState } from 'react';
import MaintenanceDialog from './MaintenanceDialog';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Grid2,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

interface IssueCardProps {
    title: string;
    description: string;
    date: string;
    icon: any;
    isResolved: boolean;
    status: number;
}

const IssueCard: React.FC<IssueCardProps> = ({ title, description, date, icon, isResolved }) => {
    const IconStyle: React.CSSProperties = {
        width: '100px',
        height: '100px',
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleSetOutOfOrder = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmOutOfOrder = () => {
        // Backend logic for setting the issue as Out-Of-Order
        console.log('Issue set to Out-Of-Order');
        setOpenDialog(false);
    };

    return (
        <Card
            className="request-card"
            sx={{
                backgroundColor: 'white',
                margin: '10px 0px 10px 0px',
                padding: '0px',
                borderRadius: '14px',
                width: '90%',
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
            }}
        >
            <CardContent>
                <Grid2 container spacing={4}>
                    <Grid2 size="auto">
                        <img src={icon} style={IconStyle} alt={icon}></img>
                    </Grid2>
                    <Grid2 size="grow">
                        <Typography
                            variant="h6"
                            className="card-title"
                            sx={{
                                fontWeight: 'bolder',
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            className="card-description"
                            sx={{
                                margin: '10px 0',
                                color: '#757575',
                            }}
                        >
                            {description}
                        </Typography>
                        <Box
                            className="card-footer"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '10px',
                            }}
                        >
                            <Typography
                                variant="body2"
                                className="card-date"
                                sx={{
                                    flex: '1',
                                    color: '#757575',
                                }}
                            >
                                <EventIcon
                                    className="icon"
                                    sx={{
                                        verticalAlign: 'middle',
                                        color: '#757575',
                                    }}
                                />{' '}
                                {date}
                            </Typography>
                        </Box>
                    </Grid2>
                </Grid2>

                {isResolved === false ? (
                    <Grid2 container>
                        <Grid2 size="grow"></Grid2>
                        <Grid2>
                            <Button
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.7)',
                                    paddingLeft: '30px',
                                    paddingRight: '30px',
                                    fontWeight: 'bold',
                                }}
                                onClick={handleSetOutOfOrder}
                            >
                                Set Out-Of-Order
                            </Button>
                            <Button
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.7)',
                                    marginLeft: '15px',
                                    paddingLeft: '50px',
                                    paddingRight: '50px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Resolve
                            </Button>
                        </Grid2>
                    </Grid2>
                ) : (
                    <Grid2 container spacing={2}>
                        <Grid2 size="grow"></Grid2>
                        <Grid2>
                            <Button>Remove</Button>
                        </Grid2>
                    </Grid2>
                )}
            </CardContent>

            {/* MaintenanceDialog is used here */}
            <MaintenanceDialog
                open={openDialog}
                onClose={handleCloseDialog}
                title={title}
            />
        </Card>
    );
};

export default IssueCard;