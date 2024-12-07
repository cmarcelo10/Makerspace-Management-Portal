import NavBar from '../Components/NavBar';
import React, { useState, useEffect, useContext } from 'react';
import '../styles/requests/local.css';
import TabContainer from '../Components/Requests/TabContainer';
import RequestCard from '../Components/Requests/RequestCard';
import MobileRequestCard from '../Components/Requests/MobileRequestCard';
import MobileIssueCard from '../Components/Requests/MobileIssueCard';
import IssueCard from '../Components/Requests/IssueCard';
import { Box, Button, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Booking, Issue } from '../models.ts';
import { useAuth } from '../contexts/AuthContext';
import Axios from 'axios';
import axios from '../axios';
import CancelReservationModal from '../Components//Requests/Modals/CancelReservationModal.tsx';
import RejectReservationModal from '../Components/Requests/Modals/RejectReservationModal.tsx';
import ApproveReservationModal from '../Components/Requests/Modals/ApproveReservationModal.tsx';
import ResolveModal from '../Components/Requests/Modals/ResolveModal.tsx';
import SetOODModal from '../Components/Requests/Modals/SetOODModal.tsx';
import { useSnackbar } from '../contexts/SnackbarProvider.tsx';
import EditBookingModal from '../Components/Requests/Modals/EditBookingModal.tsx';
import theme from '../theme.ts';

