/**
* Shim the require function used in node.js
*/
(function(parent) {

if (parent.require !== undefined)
	throw 'RequireException: \'require\' already defined in global scope';


parent.require = function(module) {
	var url = parent.require.resolve(module);

	//check the cache first
	if (parent.require.cache[url])
		return parent.require.cache[url];

	var scr = document.createElement("script");
	scr.src = url;
	document.body.appendChild(scr);
};

//transform require url into a real url
parent.require.resolve = function(module) {
	var r = module.match(/^(\.{0,2}\/)?([^\.]*)(\..*)?$/);
	return (r[1]?r[1]:'./')+r[2]+(r[3]?r[3]:(r[2].match(/\/$/)?'index.js':'.js'));
};

//create module cache
parent.require.cache = {};
})(window);