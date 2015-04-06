var keystone = require('keystone');
var Customer = keystone.list('Customer');
var moment = require('moment');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_APIKEY);

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

				var message = {
    "html": "<p>Example HTML content</p>",
    "text": "Example text content",
    "subject": "example subject",
    "from_email": "message.from_email@example.com",
    "from_name": "Example Name",
    "to": [{
            "email": "pat.wolleb@gmail.com",
            "name": "Recipient Name",
            "type": "to"
        }],
    "headers": {
        "Reply-To": "message.reply@example.com"
    },
    "important": false,
    "track_opens": null,
    "track_clicks": null,
    "auto_text": null,
    "auto_html": null,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    "bcc_address": "message.bcc_address@example.com",
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "merge": true,
    "merge_language": "mailchimp",
    "global_merge_vars": [{
            "name": "merge1",
            "content": "merge1 content"
        }],
    "merge_vars": [{
            "rcpt": "recipient.email@example.com",
            "vars": [{
                    "name": "merge2",
                    "content": "merge2 content"
                }]
        }],
    "tags": [
        "password-resets"
    ],
    "subaccount": "customer-123",
    "google_analytics_domains": [
        "example.com"
    ],
    "google_analytics_campaign": "message.from_email@example.com",
    "metadata": {
        "website": "www.example.com"
    },
    "recipient_metadata": [{
            "rcpt": "recipient.email@example.com",
            "values": {
                "user_id": 123456
            }
        }],
    "attachments": [{
            "type": "text/plain",
            "name": "myfile.txt",
            "content": "ZXhhbXBsZSBmaWxl"
        }],
    "images": [{
            "type": "image/png",
            "name": "IMAGECID",
            "content": "ZXhhbXBsZSBmaWxl"
        }]
};
var async = false;
var ip_pool = "Main Pool";
var send_at = "example send_at";
mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
    console.log(result);
    /*
    [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123abc123"
        }]
    */
}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
});
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
