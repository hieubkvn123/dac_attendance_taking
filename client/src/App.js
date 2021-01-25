import logo from './logo.svg';
import './App.css';

/* Import components */
import { Component } from 'react'
import RegistrationForm from './registration/register'
import ThankyouPage from './registration/thankyoupage'
import QRCodeScanner, { QRCodeDiv } from './registration/qr'
import AdminDashboard from './registration/admin'

/* Import navigation */
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'

import { LastLocationProvider } from 'react-router-last-location'

function App() {
  return (
    <div className="App">
    	<Router>
    		<LastLocationProvider>
    			<Switch>
                    <Route path='/qrcode/:data' component={QRCodeDiv}></Route>
    				<Route path='/registration'><RegistrationForm/></Route>
    				<Route path='/thankyou'><ThankyouPage/></Route>
    				<Route path='/attendance'><QRCodeScanner/></Route>
                    <Route path='/admin'><AdminDashboard/></Route>
    				<Route exact path='/' render = {() =>{
    					return (<Redirect to="/registration"/>)
    				}}/>
    			</Switch>
    		</LastLocationProvider>
    	</Router>
    </div>
  );
}

export default App;
