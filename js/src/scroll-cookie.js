// build time:Tue Sep 17 2019 23:58:43 GMT+0800 (GMT+08:00)
$(document).ready(function(){var o=window.location.href.replace(window.location.origin,"");var i;$(window).on("scroll",function(){clearTimeout(i);i=setTimeout(function(){Cookies.set("scroll-cookie",$(window).scrollTop()+"|"+o,{expires:365,path:""})},250)});if(Cookies.get("scroll-cookie")!==undefined){var e=Cookies.get("scroll-cookie").split("|");if(e[1]===o){$(window).scrollTop(e[0])}}});
//rebuild by neat 