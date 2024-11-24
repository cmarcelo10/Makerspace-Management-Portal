import React, { useState, useContext } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import '../styles/authentication/login/Login-mobile.css';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

interface LoginProps {
    onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
    const { login } = useContext(AuthContext)!; // Access login from context

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Email and Password are required.');
            return;
        }

        try {
            await login(email, password);
            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Dialog
            open={true}
            onClose={onClose}
            PaperProps={{ className: 'dialog-paper' }}
        >
            <DialogTitle className="dialog-title">Login</DialogTitle>
            <DialogContent className="dialog-content">
                {error && (
                    <p style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </p>
                )}
                <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    margin="normal"
                    className="text-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    className="text-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions className="button-container">
                <Button
                    onClick={handleLogin}
                    className="loginbutton"
                    sx={{ backgroundColor: '#65558f', color: 'white' }}
                >
                    Log In
                </Button>
                <Button
                    onClick={onClose}
                    className="cancelbutton"
                    sx={{ color: '#65558f' }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Login;
