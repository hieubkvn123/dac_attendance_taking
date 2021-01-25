import React, { Component } from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import axios from 'axios'

/* Import css */
import 'react-pro-sidebar/dist/css/styles.css';
import './css/admin.css'

class AdminDashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			events : []
		}

		/* Binding event handlers */
		this.componentDidMount = this.componentDidMount.bind(this)
	}

	componentDidMount() { 
		// Get a list of events from server
		axios({
			url : 'http://localhost:8080/list-events',
			method : 'POST',
			headers : {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => response.data)
		.then(response => {
			this.setState({events : response})
		}).catch(err => console.log(err))
	}
	componentWillUnmount() { }

	handleClick(e) {
		var event_id = e.split('-')[0].trim()
		var event_name = e.split('-')[1].trim()

		// console.log('Event : ', event_id, event_name)
		var formData = new FormData()
		formData.append('event_id', event_id)
		formData.append('event_name', event_name)
		axios({
			url : 'http://localhost:8080/list-participants',
			data : formData,
			method : 'POST',
			headers : {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => response.data)
		.then(response => {

		}).catch(err => console.log(err))
	}

	render() {
		return (
			<div id="container">
				<ProSidebar>
					<Menu iconShape="square">
						<MenuItem>Dashboard</MenuItem>
						<SubMenu title="Components">
							{this.state.events.map((value, index) => {
								return (
									<MenuItem value={value} onClick={() => this.handleClick(value)}>{value}</MenuItem>
								)
							})}
						</SubMenu>
					</Menu>
				</ProSidebar>
				<div id='dashboard-content'>
					<h1>DAC events dashboard</h1>
					<hr/>
				</div>
			</div>
		)
	}
}

export default AdminDashboard