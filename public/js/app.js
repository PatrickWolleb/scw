	
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


		element.querySelector('.checkout__btn').addEventListener('click', function() {
			console.log(this)

			$(element).addClass('checkout--show');
		});

	
	} 
})
