import React, { Component } from 'react'

/* Import css */
import 'bootstrap/dist/css/bootstrap.min.css';

class ThankyouPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			first_name : null,
			last_name : null,
			event_id : null
		}
	}

	componentDidMount() { 
		var data = this.props.match.params.data
		var splits = data.split('-')
		this.setState({first_name : splits[0], last_name : splits[1], event_id:splits[2]})
	}
	componentDidUnmount() { }

	render() {

		return (
			<div class="jumbotron text-center">
				<h1 class="display-3">Thank You!</h1>
				<p class="lead">
					Thank you {this.state.first_name} {this.state.last_name}, your attendance for {this.state.event_id} has been marked
				</p>
				<hr/>
				<canvas id='qr-canvas'></canvas>
				
				<p class="lead">
					<a class="btn btn-primary btn-sm" href="/" role="button">Continue to homepage</a>
				</p>
			</div>
		)

	}
}

export default ThankyouPage;