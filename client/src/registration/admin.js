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
			events : [],
			current_participants : [],
			current_event_id : null,
			current_event_name : null,
			header_hidden : true,
			_interval : null
		}

		/* Binding event handlers */
		this.componentDidMount = this.componentDidMount.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this._get_participants_list = this._get_participants_list.bind(this)
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

		this.setState({current_event_id : event_id})
		this.setState({current_event_name : event_name})

		// console.log('Event : ', event_id, event_name)
		if(this.state._interval !== null){
			clearInterval(this.state._interval)
		}
		var interval = setInterval(() => this._get_participants_list(), 300)
		this.setState({_interval : interval})
	}

	_get_participants_list() {
		console.log('querying participants list')
		var event_id = this.state.current_event_id
		var event_name = this.state.current_event_name

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
			this.setState({header_hidden : false})
			this.setState({current_participants : response})
		}).catch(err => console.log(err))
	}

	render() {
		return (
			<div id="container">
				<ProSidebar>
					<Menu iconShape="square">
						<MenuItem>Dashboard</MenuItem>
						<SubMenu title="Events" open={true}>
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
					<table id='participants-table' border='1'>
						<tr hidden={this.state.header_hidden}>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>SIM ID</th>
							<th>Event ID</th>
							<th>Status</th>
						</tr>
						{this.state.current_participants.map((value, index) => {
							var status = 'Not attended'
							var class_ = 'not-attended'
							
							if(value[5] == 1)
								status = 'Attended'
								class_ = 'attended'
								
							return (
								<tr>
									<td>{value[0]}</td>
									<td>{value[1]}</td>
									<td>{value[2]}</td>
									<td>{value[3]}</td>
									<td>{value[4]}</td>
									<td><span value={status} className='status-div'>{status}</span></td>
								</tr>
							)
						})}
					</table>
				</div>
			</div>
		)
	}
}

export default AdminDashboard