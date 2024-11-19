// This will probably need to take some props to change the displayed links depending on the page

import '../styles/navbar.css';
import LoginButton from './LoginButton';
import CreateAccountButton from './CreateAccountButton';
import { Link, useNavigate } from 'react-router-dom';
import NavLogo from "../assets/logo_grayscale.svg";
import { useState } from 'react';
import LoginPopover from './Loginpopover.tsx';
import CreateAccountPopover from './CreateAccountPopover.tsx';
import ProfileLink from './ProfileLink.tsx';

const NavBar = ({id}: { id: string }) => {


    const [anchorElLogin, setAnchorElLogin] = useState<HTMLElement | null>(null);
    const handleOpenLogin = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElLogin(event.currentTarget);
        setAnchorElCreate(null); 
    };
    const handleCloseLogin = () => setAnchorElLogin(null);
    const handleOpenProfile = (_event: React.MouseEvent<HTMLElement>) => {
      console.log("Opening profile page...");
    };
    const openLogin = Boolean(anchorElLogin);

    const [anchorElCreate, setAnchorElCreate] = useState<HTMLElement | null>(null);
 const handleOpenCreateAccount = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCreate(event.currentTarget);
    setAnchorElLogin(null); 
};
    const handleCloseCreateAccount = () => setAnchorElCreate(null);
    const openCreateAccount = Boolean(anchorElCreate);

    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToSignUp = () => {
        navigate('/signup');
    };

    // For testing
    var isLoggedIn = true
    var isAdmin = false;
    return (
      <header className="nav-bar-container">
        <nav className="navbar" id={id}>
            <div className='left'>
              <div className="logo-container">
                <div className="logo-wrapper">
                  <img className="logo" src={NavLogo} alt="React Logo" />
                </div>
                <p className='logo-text'>&nbsp;Makerspace</p>
              </div>
              <ul className="nav-links">
                  <li className='home'><Link to="/home">Home</Link></li>
                  <li><Link to="/reserve">{isAdmin ? 'Manage Equipment' : 'Reserve Equipment'}</Link></li>
                  <li><Link to="/manage">{isAdmin ? 'Manage Bookings' : 'My Reservations'}</Link></li>
              </ul>
            </div>
            <div className="auth-buttons">
              {isLoggedIn ? (
                <ProfileLink />
              ) : (
                <>
                  <LoginButton button_type="button" onClick={handleOpenLogin} />
                  <CreateAccountButton button_type="button" onClick={handleOpenCreateAccount} />
                </>
              )}
            </div>
            <LoginPopover 
                anchorEl={anchorElLogin}
                openLogin={openLogin}
                handleCloseLogin={handleCloseLogin}
            />
            <CreateAccountPopover 
                    anchorEl={anchorElCreate}
                    openCreateAccount={openCreateAccount}
                    handleCloseCreateAccount={handleCloseCreateAccount} handleOpenLogin={function (): void {
                        throw new Error('Function not implemented.');
                    } }                />
        </nav>
      </header>
    );
};

export default NavBar;