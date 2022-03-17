import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/User/userActions';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// components
import AppBar from '../components/MUI/AppBar';

// pages
import Home from '../pages/Home';
import JarForm from '../pages/JarForm';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import JarDetails from '../pages/JarDetails';
import MemoryForm from '../pages/MemoryForm';

// services
import * as authService from '../services/authService';

import './App.scss';

const App = (props) => {
  const { setCurrentUser } = props;
  const [user, setUser] = useState(authService.getUser()?.email);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logoutUser();
    setCurrentUser(null);
    setUser(null);
    navigate('/');
  };

  const handleSignUpOrSignIn = (email) => {
    // const result = authService.getUser();
    setCurrentUser({
      id: email
    });
    setUser(authService.getUser()?.email);
  };

  useEffect(() => {
      setCurrentUser({id: authService.getUser()?.email});
      // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <>
        {user && 
          <AppBar handleLogout={handleLogout}/>
        }
        <Routes>
          <Route path='/' element={user ? <Home /> : <Navigate to='/SignIn'/>} />
          <Route path='/SignIn' element={<SignIn handleSignUpOrSignIn={handleSignUpOrSignIn}/>}/>
          <Route path='/SignUp' element={<SignUp handleSignUpOrSignIn={handleSignUpOrSignIn}/>}/>
          <Route path='/jars/new' element={user ? <JarForm /> : <Navigate to='/SignIn'/>}/>
          <Route path='/jars/:id/edit' element={user ? <JarForm /> : <Navigate to='/SignIn'/>}/>
          <Route path='/jars/:id' element={user ? <JarDetails /> : <Navigate to='/SignIn' />}/>
          <Route path='/jars/:id/memories/new' element={user ? <MemoryForm /> : <Navigate to='/SignIn' />}/>
          <Route path='/jars/:id/memories/:memoryId' element={user ? <MemoryForm /> : <Navigate to='/SignIn' />}/>
        </Routes>
      </>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
