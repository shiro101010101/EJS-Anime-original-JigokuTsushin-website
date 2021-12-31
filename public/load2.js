console.log("readed loads2.js");

$(document).ready(function() {
var bg = $('#loader-bg2'),
    loader = $('#loader2');
/* stop loading and display main */
bg.removeClass('is-hide2');
loader.removeClass('is-hide2');

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
