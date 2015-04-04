var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = '';
	locals.filters = {
		slug: req.params.slug
	};
	locals.data = {
		posts: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Product').model.findOne({
			state: 'published',
			slug: locals.filters.slug
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.product = result;
			locals.data.product.vo = JSON.stringify(result);
			next(err);
		});
		
	});


	// Render the view
	view.render('product');
	
};
