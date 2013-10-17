// Acts as a proxy between frontend and backend
// requires jquery


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        csrftoken = $.cookie('csrftoken');
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


function save_wellpath (well_pk, jsongraph) {
    /*
    *   Takes in well primary key, json object of graph
    *  
    *   if none exists: returns null
    *   if error occurs: returns null and growls a message
    */
     $.ajax({
        url: ("/ajax/update/well/" + well_pk),
        type: "POST",
        datatype: "json",
        data: { graph : JSON.stringify(jsongraph) }
    }).done(function(data) {
        if (data['message'] !== null)
            $.growl(data['message']);
        return true;
    }).fail(function() {
        $.growl("Failure", "Server did not respond accordingly when " +
        "attempting to update well path with id " + well_pk);
        return false;
    });
}


function get_wellpath (well_pk) {
    /*
    *   Takes in well primary key and returns JSON object
    *  
    *   if none exists: returns null
    *   if error occurs: returns null and growls a message
    */
    result = $.ajax({
        url: ("/ajax/get/well/" + well_pk),
        type: "POST",
        async: false,
        datatype: "json"
    }).done(function(data) {
        if (data['message'] !== null)
            $.growl("Get path", data['message']);
    }).fail(function() {
        $.growl("Failure", "Server did not respond accordingly when " +
        "attempting to read well path with id " + well_pk);
    });
    return JSON.parse(result.responseText)['path'];
}

function save_3dconfig (jsonconfig) {
    /*
    *   Takes in well primary key, json object of graph
    *  
    *   if none exists: returns null
    *   if error occurs: returns null and growls a message
    */
     $.ajax({
        url: ("/ajax/update/3dconfig"),
        type: "POST",
        datatype: "json",
        data: { config : JSON.stringify(jsonconfig) }
    }).done(function(data) {
        if (data['message'] !== null)
            $.growl(data['message']);
        return true;
    }).fail(function() {
        $.growl("Failure", "Server did not respond accordingly when " +
        "attempting to update 3d configuration");
        return false;
    });
}


function get_3dconfig () {
    /*
    *   Takes in well primary key and returns JSON object
    *  
    *   if none exists: returns null
    *   if error occurs: returns null and growls a message
    */
    result = $.ajax({
        url: ("/ajax/get/3dconfig"),
        type: "POST",
        async: false,
        datatype: "json"
    }).done(function(data) {
        if (data['message'] !== null)
            $.growl("Get path", data['message']);
    }).fail(function() {
        $.growl("Failure", "Server did not respond accordingly when " +
        "attempting to read user configuration");
    });
    return JSON.parse(result.responseText)['config'];
}