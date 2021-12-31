console.log("readed loads.js");

$(document).ready(function() {
var bg = $('#loader-bg'),
    loader = $('#loader');
/* stop loading and display main */
bg.removeClass('is-hide');
loader.removeClass('is-hide');

/* loaded */
$(window).on('load', stopload);

/* stop loading 10sec */
setTimeout('stopload()',10000);

/* hide loading */
function stopload(){
    bg.delay(900).fadeOut(800);
    loader.delay(900).fadeOut(300);
}

});
