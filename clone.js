'use strict';
(function(){

	var op = Object.prototype,
		ostring = op.toString;	
	function isfunction(it) {
		return ostring.call(it) === '[object Function]';
	}
	function isArray(it) {
		return ostring.call(it) === '[object Array]';		
	}

})();

