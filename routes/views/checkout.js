var keystone = require('keystone');
var Customer = keystone.list('Customer');
var moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = '';
	locals.data = {
		products: []
	};
		
	view.on('post', function(next) {
	
		var customer = new Customer.model({});
		var  updater = customer.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'firstName, lastName, email, address1, postCode, city, order',
			errorMessage: 'Die gesendeten Daten sind nicht korrekt.'
		}, function(err, doc) {


		if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success' , { 
					title: 'Ihre Bestellung wurde erfolgreich and uns gesendet.',
					detail : 'Wir werden mit Ihnen Kontak aufnehmen.'
				});

				locals.clearCart = true;
			}
			next();
		});
	});	
	
	// On POST requests, add the Enquiry item to the database
	// view.on('post', { action: 'checkout' }, function(next) {
		
	// 	console.log('>>>', req.body)

	// 	var newEnquiry = new Enquiry.model(),
	// 		updater = newEnquiry.getUpdateHandler(req);
		
	// 	updater.process(req.body, {
	// 		flashErrors: true,
	// 		fields: 'name, email, phone, enquiryType, message',
	// 		errorMessage: 'There was a problem submitting your enquiry:'
	// 	}, function(err) {
	// 		if (err) {
	// 			locals.validationErrors = err.errors;
	// 		} else {
	// 			locals.enquirySubmitted = true;
	// 		}
	// 		next();
	// 	});
		
	// });
	

	// Render the view
	view.render('checkout');
	
};
