// js/modules/search/autocomplete.js
// Typeahead/Bloodhound Module.

//var keywords = ['Sales', 'Sales Associate', 'Sales Engineer', 'Sales Manager', 'Sales Management'];
//var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota','Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island','South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont','Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
var keywords = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// `keywords` is an array of keyword names defined in "The Basics"
	//local: $.map(keywords, function(keyword) { return { value: keyword }; })
    remote: {
        url: location.protocol + "//api." + location.hostname + "/keyword/api/v1/get_keywords/?limit=5&site=careeralerts&kw=%QUERY",
        filter: function (keywords) {
            return $.map(keywords, function (keyword) {
                return {
                    value: keyword.keyword
                };
            });
        }
    }
});
var states = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// `states` is an array of state names defined in "The Basics"
	//local: $.map(states, function(state) { return { value: state }; })
    remote: {
        url: location.protocol + "//api." + location.hostname + "/metrics/location/?loc=%QUERY",
        filter: function (locations) {
            return $.map(locations, function (location) {
                return {
                    value: location.city_state
                };
            });
        }
    }
});
keywords.initialize();
states.initialize();
