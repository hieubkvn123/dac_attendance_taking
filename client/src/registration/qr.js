import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button } from 'react-bootstrap'
import QRCode from 'qrcode.react'
import axios from 'axios'

/* Import CSS */
import './css/qr.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export class QRCodeDiv extends Component {
	constructor(props){
		super(props)

		this.state = {

		}

		this.download = this.download.bind(this)
	}

	componentDidMount() {
		this.setState({event_id : this.props.match.params.data.split('-')[1]})
		this.setState({sim_id : this.props.match.params.data.split('-')[0]})
		this.download()
	}

	download() {
	    const canvas: any = document.querySelector('.HpQrcode');
	    this.downloadRef.href = canvas.toDataURL();
	    this.downloadRef.download = this.props.match.params.data + "-QR.png";
	}

	redirect() {
		window.location.replace('/')
	}

	render() {
		return (
			<div id='qr-container'>
				<table>
					<tr>
						<QRCode style={{'display' : 'block'}} value={this.props.match.params.data} className="HpQrcode" size={256}/>
					</tr>
					<tr>
						<a onClick={this.redirect} style={{'display' : 'block','margin-top' : '22px'}} className='btn btn-primary' ref={(ref: any): any => this.downloadRef = ref}>Download QR Code</a>
					</tr>
				</table>
				<table style={{'margin-left' : '22px'}}>
					<tr>You have registered for event <strong>{this.state.event_id}</strong></tr>
					<tr>Your SIM ID is <strong>{this.state.sim_id}</strong></tr>
					<tr>Please download the QR code for attendance taking on the event date</tr>
				</table>
			</div>
		)
	}
}

class QRCodeScanner extends Component {
	constructor(props) {
		super(props)
		this.state = {
			srcObj : null,
			display_modal : false,
			attendance_interval : null
		}

		/* Binding event handlers */
		this.setCameraStream = this.setCameraStream.bind(this)
		this.componentDidMount = this.componentDidMount.bind(this)
		this.handleCloseModal = this.handleCloseModal.bind(this)
	}

	componentDidMount = async function() {
		// find the user camera
		var recordingHint = {
			'video' : true
		}

		var video = document.getElementById('qr-video')
		var canvas = document.getElementById('qr-canvas')
		var context = canvas.getContext('2d')
		var width = video.width
		var height = video.height

		var cameraStream = null
		await navigator.mediaDevices.getUserMedia(recordingHint).then(function(camera){
			cameraStream = camera

			video.srcObject = camera
		})

		// set an interval to continuously send data to server
		var attendanceInterval = setInterval(() => {
			// console.log('Sending data')
			context.drawImage(video, 0, 0, width, height)
			console.log(width, height)

			var dataURL = canvas.toDataURL().split(',')[1]
			var blobBin = atob(dataURL)
			var array = []

			for(var i = 0; i < blobBin.length; i++){
				array.push(blobBin.charCodeAt(i))
			}

			var blob = new Blob([new Uint8Array(array)], {type:'img/jpg'})
			var formData = new FormData()
			formData.append('img', blob)

			axios({
				url : 'http://localhost:8080/qrcode',
				method : 'POST',
				data : formData,
				headers : {
					'Content-Type' : 'multipart/form-data'
				}
			}).then(response => response.data)
			.then(response => {
				if(response === 'more_than_one'){
					alert('Please display only one QR code on the screen')
				}else if(response === 'invalid_format'){
					alert('Please display the correct QR code')
				}else if(response === 'not_registered'){
					alert('You are not registered in this event')
				}else if(response === 'attended'){
					alert('You have attended this event')
				}else if(response === 'success'){
					// Do somthing here
					window.location.replace('/thankyou')
				}
			})
			.catch(err => console.log(err))

		}, 500)

		this.setCameraStream(cameraStream)
		this.setState({attendance_interval : attendanceInterval})
		this.setState({display_modal : true})
	}
	componentWillUnmount() {}

	setCameraStream(camera) {
		this.setState({srcObj : camera})
	}

	handleCloseModal() {
		this.setState({display_modal : false})
	}

	render() {
		return (
			<div id='camera-container'>
				{/* Display a modal dialog to prompt */}
				<Modal show={this.state.display_modal} 
					onHide={this.handleCloseModal} 
					backdrop="static" 
					keyboard={true}
					centered>
					<Modal.Header closeButton>
						<Modal.Title>DAC Attendance</Modal.Title>
					</Modal.Header>
					
					<Modal.Body>Please present the QR Code for the event to take attendance</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.handleCloseModal}>Yup, Got it!</Button>
					</Modal.Footer>
				</Modal>

				<div id='camera-region'>
					<video id='qr-video' autoplay="" width={720} height={540}></video>
					<canvas id='qr-canvas' hidden width={720} height={540}></canvas>
				</div>
			</div>
		)
	}
}

export default QRCodeScanner;