window.socket = io.connect( '/');

window.ui = {
    setAvatar: function( el, options){

        console.log( options);

        var blockWidth = $( el).width();
        var blockHeight = $( el).height();

        var backgroundPositionVertical = -1 * blockHeight  * ( options.race * 2 + options.gender);
        var backgroundPositionHorizontal = -1 * blockWidth * options.avatar

        var backgroundPosition = backgroundPositionHorizontal + 'px ' + backgroundPositionVertical + 'px';
        $( el).css( { 'background-position': backgroundPosition})
    }
}