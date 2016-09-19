const metalsmith = require('metalsmith'),
	branch = require('metalsmith-branch'),
	collections = require('metalsmith-collections'),
	excerpts = require('metalsmith-excerpts'),
	markdown = require('metalsmith-markdown'),
	permalinks = require('metalsmith-permalinks'),
	serve = require('metalsmith-serve'),
	templates = require('metalsmith-templates'),
	watch = require('metalsmith-watch'),
	moment = require('moment'),
	assets = require('metalsmith-assets');

let siteBuild = metalsmith(__dirname)
	.metadata({
		site : {
			title : "Tangituru.com",
			url : "http://tangituru.com"
		}
	})
	.source("./src")
	.destination("./build")
	.use(markdown())
	.use(excerpts())
	.use(collections({
		posts: {
			pattern: 'posts/**.html',
			sortBy: 'title',
			reverse: true
		}
	}))
	.use(branch('posts/**.html')
		.use(permalinks({
			pattern: 'posts/:title',
			relative: false
		}))
	)
	.use(assets({
		source : 'assets'
	}))
	.use(templates({
		engine : 'jade',
		moment : moment
	}))
	.use(serve({
		port: 8080,
		verbose: true
	}))
	.use(watch({
		pattern: '**/*',
		livereload: true
	}))
	.use(branch('!posts/**.html')
		.use(branch('!index.md').use(permalinks({
			relative: false
		})))
	)
	.build(function(err) {
		if (err) throw err;
		console.log("Site build complete !");
	})