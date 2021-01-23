import React, { Component } from 'react'
import axios from 'axios'

/* Import css */
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css'

class RegistrationForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			'current_events' : [],
			'selected_event' : ""
		}

		// bind event handlers
		this.componentDidMount = this.componentDidMount.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount() { 
		// query the database for list of events
		axios({
			url : 'http://localhost:8080/list-events',
			method : 'POST',
			headers : {
				'Content-Type' : 'multipart/form-data'
			}
		}).then(response => response.data)
		.then(response =>  this.setState({current_events : response, selected_event : response[0]}))
		.catch(error => console.log(error))
	}

	onChange(event) {
		this.setState({ [event.target.id] : event.target.value })
	}

	onSubmit(event) {
		// Check if all fields are filled in
		const required_fields = ['selected_event', 'first-name',
								 'last-name', 'email', 'sim-id']

		var enoughData = true
		required_fields.forEach((value, index) => {
			if(enoughData && (this.state[value] == null || this.state[value] == "")){
				enoughData = false
				alert('Please fill in all the details')
			}
		})

		if(enoughData) {
			var formData = new FormData()
			required_fields.forEach((value, index) => {
				formData.append(value, this.state[value])
			})

			axios({
				url : 'http://localhost:8080/add-participant',
				method : 'post',
				data : formData,
				headers : {
					'Content-Type' : 'multipart/form-data'
				}
			}).then(response => response.data)
			.then(response => {
				if(response !== 'failed') {
					// redirect to thank you page
					window.location.replace(`/qrcode/${response}`)
				}else{
					alert('There is something wrong with the server, please try again later')
				}
			})
			.catch(err => console.log(err))
		}
	}

	componentWillUnmount() { }

	render() {
		return (
			<div id='container'>
				<canvas id="canvas"></canvas>
				<script type="text/javascript" src="http://localhost:3000/assets/js/background.js"></script>

				<form id='registration-form'>
					<h3>Sign Up</h3>

					<div className="form-group">
						<label>Select Event</label>
						<select className='form-control' id='selected_event' onChange={this.onChange}>
							{this.state.current_events.map((value, index) => {
								if(index == 0){
									return (<option value={value} default selected="">{value}</option>)
								}else{
									return (<option value={value}>{value}</option>)
								}
							})}
						</select>
					</div>

					<div className="form-group">
						<label>First name</label>
						<input id='first-name' onChange={this.onChange} type="text" className="form-control" placeholder="First name" />
					</div>

					<div className="form-group">
						<label>Last name</label>
						<input id='last-name' onChange={this.onChange} type="text" className="form-control" placeholder="Last name" />
					</div>

					<div className="form-group">
						<label>Email address</label>
						<input id='email' onChange={this.onChange} type="email" className="form-control" placeholder="Enter email" />
					</div>

					<div className="form-group">
						<label>SIM ID</label>
						<input id='sim-id' onChange={this.onChange} type="text" className="form-control" placeholder="Enter SIM ID" />
					</div>

					<button onClick={this.onSubmit} type="button" className="btn btn-primary btn-block">Sign Up</button>
					<a href='/attendance' style={{'color' : 'blue', 
						'text-decoration':'underline',
						'cursor' : 'pointer', 
						'float':'right'}}>Take Attendance</a>
				</form>
			</div>
        )
	}
}

export default RegistrationForm;