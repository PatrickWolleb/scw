var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Customer Model
 * ==========
 */

var Customer = new keystone.List('Customer');

Customer.add({
	firstName: { type: Types.Text, initial: false, required: true },
	lastName: { type: Types.Text,  initial: false, required: true },
	email: { type: Types.Email, required: true,  initial: false},
	address1: { type: Types.Text, required: true,  initial: false },
	postCode: { type: Types.Text, required: true,  initial: false },
	city: { type: Types.Text, required: true ,  initial: false},
	tel : { type: Types.Number },
	order : { type: Types.Text , required: true,   initial: false }
});




/**
 * Registration
 */
Customer.register();