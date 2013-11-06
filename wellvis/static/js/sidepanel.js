/*
*  Sidepanel.js
*  
*  Purpose:
*  Holds settings regarding sidepanel
*  - Last view 
*  - Hidden or shown
*  
*  Requirements:
*  jquery-2.0.3.js or newer
*  jquery-cookie.js   @https://github.com/carhartl/jquery-cookie
*  
*  Usage:
*  
*  
*/

$(".sidePanelToggler").click(function() {
    toggleSidePanel(!($(".sidepanel").is(":visible")));
});

function showPageView(visible) {
    if (visible) {
        $('col-md-12').css('padding', '0 15px');
        $('#title').show();
        $('.navbar').show();
    }
    else {
        $('col-md-12').css('padding', '0');
        $('#title').hide();
        $('.navbar').hide();
    }
}

function toggleSidePanel(visible) {
    if (visible) {
        $.cookie("sidepanel_hidden", "1", { path: '/' });
        $(".sidePanelToggler").removeClass("glyphicon-chevron-down");
        $(".sidePanelToggler").addClass("glyphicon-chevron-up");
        $(".sidepanel").show();
    } else {
        $.cookie("sidepanel_hidden", "0", { path: '/' });
        $(".sidepanel").hide();
        $(".sidePanelToggler").removeClass("glyphicon-chevron-up");
        $(".sidePanelToggler").addClass("glyphicon-chevron-down");
    }
}

$( document ).ready(function() {
      console.log($.cookie("sidepanel_hidden"));
  });
