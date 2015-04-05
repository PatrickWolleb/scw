var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = '';
	locals.data = {
		products: []
	};
		
	view.on('post', function(arguments) {
		console.log(arguments)
	});	
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'checkout' }, function(next) {
		console.log(next)		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});
	

	// Render the view
	view.render('checkout');
	
};
