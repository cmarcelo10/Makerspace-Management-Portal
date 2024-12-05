import React from 'react';
import { Tabs, Tab, Box, ThemeProvider, Typography } from '@mui/material';
import theme from '../../theme';

interface TabContainerProps {
    user: string | undefined;
    value: number;
    onChange: (value: number) => void;
    children: React.ReactNode | null; // Explicitly allowing null
}

const TabContainer: React.FC<TabContainerProps> = ({
    user,
    value,
    onChange,
    children,
}) => {
    const isChildrenEmpty = !children || React.Children.count(children) === 0;

    return (
        <ThemeProvider theme={theme}>
            <Box
                className="tab-container"
                sx={{
                    maxWidth: '1500px',
                    minHeight: '600px',
                    marginTop: '10px',
                    marginInline: 'auto',
                    backgroundColor: '#7D768B',
                    padding: '0px 0px 20px 0px',
                    borderRadius: '16px',
                    [theme.breakpoints.down('md')]: {
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                }}
            >
                <Tabs
                    value={value}
                    onChange={(_event, newValue) => onChange(newValue)}
                    className="tab-bar"
                    sx={{
                        backgroundColor: '#E8DEF8',
                        borderRadius: '16px 16px 0 0',
                        color: '#483E5C',
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                        [theme.breakpoints.down('md')]: {
                            borderRadius: '0px',
                            backgroundColor: 'transparent',
                            width: '85%',
                            marginBottom: '20px',
                        },
                    }}
                    variant="fullWidth"
                >
                    <Tab
                        label={user === 'admin' ? 'Requests' : 'Approved'}
                        className="custom-tab"
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&.Mui-selected': {
                                backgroundColor: '#D0BCFE',
                                color: 'white',
                            },
                            [theme.breakpoints.down('md')]: {
                                borderRadius: '50px 0 0 50px',
                                border: '1px solid #8E8E93',
                                fontWeight: '100',
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    border: '0px',
                                },
                            },
                        }}
                    />
                    <Tab
                        label={user === 'admin' ? 'Issues' : 'Pending'}
                        className="custom-tab"
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&.Mui-selected': {
                                backgroundColor: '#D0BCFE',
                                color: 'white',
                            },
                            [theme.breakpoints.down('md')]: {
                                border: '1px solid #8E8E93',
                                fontWeight: '100',
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    border: '0px',
                                },
                            },
                        }}
                    />
                    <Tab
                        label={
                            user === 'admin'
                                ? 'Scheduled Maintenance'
                                : 'Rejected'
                        }
                        className="custom-tab"
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&.Mui-selected': {
                                backgroundColor: '#D0BCFE',
                                color: 'white',
                            },
                            [theme.breakpoints.down('md')]: {
                                borderRadius: '0px 50px 50px 0px',
                                border: '1px solid #8E8E93',
                                fontWeight: '100',
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    border: '0px',
                                },
                            },
                        }}
                    />
                </Tabs>
                <Box
                    className="tab-content"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '10px',
                        [theme.breakpoints.down('md')]: {
                            width: '90%',
                        },
                    }}
                >
                    {isChildrenEmpty ? (
                        <Typography sx={{ color: 'black', mt: 2 }}>
                            No content available.
                        </Typography>
                    ) : (
                        children
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default TabContainer;
