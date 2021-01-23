if [ "$1" = "debug" ]; 
then
	python3 server.py --mysql-user hieu --mysql-pwd 'Qazwsx007;!@#' --debug 1
else
	python3 server.py --mysql-user hieu --mysql-pwd 'Qazwsx007;!@#' --debug 0 
fi
