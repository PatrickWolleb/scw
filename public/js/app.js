	
angle.module('wb')

.inject('Toast', window.toastr)
	
.inject('Cart', {

	add : function(item) {
		var cart = this.get();
		cart.push(item);
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

		function deleteItem(e) {
			var index = e.currentTarget.getAttribute('data-index');
			var tr = e.currentTarget.parentNode.parentNode;
			cart.splice(index, 1);
			Cart.persist(cart);
			tr.parentNode.removeChild(tr);
			total = 0;
			cart.forEach(function(product) {
				total += Math.round(product.content.price * 100) / 100;
			})

			// Calculate VAT and total
			var vatAmount = Math.round(total / 100 * 8 * 100) / 100 ;
			total = (Math.round((total + vatAmount) * 100) / 100).toFixed(2);
		 	tFoot.querySelector('.price').innerHTML = 'SFr. ' +  (Math.ceil(total*20)/20).toFixed(2)
			vat.querySelector('.price').innerHTML = 'SFr. ' +  (Math.round((vatAmount) * 100) / 100).toFixed(2);
		
			if(cart.length === 0) {
				var p = document.createElement('p');
				p.innerHTML = 'Ihr Warenkorb ist leer.'
				p.setAttribute('class', 'col-xs-12')
				element.querySelector('#empty').appendChild(p);
				element.querySelector('#checkout-table').style.display = 'none';
				element.querySelector('#checkout-form').style.display = 'none';
			}

		}	




		// Render cart to table
		cart.forEach(function(product, i){
			var tr = document.createElement('tr');
			var title = document.createElement('td');
			title.innerHTML = product.name;
			tr.appendChild(title);
			var price = document.createElement('td');
			price.innerHTML = 'SFr. ' + Math.round(product.content.price * 100) / 100;
			price.setAttribute('class', 'price');
			tr.appendChild(price);
			
			var action = document.createElement('td');			
			action.setAttribute('class', 'action');
			tr.appendChild(action);

			var deleteBtn = document.createElement('button');
			deleteBtn.setAttribute('data-index', i);
			deleteBtn.setAttribute('class', 'btn btn-xs btn-danger glyphicon glyphicon-remove')
			deleteBtn.addEventListener('click', deleteItem)
			action.appendChild(deleteBtn);


			
			total += Math.round(product.content.price * 100) / 100;
			tBody.insertBefore(tr, vat);
		});

		// Calculate VAT and total
		var vatAmount = Math.round(total / 100 * 8 * 100) / 100 ;
	 	total = (Math.round((total + vatAmount) * 100) / 100).toFixed(2);
		tFoot.querySelector('.price').innerHTML = 'SFr. ' +  (Math.ceil(total*20)/20).toFixed(2)
		vat.querySelector('.price').innerHTML = 'SFr. ' +  (Math.round((vatAmount) * 100) / 100).toFixed(2);
	
		if(cart.length === 0) {
			var p = document.createElement('p');
			p.innerHTML = 'Ihr Warenkorb ist leer.'
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


// .component({
// 	selector : '#checkout-btn',
// 	link : function(element, Cart) {
// 		var cart = Cart.get();
// 		if(cart.length !== 0) {

// 			var l = 0;
// 			cart.forEach(function(product) {
// 				l += product.count;
// 			});
// 			element.innerHTML = element.innerHTML + ' (' + l + ')'	
// 		}
// 	}
// })	
