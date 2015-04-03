var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = '';
	locals.data = {
		products: []
	};
	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Product').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.products = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('index');
	
};
