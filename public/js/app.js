	
angle.module('wb')


.inject('Cart', {

	add : function(item) {
		var cart = this.get();
		var i = cart.length;
		var alreadyInCart = false;
		while( --i > -1 ) {
			if(cart[i]._id === item._id) {
				alreadyInCart = true;
				cart[i].count++;
				break;
			} 
		}
		if(!alreadyInCart) {
			item.count = 1;
			cart.push(item)
		} 
		this.persist(cart);
	},

	persist : function (cart) {
		try {		
			localStorage.setItem('cart', JSON.stringify(cart))
		} catch (e) {
			alert('Sie sind im Ikognitomodus oder haben nicht genug Speicherplatz.')
		}
	},

	get : function() {
		var cart = localStorage.getItem('cart') || '[]';
		cart = JSON.parse(cart);
		return cart;
	}

})



.component({
	selector : '.buy', 
	link : function(element, Cart) {
		element.addEventListener('click', function(e) {
			Cart.add(JSON.parse(e.currentTarget.getAttribute('data-buy')));
		});
	} 
})



.component({
	selector : '#checkout', 
	link : function(element, Cart) {

		var cart = Cart.get();

		

		cart.forEach(function(product){

			var article = document.createElement('article');
			article.setAttribute('class', 'col-xs-12 col-sm-6 col-md-4 col-lg-3 product');

			var title = document.createElement('span');
			title.innerHTML = product.name;
			article.appendChild(title);

			var quantity = document.createElement('span');
			quantity.innerHTML =  product.count;
			article.appendChild(quantity);


			var price = document.createElement('span');
			price.innerHTML = 'SFr. ' + product.content.price.toFixed(2)
			article.appendChild(price);

			
			

			element.appendChild(article);
		});

		// var el = $(element); 
		// element.querySelector('.checkout__btn').addEventListener('click', function() {
		// 	if(el.hasClass('checkout--show')) {
		// 		el.removeClass('checkout--show');	
		// 	} else {
		// 		el.addClass('checkout--show');
		// 	}
		// });

	
	} 
})
