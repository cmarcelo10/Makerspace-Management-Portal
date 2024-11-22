import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';

interface MobileRequestCardProps {
    status: 'approved' | 'pending' | 'rejected';
    title: string;
    description: string;
    date: string;
}

const MobileRequestCard: React.FC<MobileRequestCardProps> = ({
    status,
    title,
    description,
    date,
}) => {
    const [isSwiped, setIsSwiped] = useState(false);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => setIsSwiped(true),
        onSwipedRight: () => setIsSwiped(false),
        preventScrollOnSwipe: true,
    });

    return (
        <div
            className="card-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
            }}
        >
            <Box
                {...swipeHandlers}
                sx={{
                    position: 'relative',
                    display: 'flex',
                    width: '80%',
                    backgroundColor: '#E7E0EC',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                {isSwiped && (
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '30%',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        {status === 'pending' && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#E8B931',
                                    width: '50%',
                                    height: '100%',
                                }}
                            >
                                <IconButton>
                                    <EditIcon sx={{ color: '#FFF1C2' }} />
                                </IconButton>
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#B3261E',
                                width: status === 'pending' ? '50%' : '100%',
                                height: '100%',
                            }}
                        >
                            <IconButton>
                                <DeleteIcon sx={{ color: 'white' }} />
                            </IconButton>
                        </Box>
                    </Box>
                )}
                <Card
                    className="request-card"
                    sx={{
                        flex: 1,
                        transform: isSwiped
                            ? 'translateX(-30%)'
                            : 'translateX(0)',
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <CardContent
                        sx={{
                            backgroundColor: '#E7E0EC',
                        }}
                    >
                        <Typography
                            variant="h6"
                            className="request-card-title"
                            style={{
                                fontWeight: 'bold',
                                marginBottom: '8px',
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="request-card-description"
                            style={{
                                marginBottom: '8px',
                                color: '#616161',
                            }}
                        >
                            {description}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Typography
                                variant="body2"
                                className="request-card-date"
                                style={{
                                    color: 'gray',
                                }}
                            >
                                <EventIcon
                                    className="icon"
                                    style={{
                                        verticalAlign: 'middle',
                                    }}
                                />{' '}
                                {date}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default MobileRequestCard;
