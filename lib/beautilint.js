'use strict';
const when = require('when/node')
const fs = require('fs')
const readFile = when.lift(fs.readFile)
const writeFile = when.lift(fs.writeFile)
const globAll = when.lift(require("glob-all"))
const EsLint = require("eslint").CLIEngine
const esFormatter = EsLint.getFormatter()
const beautify = require("js-beautify").js_beautify

class Beautilint {
	run(glob) {
		var self = this;
		if(this.eslint)
			return globAll(glob).then(files => {
				return Promise.all(files.map(file => self._lintFile(file)))
			})
		else
			return readFile(process.cwd() + "/.jsbeautifyrc", 'utf8')
				.then(config => {
					try {
						self.jsbeautifyConfig = JSON.parse(config)
					} catch(err) {
						console.error('fatal error loading jsbeautify config')
						throw err
					}
					return readFile(process.cwd() + "/.eslintrc", 'utf8')
				})
				.then(config => {
					try {
						var baseConfig = JSON.parse(config)
					} catch(err) {
						console.error('fatal error loading eslint config')
						throw err
					}
					self.eslint = new EsLint({
						fix: true,
						cache: true,
						useEslintrc: false,
						baseConfig: baseConfig
					})
					return self.run(glob)
				})
	}

	_lintFile(file) {
		var self = this
		return readFile(file, 'utf8')
			.then(contents => {
				console.info("run js-beautify", file)
				const result = {
					originalText: contents,
					beautified: beautify(contents, self.jsbeautifyConfig)
				}
				console.info("js-beautify success", file)
				return result
			})
			.then(results => {
				console.info("run es-lint", file)
				results.linted = self.eslint.executeOnText(results.beautified)
				console.info("es-lint success", file)
				return results
			})
			.then(results => {
				console.log(esFormatter(results.linted.results))
				if(results.linted.results.output && results.linted.results.output !== results.originalText) {
					return writeFile(file, results.linted.results.output).then(() => console.info('wrote js-beautified with eslint fixes', file));
				} else if(results.beautified && results.beautified !== results.originalText) {
					return writeFile(file, results.beautified).then(() => console.info('wrote js-beautified', file));
				}
				console.info('no changes required', file)
			}).catch(err => {
				console.error('error beautilinting', file)
				console.error(err.stack)
			})
	}
}

module.exports = Beautilint
