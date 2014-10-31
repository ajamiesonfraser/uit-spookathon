'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	screen_name: { type: String },
    user_id: { type: String },
	vote: { type: Number },
    hasMembers:{default:false},
	photos: [{type: Array}],
	created: { type: Date , default: Date.now }
};

var userSchema = new Schema(fields);

module.exports = mongoose.model('User', userSchema);