const Requests = () => {
    //media query
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    //user context
    const { user, isLoading } = useAuth();
    const [userState, setUserState] = useState(user?.userRole);
    const navigate = useNavigate();

    //status for tab container
    const [status, setStatus] = useState(0);

    const numberToStringMap: { [key: number]: string } = {
        0: 'approved',
        1: 'pending',
        2: 'denied',
    };

    //snackbar
    const { showSnackbar } = useSnackbar();

    // fetch
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userState === 'admin') {
                    const bookingsResponse = await axios.get(
                        '/bookings?status=pending'
                    );
                    setBookings(bookingsResponse.data.bookings);
                    console.log(bookingsResponse);
                    const issuesResponse = await axios.get('/issues');
                    setIssues(issuesResponse.data.issues);
                    console.log(issues);
                } else {
                    const bookingsResponse = await axios.get('/bookings');
                    setBookings(bookingsResponse.data.bookings);
                    console.log(bookingsResponse);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    // for debugging
    // const ChangeUserButton = () => (
    //     <Button
    //         id="debugButton"
    //         sx={{ width: '250px', position: 'sticky', bottom: 2, zIndex: 1000 }}
    //         variant="contained"
    //         onClick={() => {
    //             console.log(bookings[3]);
    //             handleOpenModal('edit', bookings[3]);
    //         }}
    //     >
    //         User Type: {userState}
    //     </Button>
    // );

    // modals
    const [modalState, setModalState] = useState<{
        name: string | null;
        data?: Booking | Issue | null;
    }>({
        name: null,
        data: null,
    });

    const handleOpenModal = <T extends Booking | Issue>(
        modalName: string,
        modalData?: T | null
    ) => {
        setModalState({ name: modalName, data: modalData });
    };

    const handleCloseModal = () => {
        setModalState({ name: null, data: null });
    };

    // button functions and api requests
    const handleDeleteBooking = async (id?: number) => {
        console.log(`Deleting booking with ID: ${id}`);
        try {
            await axios.delete(`/bookings?id=${id}`);
            setBookings((prev) => prev.filter((booking) => booking.id !== id));
        } catch (error) {
            console.log('Error deleting booking:', error);
        }
        showSnackbar('Successfully cancelled booking!');
        handleCloseModal();
    };

    const handleRejectBooking = async (textValue: string, idValue?: number) => {
        console.log(`Rejecting booking with ID: ${idValue}`);
        try {
            await axios.patch(`/bookings`, {
                id: idValue,
                status: 'denied',
                adminComments: textValue,
            });
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.id === idValue
                        ? {
                              ...booking,
                              status: 'denied',
                              adminComments: textValue,
                          }
                        : booking
                )
            );
        } catch (error) {
            console.log('Error deleting booking:', error);
        }

        showSnackbar('Successfully rejected booking!');
        handleCloseModal();
    };

    const handleApproveBooking = async (idValue?: number) => {
        try {
            await axios.patch(`/bookings`, {
                id: idValue,
                status: 'approved',
            });
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.id === idValue
                        ? {
                              ...booking,
                              status: 'approved',
                          }
                        : booking
                )
            );
            console.log(`Approving booking with ID: ${idValue}`);
        } catch (error) {
            console.log('Error approving booking:', error);
        }

        showSnackbar('Successfully approved booking!');
        handleCloseModal();
    };

    const handleResolveIssue = async (idValue?: number) => {
        try {
            await axios.patch(`/issues`, {
                id: idValue,
                isResolved: true,
            });
            setIssues((prevIssues) =>
                prevIssues.map((issues) =>
                    issues.id === idValue
                        ? {
                              ...issues,
                              isResolved: true,
                          }
                        : issues
                )
            );
            console.log(`Resolving issue with ID: ${idValue}`);
        } catch (error) {
            console.log('Error resolve issue:', error);
        }

        showSnackbar('Successfully resolved issue!');
        handleCloseModal();
    };

    const handleSetOutOfOrder = async (idValue?: number) => {
        try {
            const response = await axios.patch(`/equipment`, {
                id: idValue,
                isUnderMaintenance: true,
            });
            console.log(response);
            console.log('updating');
            setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                    issue.equipment?.id === idValue
                        ? {
                              ...issue,
                              equipment: issue.equipment
                                  ? {
                                        ...issue.equipment,
                                        isUnderMaintenance: true,
                                    }
                                  : undefined,
                          }
                        : issue
                )
            );
            console.log(issues);

            console.log(`Setting equipment Out-of-Order with ID: ${idValue}`);
        } catch (error) {
            console.log('Error setting equipment to Out-of-Order:', error);
        }

        showSnackbar('Successfully set equipment Out-of-Order!');
        handleCloseModal();
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="requestContainer">
                <NavBar id="request" />
                <Box
                    sx={{
                        width: '90%',
                        marginInline: 'auto',
                        marginTop: '2rem',
                        [theme.breakpoints.down('md')]: {
                            width: '100%',
                        },
                    }}
                >
                    <Box>
                        <TabContainer
                            value={status}
                            onChange={setStatus}
                            user={userState}
                        >
                            {userState === 'admin'
                                ? status === 0
                                    ? // Admin view: Show pending requests
                                      bookings
                                          .filter(
                                              (bookings) =>
                                                  bookings.status === 'pending'
                                          )
                                          .map((bookings) =>
                                              isMobile ? (
                                                  <MobileRequestCard
                                                      key={bookings.id}
                                                      booking={bookings}
                                                      userRole={userState}
                                                      handleDelete={() =>
                                                          handleOpenModal(
                                                              'cancelReservation',
                                                              bookings
                                                          )
                                                      }
                                                      handleReject={() =>
                                                          handleOpenModal(
                                                              'rejectReservation',
                                                              bookings
                                                          )
                                                      }
                                                      handleAccept={
                                                          localStorage.getItem(
                                                              'dontShowModal'
                                                          ) === 'true'
                                                              ? () =>
                                                                    handleApproveBooking(
                                                                        bookings?.id
                                                                    )
                                                              : () =>
                                                                    handleOpenModal(
                                                                        'approveReservation',
                                                                        bookings
                                                                    )
                                                      }
                                                  />
                                              ) : (
                                                  <RequestCard
                                                      key={bookings.id}
                                                      booking={bookings}
                                                      handleDelete={() =>
                                                          handleOpenModal(
                                                              'cancelReservation',
                                                              bookings
                                                          )
                                                      }
                                                      handleReject={() =>
                                                          handleOpenModal(
                                                              'rejectReservation',
                                                              bookings
                                                          )
                                                      }
                                                      handleAccept={
                                                          localStorage.getItem(
                                                              'dontShowModal'
                                                          ) === 'true'
                                                              ? () =>
                                                                    handleApproveBooking(
                                                                        bookings?.id
                                                                    )
                                                              : () =>
                                                                    handleOpenModal(
                                                                        'approveReservation',
                                                                        bookings
                                                                    )
                                                      }
                                                      userRole={userState}
                                                  />
                                              )
                                          )
                                    : status === 1
                                      ? // Admin view: Show issues when status is 1
                                        issues
                                            .filter(
                                                (issues) =>
                                                    issues.isResolved ==
                                                        false &&
                                                    issues.equipment
                                                        ?.isUnderMaintenance ==
                                                        false
                                            )
                                            .map((issues) =>
                                                isMobile ? (
                                                    <MobileIssueCard
                                                        key={issues.id}
                                                        issue={issues}
                                                        handleResolve={() => {
                                                            handleOpenModal(
                                                                'resolveIssue',
                                                                issues
                                                            );
                                                        }}
                                                        handleOOD={() =>
                                                            handleOpenModal(
                                                                'setOOD',
                                                                issues
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <IssueCard
                                                        key={issues.id}
                                                        issue={issues}
                                                        handleResolve={() => {
                                                            handleOpenModal(
                                                                'resolveIssue',
                                                                issues
                                                            );
                                                        }}
                                                        handleOOD={() =>
                                                            handleOpenModal(
                                                                'setOOD',
                                                                issues
                                                            )
                                                        }
                                                    />
                                                )
                                            )
                                      : // Admin view: Default case
                                        issues
                                            .filter(
                                                (issues) =>
                                                    issues.isResolved ==
                                                        false &&
                                                    issues.equipment
                                                        ?.isUnderMaintenance ==
                                                        true
                                            )
                                            .map((issues) =>
                                                isMobile ? (
                                                    <MobileIssueCard
                                                        key={issues.id}
                                                        issue={issues}
                                                        handleResolve={() => {
                                                            handleOpenModal(
                                                                'resolveIssue',
                                                                issues
                                                            );
                                                        }}
                                                        handleOOD={() =>
                                                            handleOpenModal(
                                                                'setOOD',
                                                                issues
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <IssueCard
                                                        key={issues.id}
                                                        issue={issues}
                                                        handleResolve={() => {
                                                            handleOpenModal(
                                                                'resolveIssue',
                                                                issues
                                                            );
                                                        }}
                                                        handleOOD={() =>
                                                            handleOpenModal(
                                                                'setOOD',
                                                                issues
                                                            )
                                                        }
                                                    />
                                                )
                                            )
                                : // General user view: Filter requests based on status
                                  bookings
                                      .filter(
                                          (bookings) =>
                                              bookings.status ===
                                              numberToStringMap[status]
                                      )
                                      .map((bookings) =>
                                          isMobile ? (
                                              <MobileRequestCard
                                                  key={bookings.id}
                                                  booking={bookings}
                                                  userRole={userState}
                                                  handleDelete={() =>
                                                      handleOpenModal(
                                                          'cancelReservation',
                                                          bookings
                                                      )
                                                  }
                                              />
                                          ) : (
                                              <RequestCard
                                                  key={bookings.id}
                                                  booking={bookings}
                                                  handleDelete={() =>
                                                      handleOpenModal(
                                                          'cancelReservation',
                                                          bookings
                                                      )
                                                  }
                                                  userRole={userState}
                                              />
                                          )
                                      )}
                        </TabContainer>

                        {/* <ChangeUserButton /> */}
                    </Box>
                </Box>

                <CancelReservationModal
                    open={modalState.name === 'cancelReservation'}
                    onClose={handleCloseModal}
                    data={modalState.data as Booking}
                    onConfirm={() => {
                        handleDeleteBooking(modalState.data?.id);
                    }}
                />

                <RejectReservationModal
                    open={modalState.name === 'rejectReservation'}
                    onClose={handleCloseModal}
                    data={modalState.data as Booking}
                    onReject={handleRejectBooking}
                />

                <ApproveReservationModal
                    open={modalState.name === 'approveReservation'}
                    onClose={handleCloseModal}
                    data={modalState.data as Booking}
                    onConfirm={() => {
                        handleApproveBooking(modalState.data?.id);
                    }}
                    storageKey="dontShowModal"
                />
                <ResolveModal
                    open={modalState.name === 'resolveIssue'}
                    onClose={handleCloseModal}
                    data={modalState.data as Issue}
                    onConfirm={() => {
                        handleResolveIssue(modalState.data?.id);
                    }}
                />
                <SetOODModal
                    open={modalState.name === 'setOOD'}
                    onClose={handleCloseModal}
                    data={modalState.data as Issue}
                    onConfirm={() => {
                        handleSetOutOfOrder(modalState.data?.equipment?.id);
                    }}
                />
                <EditBookingModal
                    open={modalState.name === 'edit'}
                    onClose={handleCloseModal}
                    onConfirm={() => {
                        console.log('Hi!');
                    }}
                    booking={modalState.data as Booking}
                />
            </div>
        </ThemeProvider>
    );
};

export default Requests;
