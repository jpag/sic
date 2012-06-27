SIC
================

-template framework 
	-html5 boilerplate http://www.html5boilerplate.com
	-emberjs js framework http://emberjs.com/
	(CSS either)
	//great cross-compare here: http://net.tutsplus.com/tutorials/html-css-techniques/sass-vs-less-vs-stylus-a-preprocessor-shootout/
		-stylus css compiler http://learnboost.github.com/stylus
		-less css compiler http://lesscss.org/
	(JS)
		-js compiler...?

-if you need a server side framework with php use the full framework alternative.

-compilers / installation
	-install node.js


	-installing stylus http://learnboost.github.com/stylus/
		// have it globally installed: npm install -g stylus
		compile 
			for a file: 		stylus --compress < in.styl > out.css
			for a directory: 	stylus /css

	-installing less
		globally
		// have it globally installed: $ npm install -g less
		compile 
			for a file:			 lessc global.less > global.css

