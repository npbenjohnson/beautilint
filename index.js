#!/usr/bin/env node --harmony

'use strict';
const Beautilint = require('./lib/beautilint.js')
module.exports = Beautilint

if(require.main === module) {
	const argv = require('minimist')(process.argv.slice(2))
	const beautilint = new Beautilint()
	if(!argv._ || argv._.length === 0) {
		console.log('Usage: beautilint glob [glob...]');
		process.exit(0);
	}
	// Was run from command line
	beautilint.run(argv._).catch((err) => console.error(err.stack));
}
