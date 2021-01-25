from flask import Flask
from flask import request
from flask import render_template
from flask_cors import CORS

import cv2
import json
import numpy as np
import mysql.connector
from argparse import ArgumentParser
from PIL import Image
from qrcode import detect_and_decode

parser = ArgumentParser()
parser.add_argument('--debug', type=int, required=True, help='Debug mode')
parser.add_argument('--mysql-user', type=str, required=True, help='MySQL username')
parser.add_argument('--mysql-pwd', type=str, required=True, help='MySQL password')
args = vars(parser.parse_args())

### Some constants ###
PORT=8080
DEBUG=bool(args['debug'])

app = Flask(__name__)
CORS(app)

def _get_mysql_connection():
	db = mysql.connector.connect(
		host = '127.0.0.1',
		database = 'dac',
		user = args['mysql_user'],
		passwd = args['mysql_pwd']
	)

	return db

@app.route("/")
def home():
    return "<h1>Hello World</h1>"

@app.route('/list-events', methods=['POST'])
def list_events():
	connection = _get_mysql_connection()
	cursor = connection.cursor()

	sql = 'SELECT * FROM events'
	cursor.execute(sql)

	results = cursor.fetchall()
	print(results)
	events = []

	for row in results:
		events.append('%s - %s' % (row[0], row[1]))

	connection.close()
	return json.dumps(events)

@app.route('/add-participant', methods=['POST'])
def add_participant():
	connection = _get_mysql_connection()
	cursor = connection.cursor()

	if(request.method == 'POST'):
		first_name = request.form['first-name']
		last_name = request.form['last-name']
		email = request.form['email']
		sim_id = request.form['sim-id']
		event = request.form['selected_event']
		event_id = event.split('-')[0].strip()
		attended = 0

		# Check if this sim id is registered with this event 
		sql = "SELECT * FROM registration WHERE sim_id='%s' AND event_id='%s'" % (sim_id, event_id)
		cursor.execute(sql)
		results = cursor.fetchall()
		if(cursor.rowcount >= 1): # if repeated registration
			### Delete ###
			print('[INFO] Repeated registration for sim_id = %s and event_id = %s' % (sim_id, event_id))
			sql = "DELETE FROM registration WHERE sim_id='%s' AND event_id='%s'" % (sim_id, event_id)
			cursor.execute(sql)
			connection.commit()


		### Insert new record ###
		sql = 'INSERT INTO registration VALUES (%s, %s, %s, %s, %s, %s)'
		values = (
			first_name, last_name, email, sim_id, event_id, attended
		)

		cursor.execute(sql, values)
		connection.commit()
		connection.close()

		### Generate qr code and send to participant ###
		# in data we will have the sim id of the participant and event id
		qrcode = '%s-%s' % (sim_id, event_id)


		if(cursor.rowcount >= 1):
			return qrcode # 'success'
		else:
			return 'failed'

@app.route('/qrcode', methods=['POST'])
def qrcode():
	if(request.method=='POST'):
		img = Image.open(request.files['img']).convert('RGB')
		img = np.array(img)
		img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

		# print(img)
		rects, data, types = detect_and_decode(img)
		if(len(rects) < 1):
			return 'no_code'
		elif(len(rects) > 1):
			return 'more_than_one'

	### Check if data is in proper format ###
	# in data we will have the sim id of the participant and event id
	splits = data[0].split('-')
	if(len(splits) != 2):
		print(splits)
		return 'invalid_format'
	else:
		sim_id = splits[0]
		event_id = splits[1]

	connection = _get_mysql_connection()
	cursor = connection.cursor()
	
	### Check if the sim_id and event_id is inside ###
	sql = "SELECT * FROM registration WHERE sim_id='%s' AND event_id='%s'" % (sim_id, event_id)
	cursor.execute(sql)
	results = cursor.fetchall()
	if(cursor.rowcount == 0):
		return 'not_registered'

	### Check if sim_id and event_id is inside but attended already ###
	sql = "SELECT * FROM registration WHERE sim_id='%s' AND event_id='%s' AND attended=1" % (sim_id, event_id)
	cursor.execute(sql)
	results = cursor.fetchall()
	if(cursor.rowcount >= 1):
		return 'attended'

	### Find info about participant ###
	sql = "SELECT * FROM registration WHERE sim_id='%s' AND event_id='%s' AND attended=0" % (sim_id, event_id)
	cursor.execute(sql)
	results = cursor.fetchall()
	info = results[0]
	response = 'success-' + str(info[0]) + '-' + str(info[1]) + '-' + str(info[4])

	### If none of above circumstances, update ###
	sql = "UPDATE registration SET attended=1 WHERE sim_id='%s' AND event_id='%s'" % (sim_id, event_id)
	cursor.execute(sql)
	connection.commit()
	connection.close()

	return response

@app.route('/list-participants', methods=['POST'])
def list_participants():
	if request.method == 'POST':
		event_id = request.form['event_id']
		event_name = request.form['event_name']

		sql = 'SELECT * FROM registration WHERE event_id="%s"' % event_id
		connection = _get_mysql_connection()
		cursor = connection.cursor()

		cursor.execute(sql)
		results = cursor.fetchall()

		participants = []
		for row in results:
			participants.append(row)

		participants = json.dumps(participants)

		connection.close()

		return participants

if __name__ == '__main__':
	if(DEBUG):
		print('[INFO] Running in debugging mode ... ')
	else:
		print('[INFO] Running in deploying mode ... ')

	app.run(port=PORT, host='0.0.0.0', debug=DEBUG)
