var nodemailer			= require( 'nodemailer');
var log					= require( 'libs/log')( module);
var config				= require( 'config');

var auth = config.get( 'smtp:auth');

// Create a SMTP transport object
var transport = nodemailer.createTransport( "SMTP", {
	//service: 'Gmail', // use well known service.
	// If you are using @gmail.com address, then you don't
	// even have to define the service name

	//auth: auth
});


var registration = function( email, testerId) {

	var message = {
		from: 'MastersWay Developer Team <no-reply@masters-way.sx>'
		,to: 'Tester ' + testerId + '<'+ email +'>'
		,subject: 'Registration complete'
		,headers: {
			'List-Unsubscribe': 'unsubscribe@masters-way.sx'
		}
		,text: 'Hello  Tester, your ID is: ' + testerId + '. For more information check our site and Twitter. If you don`t wont to recive emails from us just drop us email on unsubscribe@masters-way.sx. With regards, Masters Way Development Team.'
		,html: 'Hello  Tester, your ID is: <b>' + testerId + '</b>. <br>For more information check our site and Twitter. <br>If you don`t wont to recive emails from us just drop us email on unsubscribe@masters-way.sx. <br>With regards, Masters Way Development Team.'
	};

	transport.sendMail(message, function( err){
		if( err){
			log.error( 'Send tester id %s, to %s fail. Error: %s', testerId, email, err.message );
			return false;
		}

		log.debug( 'Send tester id %s, to %s', testerId, email);

		// if you don't want to use this transport object anymore, uncomment following line
		//transport.close(); // close the connection pool
	});
}

exports.registration = registration;

