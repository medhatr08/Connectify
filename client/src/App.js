import React, { useState } from 'react';
import './App.css';
import Home from './screens/Home';
import Navbar from './components/Navbar';

import {BrowserRouter,Routes, Route} from "react-router-dom"
import Signup from './components/Signup';
import Signin from './components/Signin';
import Profile from './screens/Profile';
import  {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import CreatePost from './screens/CreatePost';
import { LoginContext } from './context/LoginContext';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';



function App() {
  const [userLogin,setUserLogin]=useState(false)
  const[modalOpen,setModalOpen]=useState(false)
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
        <Navbar login={userLogin}/>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route exact path='/profile' element={<Profile/>}/>
        <Route path='/createPost' element={<CreatePost/>}/>
        <Route path='/profile/:userid' element={<UserProfile/>}/>
        
      </Routes>
      <ToastContainer theme='dark'/>
      {modalOpen && <Modal setModalOpen={setModalOpen} ></Modal>}
        </LoginContext.Provider>
     
        
      </div>
    </BrowserRouter>

  );
}

export default App;
