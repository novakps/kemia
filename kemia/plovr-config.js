{
	"id":"api",
	"paths": ".",
	"inputs":"api.js",
	"level": "VERBOSE",
	"mode" : "ADVANCED",
	"define": {
		  "goog.DEBUG": false
		},
	"debug": false,
	"output-wrapper" : "/*\n * Kemia JavaScript Library v0.2.0\n * http://http://kemia.github.com/\n * \n * Copyright (c) 2010 Paul Novak (paul@wingu.com)\n * \n * Licensed under the Apache License, Version 2.0 \n * http://www.apache.org/licenses/LICENSE-2.0\n * \n * Date:\n * Revision:\n */\n(function(){%output%})();"
}