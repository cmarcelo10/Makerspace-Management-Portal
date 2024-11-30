import '../styles/profile/local.css';
import React, { useState, useContext, useEffect } from "react";
import NavBar from "../Components/NavBar";
import { Box, TextField, Typography, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import {
  AuthContext,
  AuthProvider,
  User,
  UserRoles,
} from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // the
import Axios from 'axios'; // the module

const textFieldSX = {
  backgroundColor: "#fff",
  "& .MuiFilledInput-root": {
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#4f378a" },
    "&:hover fieldset": { borderColor: "#4f378a" },
    "&.Mui-focused fieldset": { borderColor: "#4f378a" },
  },
  "& .Mui-disabled": {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.6)",
  },
};


const Profile = () => {
  const { user } = useContext(AuthContext)!;
  const [userDetails, setUserDetails] = useState({email: user?.email, firstName: user?.firstName, lastName: user?.lastName, confirmPassword: user?.confirmPassword, password: user?.password});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Navigate to home page if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/'); // Navigate to the home page
    }
  }, [user, navigate]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [field]: event.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const saveUserDetails = async (updatedDetails: Partial<User>) => {
    try {
      const response = await axios.put('/users/profile', updatedDetails);
      const updatedUser = response.data?.user;
      if (user) {
        user.firstName = updatedUser.firstName;
        user.lastName = updatedUser.lastName;
        user.confirmPassword = updatedUser.confirmPassword;
        user.password = updatedUser.password;
      }
  
      return { isSuccess: true, message: 'Profile updated successfully!' };
    } catch (error: unknown) {
      if (Axios.isAxiosError(error)) {
        console.error('Profile update failed:', error.response?.data || error.message);
  
        return {
          isSuccess: false,
          message: error.response?.data?.message || 'Failed to update profile.',
        };
      }
    }
  
    return {
      isSuccess: false,
      message: 'Something went wrong. Please try again later.',
    };
  };
  
  const handleSave = async () => {
    if (userDetails) {
      const result = await saveUserDetails(userDetails);
  
      if (result.isSuccess) {
        console.log("In handleSave: " + result.message);
        setIsEditing(false); // Exit editing mode
      } else {
        console.error("Error in handleSave: " + result.message);
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <NavBar id="profile" />
      <Box
        sx={{
          mt: { xs: "120px", md: "91px" },
          px: 3,
          py: 4,
          maxWidth: { xs: "90%", md: "600px" },
          margin: "0 auto",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#eaddff",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#4f378a", fontWeight: "bold" }}
        >
          Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email"
              fullWidth
              value={userDetails.email}
              onChange={handleChange("email")}
              disabled={true}
              variant={"filled"}
              sx={textFieldSX}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              fullWidth
              value={userDetails.firstName}
              onChange={handleChange("firstName")}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
              sx={textFieldSX}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              fullWidth
              value={userDetails.lastName}
              onChange={handleChange("lastName")}
              disabled={!isEditing}
              variant={isEditing ? "outlined" : "filled"}
              sx={textFieldSX}
            />
          </Grid>
          {isEditing && (
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Password"
                fullWidth
                type="password"
                placeholder="Enter new password"
                onChange={handleChange("password")}
                variant="outlined"
                sx={textFieldSX}
              />
            </Grid>)}
            {isEditing && (
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Confirm Password"
                fullWidth
                type="password"
                placeholder="Confirm new password"
                onChange={handleChange("confirmPassword")}
                variant="outlined"
                sx={textFieldSX}
              />
            </Grid>)}
        </Grid>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4f378a",
                  "&:hover": { backgroundColor: "#372862" },
                }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#4f378a",
                  borderColor: "#4f378a",
                  "&:hover": { borderColor: "#372862", color: "#372862" },
                }}
                onClick={handleEditToggle}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4f378a",
                "&:hover": { backgroundColor: "#372862" },
              }}
              onClick={handleEditToggle}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Profile;
