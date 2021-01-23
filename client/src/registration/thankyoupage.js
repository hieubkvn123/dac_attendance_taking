import React, { Component } from 'react'

/* Import css */
import 'bootstrap/dist/css/bootstrap.min.css';

class ThankyouPage extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() { }
	componentDidUnmount() { }

	render() {

		return (
			<div class="jumbotron text-center">
				<h1 class="display-3">Thank You!</h1>
				<p class="lead">
					Thank you, your attendance has been marked
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