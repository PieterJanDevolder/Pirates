import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {  mount, route } from 'navi'
import { Router, useNavigation } from 'react-navi'
import Home from './pages/Home';
import { KEY_TOKEN } from './Auth/Auth_Api';
import Login from './pages/Login';
import { withAuthentication } from './Auth/authenticatedRoute';




// Wrap navigation
const LoginWithNavigation =  function(props:any) {
  const navigation = useNavigation();
  return <Login {...props} navigation={navigation} />;
}




const routes = mount({
  "/": withAuthentication(route({
    title: 'Home',
    view: <Home />
})),
"/Login": route({
  title: 'Login',
  view: <LoginWithNavigation />
})



})


ReactDOM.render(
  <Router routes={routes} context={{ token: localStorage.getItem(KEY_TOKEN) }} /> ,
  document.getElementById('root')
);

