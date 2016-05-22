module.exports = function(){
	// Wait for mocha phantomjs to load if this is a browser test
	global.chai = require('chai');
	 // Set up mocks
	chai.use(require('sinon-chai'));
	// Set up promise framework
	chai.use(require('chai-as-promised'));
	// Make should syntax available
	chai.should();
	// Make expect available
	global.expect = chai.expect;
	// Make assert available
	global.assert = chai.assert;
	global.sinon = require('sinon');
	// sinon (mocking framework) cleanup hooks
	beforeEach(function() {
	  this.sinon = sinon.sandbox.create();
	});
	afterEach(function(){
	  this.sinon.restore();
	});
}