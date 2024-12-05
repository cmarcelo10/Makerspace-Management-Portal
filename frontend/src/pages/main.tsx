import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './Landing.tsx';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import Requests from './Requests.tsx';
import ReserveEquipment from './ReserveEquipment.tsx';
import Profile from './Profile.tsx';
import '../styles/index.css';
import { UserProvider } from '../hooks/UserProvider.tsx';
import { AuthContext, AuthProvider } from '../contexts/AuthContext.tsx';
import {
    EquipmentContext,
    EquipmentDataProvider,
} from '../contexts/EquipmentContext.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'signup',
        element: <Signup />,
    },
    {
        path: 'requests',
        element: <Requests />,
    },
    {
        path: 'reserve',
        element: <ReserveEquipment />,
    },
    {
        path: 'profile',
        element: <Profile />,
    },
    {
        path: 'home',
        element: <Landing />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </AuthProvider>
    </React.StrictMode>
);
