'use strict'
const when = require('when/node')
const fs = require('fs')
const readFile = when.lift(fs.readFile)
const writeFile = when.lift(fs.writeFile)
const Beautilint = require('./beautilint.js')
describe('Beautilint', function() {
	it("Should beautilint", function() {
		const beautilint = new Beautilint()
		return expect(writeFile('./test/lintme.js', "  function asdf (  arg)  {\r\n\r\n\r\n var asdf=3  ; }\r\n")
				.then(() => beautilint.run('./test/lintme.js'))
				.then(() => readFile('./test/lintme.js', 'utf8')))
			.to.eventually.equal("  function asdf(arg) {\n\n  \tvar asdf = 3;\n  }\n")
	})
	it("Should not beautilint ignored file", function() {
		const beautilint = new Beautilint()
		return expect(writeFile('./test/lintme.js', "  function asdf (  arg)  {\r\n\r\n\r\n var asdf=3  ; }\r\n")
				.then(() => beautilint.run(['./test/lintme.js', '!./test/lintme.js']))
				.then(() => readFile('./test/lintme.js', 'utf8')))
			.to.eventually.equal("  function asdf (  arg)  {\r\n\r\n\r\n var asdf=3  ; }\r\n")
	})
})
