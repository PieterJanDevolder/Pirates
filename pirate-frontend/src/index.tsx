import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {  mount, route } from 'navi'
import { Router } from 'react-navi'
import Home from './pages/Home';
import { KEY_TOKEN } from './Auth/Auth_Api';
import Login from './pages/Login';
import { withAuthentication } from './Auth/authenticatedRoute';

const routes = mount({
  "/": withAuthentication(route({
    title: 'Home',
    view: <Home />
})),
"/Login": route({
  title: 'Login',
  view: <Login />
})



})


ReactDOM.render(
  <Router routes={routes} context={{ token: localStorage.getItem(KEY_TOKEN) }} /> ,
  document.getElementById('root')
);

