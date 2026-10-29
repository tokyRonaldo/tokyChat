import React from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'

//import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import  Register from './auth/register'
import  Login from './auth/login'
import  Home from './container/home'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import PrivateRoute from './auth/privateRoute';
<link href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;700&display=swap" rel="stylesheet"></link>

library.add(fas);

function App() {

  return (
    <Router>
      <Routes>
        
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />

        
      </Routes>
    </Router>
  )
}

export default App