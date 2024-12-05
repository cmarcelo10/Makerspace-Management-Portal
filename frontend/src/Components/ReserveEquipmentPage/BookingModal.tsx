import React, { useState, useEffect, useContext, useRef} from "react";
import { Fab, Tab, Tabs, Stack, Typography, Button, Card, CardContent, CardActionArea, CardActions, Accordion, ButtonGroup, CircularProgress, Grid2, IconButton, TextField, FormGroup, Tooltip, Modal } from '@mui/material';
import { createTheme, styled, ThemeProvider, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box';
import axios, { isAxiosError } from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from "dayjs";
import { CancelRounded } from "@mui/icons-material";
import WindowDimensions from "../WindowDimensions";
import ReportIssueDialog from "./ReportIssueDialog";
import ConfirmationDialog from "./ConfirmationDialog";

import { AuthContext, UserRoles } from "../../contexts/AuthContext";
import { daDK } from "@mui/x-date-pickers/locales";
import { get } from "http";
import axiosInstance from "../../axios";
import ModalBase from "./ModalBase";
import customParseFormat from "dayjs/plugin/customParseFormat"
import TimeButton from "./TimeButton";

dayjs.extend(customParseFormat);

const BASIC_MIN_TIME = '11:00:00';
const BASIC_MAX_TIME = '14:00:00';

type BookingData = 
{
    [key: string]: string[]
}

const theme = createTheme();

interface BookingModalProps 
{
    open: boolean,
    onClose: ()=> void,
    onSubmit: ()=>void,
    equipmentID: number,
    externalProps?: any,
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



type TimeSlots = 
{
    [key: string]:
    {
        displayTime: string,
        isAvailable: boolean,
    }
}
function createSlots()
{
    let slots:TimeSlots = {};
    for(let i = 8; i <= 19; ++i)
    {
        if(i > 12) 
            slots[`${i}:00:00`] = {displayTime: `${i % 12}:00 PM`, isAvailable: false} 
        else if(i == 12) 
            slots[`${i}:00:00`] = {displayTime: `${i}:00 PM`, isAvailable: false} 
        else if(i == 10 || i == 11) 
            slots[`${i}:00:00`] = {displayTime: `${i}:00 AM`, isAvailable: false};
        else 
            slots[`0${i}:00:00`] = {displayTime: `${i}:00 AM`, isAvailable: false}
    }
    return slots;
}

interface BookingRequest
{
    equipmentID: number,
    title: string,
    description: string,
    bookingDate: string,
    timeSlot1: string,
    timeSlot2?: string,
}

// Need to link clicking off the modal to the close event. For now, linked to the close button only.
const BookingModal = ({open,  equipmentID, onClose, onSubmit}:BookingModalProps) => {

    const [inputText, setDetailsText] = useState("");
    const [titleText, setTitleText] = useState("");
    const baseOpenings= React.useRef<BookingData>({}); // this never changes.
    const [openings, setOpenings] = useState<BookingData>({});
    const {user} = useContext(AuthContext)!;
    const {height, width} = WindowDimensions();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>();
    // all event listeners would need to be exposed at some point via Props. 
    //@ts-ignore
    const defaultDate = dayjs();
    const [equipmentIDString, setEquipmentID] = useState(equipmentID);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState(dayjs()); // the default selected date. 
    const [slots, setSlots] = useState<TimeSlots>(createSlots());
    const [maxDate, setMaxDate] = useState(dayjs().add(7, 'day'));
    const [firstSelectedTime, setFirstSelectedTime] = useState("");
    const [secondSelectedTime, setSecondSelectedTime] = useState(""); // NOT IMPLEMENTED
    const [disabled, setDisabled] = useState(false);

    const handleDetailsUpdate = (event:React.ChangeEvent<HTMLInputElement>) =>
    {
        setDetailsText(event.target.value);
    }
    const handleTitleUpdate = (event:React.ChangeEvent<HTMLInputElement>) =>
    {
        setTitleText(event.target.value);
    }
    //@ts-ignore

    const handleDateSelection = (newDate: Dayjs) => {
        setSelectedTime("");
        setSelectedDate(newDate);
    }
    
    const handleTimeSelect = (listingTime: string) =>
    {
        console.log(listingTime);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
 
    const [dialogOpen, setDialogOpen] = useState(false);

    const today = dayjs();
    const nMonthsFromNow = today.add(2, "month");

    const handleTimeSelect = (buttonIndex: number, listingTime: string) => {
        setSelectedTimeButton(buttonIndex);
        setSelectedTime(listingTime);
        // I didn't have time to implement the second time slot.
    }
    const handleCloseModal = (submitted=false) =>
    {
        setTitleText("");
        setDetailsText("");
        setSelectedTime("");
        if(submitted)
        {
            onSubmit();
    };

    const handleTextUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };


    //issues
    const handleOpenReportDialog = () => {
        setReportDialogOpen(true);
    };

    const handleCloseReportDialog = () => {
        setReportDialogOpen(false);
    };

    const handleSubmitReport = (issueDescription: string) => {
        console.log("Reported Issue:", issueDescription);
        setReportDialogOpen(false);
    };



    const handleSubmitRequest = () => {
        console.log("Submission successful:", { inputText, selectedTime });
         //backend
        setInputText("");
        setSelectedTime("");
        setDialogOpen(true); 
    };

    const handleCloseModal = (submitted = false) => {
        if (submitted) {
        }
        else
        { 
            onClose();
        }
    }
    
    const shouldDisableDate = React.useCallback((date: Dayjs)=>
    {
        const dateString = date.format("YYYY-MM-DD");
        const pred = !(openings[dateString] && openings[dateString].length > 0);
        return pred;
    }, [openings]);

    
    async function submitBooking(_event: React.MouseEvent)
    {
        setDisabled(true); // disable the form
        setLoading(true);
        try
        {
            const newBooking = 
            {
                equipmentID: equipmentID,
                title: titleText,
                bookingDate: selectedDate.format("YYYY-MM-DD"),
                timeSlot1: selectedTime,
                description: inputText,
            }
            const response = await axiosInstance.post('/bookings', newBooking);
            console.log(response.data);
            if(response.data.status == 'success')
            {
                handleCloseModal();
                onSubmit();
            }
        }
        catch(error: any)
        {
            if(isAxiosError(error))
            {
                setError(error.message);
            }
            console.log(error.response.data);
        }
        setDisabled(false);
    }

    React.useEffect(()=>
    {
        if(user && user.userRole! === UserRoles.PREMIUM)
        {
            setMaxDate(dayjs().add(28,'day'));
        }
        else
        {
            setMaxDate(dayjs().add(14, 'day'));
        }
    }, [user]);

    const updateTimeSlots = ()=>
    {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const times: string[] = baseOpenings.current[formattedDate];
        // We're assuming the times array isn't undefined
        // Safeguards are in place to make sure that Array.includes is not being called on "undefined".
        const minTime = dayjs(BASIC_MIN_TIME, "HH:MM:SS");
        const maxTime = dayjs(BASIC_MAX_TIME, "HH:MM:SS"); // If time permitted, these should be on the backend.
        Object.keys(slots).forEach((key:string) => 
            {
                if(user!.userRole !== UserRoles.PREMIUM)
                {
                    const time = dayjs(key, "HH:MM:SS");
                    if(time.isBefore(maxTime) && time.isAfter(minTime))
                    {
                        slots[key].isAvailable = times ? times.includes(key) : false
                        console.log(`${key} is available? ${slots[key].isAvailable}`);
                    }
                    else
                    {
                        slots[key].isAvailable = false;
                    }
                }
                else
                {
                    // if the key exists in the times array, the slot is available for premium users and basic.
                    slots[key].isAvailable = times ? times.includes(key) : false;
                    console.log(`${key} is available? ${slots[key].isAvailable}`);
                }
            });
        setSlots(slots);
    }

    useEffect(() => {
        async function getBookingsForEquipment(equipmentID:number)
        {
            if(equipmentID === -1)
            {
                return; // don't bother fetching data.
            }
            setLoading(true);
            console.log("Syncing with backend...");
            try
            {
                const response = await axiosInstance.get(`/bookings/days/slots?equipmentID=${equipmentID}`);
                baseOpenings.current = response.data.availableBookingDaysSlots; // keep this in the background
                setOpenings(baseOpenings.current);
                Object.keys(openings)[0];
                updateTimeSlots();
                // NICE TO HAVE: disable days that aren't available.
                // baseOpenings maps to a lookup object
            }
            catch(error: any)
            {
                console.log("Failed to fetch bookings for Equipment");
                console.log(error.data)
            }
            finally
            {
                setLoading(false);
            }
        }
        getBookingsForEquipment(equipmentID);
    },[equipmentID]);
    
    // for the form element.

    
    
   
    // Get bookings for equipment by day
    // Add a new booking entry
    // format ? 
    // 
    
    /* axios.post("url", {
        equipmentID: equipmentID,
        timeSlot1: "string",
    });*/

        setInputText("");
        setSelectedTime("");
        onClose();
    };

   
    const handleCloseDialog = (confirmed: boolean) => {
        setDialogOpen(false); 
        if (confirmed) {
          console.log("Submission confirmed");
          handleCloseModal(true); 
        } else {
          console.log("Submission canceled");
        }
      };

    return (
        <ThemeProvider theme={customTheme}>
            <ModalBase open={open} onClose={handleCloseModal}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box key='ModalBaseBox' className={'ModalBaseBox'}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 
                        {
                            xs: height,
                        },
                        overflowY: 'scroll',
                        borderRadius: 5, 
                        padding: 2,
                        backgroundColor: "white",
                        boxShadow: 3,
                    }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent='center'>
                    <Box key='ModalContentBox' sx={{overflowX: 'hidden', overflowY: 'scroll'}} display="flex" flexDirection={"column"} alignContent={'center'}>
                    <Box key="HeaderBox" className="headerbox" display="flex" flexDirection="row" justifyContent={'space-between'} position={"sticky"} top={0} bgcolor={"white"}> 
                            <Typography variant='h4' pl={2} fontWeight={1000}>
                                Reserve a Time
                            </Typography>
                            <IconButton sx={{marginLeft: 'auto', color: theme.palette.error.main}} size="small" onClick={onClose}> { /* confirmation dialog would be nice */}
                                <CancelRounded fontSize="large">Cancel</CancelRounded>
                            </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            md: 'row',
                        },
                        margin: '10px',
                    }}>
                        <Box id="calendarBox" columnGap={5} sx={
                                {
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                    mr: {xs: 0, md: 5}
                                }}>
                            <DateCalendar value={selectedDate} shouldDisableDate={shouldDisableDate} disablePast={true} timezone="system" onChange={handleDateSelection} defaultValue={defaultDate} minDate={defaultDate} maxDate={maxDate} disabled={disabled}
                            sx={{
                                backgroundColor: '#ECE6F0', 
                                borderRadius: 4,
                                }}/>
                        </Box>
                        <Box display="flex" flexDirection="column"  alignContent={"center"}>
                                <Typography variant='h6' sx={{marginTop: 1}}>
                                Available Times:
                                </Typography>
                            <Box id="time-display" display={"flex"} flexDirection={"column"} alignItems={'center'}>
                                <Grid2 container rowSpacing={0.5} alignItems ="left" flexGrow={1} justifyContent={
                                    {
                                       xs: "space-evenly",
                                       sm: "left",
                                       md: "left",
                                       lg: "space-evenly"
                                    }}> 
                                    {
                                        Object.entries(slots).map(([time, slot]) =>
                                        (
                                            <TimeButton key={time} internalTime={time} disabled={disabled || !slot.isAvailable} selected={dayjs(time, "HH:MM:SS").isSame(dayjs(selectedTime, "HH:MM:SS"))}
                                                displayedTime={slot.displayTime} onClick={handleTimeSelect} />
                                        ))
                                    }
                                </Grid2>
                            </Box>
                            <Box component="form" sx={{paddingTop: 3}}>
                                <TextField key={"TitleForm"} label="Request Title" minRows={2}
                                sx={
                                    {
                                        fontSize: 14,
                                        '& .MuiInputBase-root':
                                        {
                                            fontSize: 14,
                                        }
                                    }} slotProps={{input:{inputProps:{maxLength: 50}}}}
                                    maxRows={1} variant="filled" onChange={handleTitleUpdate} multiline fullWidth required>
                                </TextField>
                            </Box>
                            <Box component="form" sx={{paddingTop: 3}}>
                                <TextField id="DescriptionField" label="Details" minRows={2} sx={
                                    {fontSize: 10,
                                        '& .MuiInputBase-root':
                                        {
                                            fontSize: 14,
                                        }
                                    }
                                    } maxRows={2}  variant="filled" onChange={handleDetailsUpdate} multiline fullWidth required>
                                </TextField>
                            </Box>                            
                            <Button variant="contained" sx={{marginTop: 3, backgroundColor: '#65558F', color:"#FFFFFF", width:'120px'}} onClick={submitBooking} disabled={(inputText === "" || selectedTime === "")}>
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    sx={{
                        height: { xs: height },
                        overflowY: "scroll",
                        borderRadius: 5,
                        padding: 2,
                        backgroundColor: "white",
                        boxShadow: 3,
                    }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <IconButton
                        sx={{ marginLeft: "auto", color: "red" }}
                        size="small"
                        onClick={onClose}
                    >
                        <CancelRounded fontSize="large" />
                    </IconButton>
                    <Box
                        sx={{ overflowX: "hidden", overflowY: "scroll" }}
                        display="flex"
                        flexDirection="column"
                        alignContent="center"
                    >
                        <Typography variant="h4">Reserve a Time</Typography>
                        <Box
                            sx={{
                                alignSelf: "center",
                                flexDirection: { xs: "column", md: "row" },
                                margin: "10px",
                            }}
                            display="flex"
                        >
                            <Box mr={{ xs: 0, md: 5 }}>
                                <DateCalendar
                                    disablePast
                                    sx={{
                                        minWidth: 300,
                                        backgroundColor: "#ECE6F0",
                                        borderRadius: 4,
                                    }}
                                    defaultValue={today}
                                    minDate={today}
                                    maxDate={nMonthsFromNow}
                                />
                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="h6" sx={{ marginTop: 1 }}>
                                    Available Times:
                                </Typography>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Grid2 container rowSpacing={0.25} justifyContent="left">
                                        {timesArray.map((listing, index) => (
                                            <Button
                                                key={index}
                                                variant={
                                                    selectedTimeButton !== index
                                                        ? "outlined"
                                                        : "contained"
                                                }
                                                sx={timeButtonStyle}
                                                onClick={() =>
                                                    handleTimeSelect(index, listing.time)
                                                }
                                                disabled={
                                                    userRole !== "Premium" && listing.premiumOnly
                                                }
                                            >
                                                {listing.time}
                                            </Button>
                                        ))}
                                    </Grid2>
                                </Box>
                                <TextField
                                    label="Request Details"
                                    placeholder="Description"
                                    sx={{ marginTop: 3 }}
                                    multiline
                                    fullWidth
                                    required
                                    variant="filled"
                                    onChange={handleTextUpdate}
                                />
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    sx={{ marginTop: 3, width: "100%" }}
                                >
                                    <Button
                                        sx={{
                                            backgroundColor: "white",
                                            color: "black",
                                            textTransform: "none",
                                            borderRadius: 2,
                                            boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.7)",
                                            paddingLeft: "30px",
                                            paddingRight: "30px",
                                        }}
                                        onClick={handleOpenReportDialog}
                                    >
                                        Report Issue
                                    </Button>
                                    <Button
                                        sx={{
                                            backgroundColor: "#65558F",
                                            color: "white",
                                            textTransform: "none",
                                            borderRadius: 2,
                                            boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.7)",
                                            marginLeft: "15px",
                                            paddingLeft: "30px",
                                            paddingRight: "30px",
                                            fontWeight: "bold",
                                        }}
                                        disabled={!inputText || !selectedTime}
                                        onClick={handleSubmitRequest}
                                    >
                                        Submit Request
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Use ConfirmationDialog */}
                    <ConfirmationDialog 
                        open={dialogOpen} 
                        onClose={handleCloseDialog}
                    />

                    {/* Report Issue Dialog */}
                    <ReportIssueDialog
                        open={reportDialogOpen}
                        onClose={handleCloseReportDialog}
                        onSubmit={handleSubmitReport}
                    />
                </Box>
            </LocalizationProvider>
         </ModalBase>
        </ThemeProvider>
    );
};

export default BookingModal;
