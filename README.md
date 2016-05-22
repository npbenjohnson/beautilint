# beautilint
nodejs wrapper for js-beautify / eslint, js-beautify is limited, eslint has bugs, but together they beautilint!
Uses [glob-all](https://www.npmjs.com/package/glob-all) to locate files, requires .eslintrc and .jsbeautifyrc to be present in cwd
run with `beautilint glob [glob...]`
