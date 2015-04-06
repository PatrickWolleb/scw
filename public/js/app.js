	
angle.module('wb')

.inject('Toast', window.toastr)
	
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
	},

	clear: function() {
		try {		
			localStorage.removeItem('cart')
		} catch (e) {
			alert('Sie sind im Ikognitomodus oder haben nicht genug Speicherplatz.')
		}
	}

})



.component({
	selector : '.buy', 
	link : function(element, Cart, Toast) {
		element.addEventListener('click', function(e) {
			
			var product = JSON.parse(e.currentTarget.getAttribute('data-buy'));
			Cart.add(product);
			Toast.info(product.name + ' wurde dem Warenkorb hinzugefügt.')
			//location.reload();
		});
	} 
})



.component({
	selector : '#checkout', 
	link : function(element, Cart) {

		if(window.CLEAR_CART === true) {
			Cart.clear();
		}



		var cart = Cart.get();
	 	var vat = element.querySelector('#vat');		
		var tBody = element.querySelector('tbody');
		var tFoot = element.querySelector('tfoot');
		var total = 0;

		// Render cart to table
		cart.forEach(function(product){
			var tr = document.createElement('tr');
			var title = document.createElement('td');
			title.innerHTML = product.name;
			tr.appendChild(title);
			var unitPrice = document.createElement('td');
			unitPrice.innerHTML =  'SFr. ' + Math.round(product.content.price * 100) / 100;
			tr.appendChild(unitPrice);
			var quantity = document.createElement('td');
			quantity.innerHTML =  product.count;
			tr.appendChild(quantity);
			var price = document.createElement('td');
			price.innerHTML = 'SFr. ' + Math.round(product.content.price * product.count * 100) / 100;
			price.setAttribute('class', 'price');
			tr.appendChild(price);
			total += Math.round(product.content.price * product.count * 100) / 100;
			tBody.insertBefore(tr, vat);
		});

		// Calculate VAT and total
		var vatAmount = Math.round(total / 100 * 8 * 100) / 100 ;
	 	tFoot.querySelector('.price').innerHTML = 'SFr. ' +  (Math.round((total + vatAmount) * 100) / 100).toFixed(2);
		vat.querySelector('.price').innerHTML = 'SFr. ' +  vatAmount;	
	
		if(cart.length === 0) {
			var p = document.createElement('p');
			p.innerHTML = 'Ihr Warenkotb ist leer.'
			p.setAttribute('class', 'col-xs-12')
			element.querySelector('#empty').appendChild(p);
			element.querySelector('#checkout-table').style.display = 'none';
			element.querySelector('#checkout-form').style.display = 'none';
		}

		element.style.display = 'block';
	} 
})


.component({
	selector : '#checkout-form',
	link : function(element, Cart) {
		element.addEventListener('submit', function(e) {
			element.querySelector('#data-order').setAttribute('value', JSON.stringify(Cart.get()));
		});
	}
})


.component({
	selector : '#checkout-btn',
	link : function(element, Cart) {
		var cart = Cart.get();
		if(cart.length !== 0) {

			var l = 0;
			cart.forEach(function(product) {
				l += product.count;
			});
			element.innerHTML = element.innerHTML + ' (' + l + ')'	
		}
	}
})	
