utility.ajax = {
	jsonp: function(url, data){
		return $.jsonp({
                        url: url,
                        callbackParameter: "callback",
                        data: data
                });
    	}
};
