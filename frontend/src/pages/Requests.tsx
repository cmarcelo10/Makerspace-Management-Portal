import '../styles/requests/local.css';
import * as React from 'react';
import NavBar from '../Components/NavBar.tsx';
import MainContainer from '../Components/MainContainer.tsx';
import { Fab, Tab, Tabs, Stack, Typography, Button, Card, CardContent } from '@mui/material';
import { createTheme, styled, ThemeProvider, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { UserProvider, useUser } from '../hooks/UserProvider.tsx';
import { RequestsProvider } from '../hooks/RequestsProvider.tsx';
// like, really need to simplify these...


const theme = createTheme();

const Requests = () => {

    {/* TO DO: 
        * Fetch requests from the server
        * Prerequisite: Need some sort of state to be implemented
        * Possible workaround: Hardcode in the requests for a random user
    << BIGGEST CHALLENGES  >>
        * Admin vs Normal User view
        * Getting a state
    */}
    const { user, setUserByIndex } = useUser();
    const [currentUserIndex, setCurrentUserIndex] = React.useState(0);
    const handleChangeUser = () => {
        const nextIndex = currentUserIndex + 1 % 3;
        setCurrentUserIndex(nextIndex);
        setUserByIndex(nextIndex);
    }

    const [value, setValue] = React.useState('Approved'); // this is the default state I assume
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const randomList: Array<String> = ["Apples", "Bananas", "Oranges", "Celery", "Carrots", "Avocados", "Pineapples", "Mangoes", "Potatoes", "Tomatoes", "Beans"];
    return (
        <MainContainer>
            <NavBar />
            <Button onClick={handleChangeUser}> Change User </Button>
            <ThemeProvider theme={theme}>
                <div className='page-content'>
                    <TabContext value={value}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example" centered>

                            <Tab label="Approved" value="Approved" />
                            <Tab label="Pending" value="Pending" />
                            <Tab label="Denied" value="Denied" />
                        </TabList>
                        <TabPanel value="Approved">
                            {/* TO DO: Make separate pages for each */}
                            <Box sx={{ width: '100%' }}>
                                <Typography variant='h2' sx={{ padding: '30px' }}>
                                    Approved Requests Tab <br />
                                    {user.email}
                                </Typography>
                                <Stack spacing={3}>
                                    {
                                        randomList.map(
                                            (item, index) =>
                                                <Typography key={index} variant='body2'> {item} </Typography>
                                        )
                                    }
                                </Stack>
                            </Box>
                        </TabPanel>
                        <TabPanel value="Pending">
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%'
                            }}>
                                <Typography variant='h2' sx={{ padding: '30px' }}>
                                    Pending Requests Tab
                                </Typography>
                                <Box sx={{
                                    alignSelf: 'center',
                                    alignContent: 'center',
                                }}>
                                    <Stack spacing={3}>
                                        {
                                            randomList.map((item, index) =>
                                                <Card key={index}
                                                    sx={{
                                                        backgroundColor: theme.palette.secondary.main,
                                                        width: '80vw',
                                                        height:
                                                        {
                                                            xs: '100px',
                                                            md: '120px',
                                                        },
                                                        borderRadius: '20px'
                                                    }}>
                                                    <CardContent>
                                                        <Typography key={index} variant='body2' sx={{
                                                            color: theme.palette.secondary.contrastText,
                                                            fontWeight: 'bold',
                                                            fontSize: '24pt',
                                                        }}> {item}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            )
                                        }
                                    </Stack>
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="Denied">
                            <Box sx={{ width: '100%' }}>
                                <Typography variant='h2' sx={{ padding: '30px' }}>
                                    Denied Requests Tab
                                </Typography>
                                <Stack spacing={3}>
                                    {
                                        randomList.map(
                                            (item, index) =>
                                                <Typography key={index} variant='body2'> {item} </Typography>
                                        )
                                    }
                                </Stack>
                            </Box>
                        </TabPanel>
                    </TabContext>
                    <Fab />
                </div>
            </ThemeProvider >
            {/* at some point, there should be a check for some sort of session token*/
                /* also I don't know how to do media queries, so designing mobile first */}
        </MainContainer >
    )
}

export default Requests;

