import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {  mount, route } from 'navi'
import { Router, useNavigation } from 'react-navi'
import Home from './pages/Home';
import Admin from './pages/admin';
import { KEY_TOKEN } from './Auth/Auth_Api';
import Login from './pages/Login';
import { withAuthentication } from './Auth/authenticatedRoute';




// Wrap navigation
const LoginWithNavigation =  function(props:any) {
  const navigation = useNavigation();
  return <Login {...props} navigation={navigation} />;
}

const HomeWithNavigation =  function(props:any) {
  const navigation = useNavigation();
  return <Home {...props} navigation={navigation} />;
}

const AdminWithNavigation =  function(props:any) {
  const navigation = useNavigation();
  return <Admin {...props} navigation={navigation} />;
}



const routes = mount({
  "/": withAuthentication(route({
    title: 'Home',
    view: <HomeWithNavigation />
})),

"/Login": route({
  title: 'Login',
  view: <LoginWithNavigation />
}),

"/Admin": withAuthentication(route({
  title: 'Login',
  view: <AdminWithNavigation />
}))
})


ReactDOM.render(
  <Router routes={routes} context={{ token: localStorage.getItem(KEY_TOKEN)}} /> ,
  document.getElementById('root')
);

