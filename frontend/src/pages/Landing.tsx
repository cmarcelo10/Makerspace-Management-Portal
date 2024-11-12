import '../styles/landing/local.css';
import illustrationDesktop from '../assets/2.jpg';
import illustrationMobile from '../assets/1.png';
import NavBar from '../Components/NavBar.tsx';
import MainContainer from '../Components/MainContainer.tsx';
import LoginButton from '../Components/LoginButton.tsx';
import CreateAccountButton from '../Components/CreateAccountButton.tsx';
import GetStartedButton from '../Components/GetStartedButton.tsx';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <MainContainer>
      <NavBar></NavBar>
      <div className="content">
        <div className="logo-container2">✂️ {/* Logo Icon */}</div>
        <div className="illustration-container">
          <img src={illustrationDesktop} alt="Makerspace Illustration" className="illustration desktop" />
          <img src={illustrationMobile} alt="Makerspace Illustration" className="illustration mobile" />
        </div>
        <div className='text-container'>
          <div className="text-content">
            <h1 className="heading">DESIGN. DEVELOP. DISCOVER. INSIDE THE MAKERSPACE.</h1>
            <p className="subheading">Bring your ideas to life by reserving tools, equipment, and workspace today.</p>
            <GetStartedButton></GetStartedButton>
            <div className="auth-buttons2">
              <LoginButton button_type='button' onClick={goToLogin}></LoginButton>
              <br /><br />
              <CreateAccountButton button_type='button' onClick={goToSignUp}></CreateAccountButton>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Landing;
