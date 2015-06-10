$( document).ready( function() {

    //init
    var activeRegistration = null
        ,options  = {
            avatarsCount: $( '#reg-image').data( 'count')
        }

    setAvatar();

    //set avatar
    function setAvatar() {
        $( '#select-characters li:not( .empty)').each( function ( idx, el){
            var options = {
                gender: $( el).data( 'profile-gender')
                ,race: $( el).data( 'profile-race')
                ,avatar: $( el).data( 'profile-avatar')
            }

            ui.setAvatar ( el, options);
        })
    }

    //Click on the character
    $( '#select-characters li').on( 'click', function(){


        var isEmpty = $( this).hasClass( 'empty')
            ,idx = $( this).data( 'profile-idx');
        if (isEmpty) {

            activeRegistration = new Registration(idx);
        } else {

            var idx = $( this).data( 'profile-idx')
                ,data = { idx: idx};

            socket.emit( 'auth/in_game', data)
            console.log( 'login character idx ' + idx);
        }
    });

    //socket api
    socket.on( 'auth/profiles', function( data){

        console.log( 'Update profiles', data);

        var html = '';
        for( var idx = 0; idx < data.profiles.length; idx++) {

            var profile = data.profiles[ idx];

            if( profile == null) {

                html+= ''
                    + '<li class="avatar empty" data-profile-idx="' + idx + '">'
                    + ' <div> Create </div>'
                    + '</li>'
            } else {

                html+= ''
                    + '<li class="avatar" data-profile-avatar="' + profile.avatar + '" data-profile-race="' + profile.race + '" data-profile-gender="' + profile.gender + '" data-profile-idx="' + idx + '">'
                    + ' <div>' + profile.nickname + '</div>'
                    + '</li>'
            }
        }

        $( '#select-characters ul').html( html);
        setAvatar();

        $( '#registration-form-cancel').click();
    })
    socket.on( 'auth/in_game', function( data){

        if( data.result == 'success') {
            window.location = '/game';
        } else {
            console.log( 'character login error');
        }
    })

    //registration
    function Registration ( idx) {

        var self = this;
        
        //button
        function cancel () {

            activeRegistration = null;
            $('#registration').hide()
            $('#select-characters').show()
        }

        function success () {

            if( self.nickname == '') {
                $( '#input-nickname').parent().addClass( 'has-error')
            } else {
                var data = {
                    idx: self.idx
                    ,nickname: self.nickname
                    ,race: self.race
                    ,gender: self.gender
                    ,avatar: self.avatar
                }

                console.log( 'Create new character:', data);
                socket.emit( 'auth/create', data);
            }
        }

        //nickname
        $( '#input-nickname').keyup( function(){
            $( this).parent().removeClass( 'has-error')
            var val = $( this).val();
            self.nickname = val;
        })

        //race
        function setRace () {

            var blockWidth = $( '#race-list li').outerWidth();
            var marginLeft = -1 * blockWidth * self.race;

            $( '#race-list').stop().animate( { marginLeft: marginLeft}, 450);

            setImage();

            var blockWidth = $( '#race-description li').outerWidth();
            var marginLeft = -1 * blockWidth * self.race;
            $( '#race-description ol').css( { 'margin-left': marginLeft})
        }

        function setGender()
        {
            $( '#input-gender').val( );

            var blockWidth = $( '#gender-list li').outerWidth();
            var marginLeft = -1 * blockWidth * self.gender;

            $( '#gender-list').stop().animate( { marginLeft: marginLeft}, 450);

            setImage();
        }

        function setImage (){

            var blockWidth = $( '#reg-image').width();
            var blockHeight = $( '#reg-image').height();

            var backgroundPositionVertical = -1 * blockHeight  * ( self.race * 2 + self.gender);
            var backgroundPositionHorizontal = -1 * blockWidth * self.avatar

            var backgroundPosition = backgroundPositionHorizontal + 'px ' + backgroundPositionVertical + 'px';
            $( '#reg-image').css( { 'background-position': backgroundPosition})
        }



        //ui events
        $( '#race-prev').click( function(){
            if( self.race > 0) {
                self.race--;
                setRace();
            }
        });

        $( '#race-next').click( function(){
            if( self.race < 2) {
                self.race++;
                setRace();
            }
        });


        $( '#gender-prev').click( function(){
            if( self.gender > 0)
            {
                self.gender--;
                setGender();
            }
        });

        $( '#gender-next').click( function(){
            if( self.gender < 1)
            {
                self.gender++;
                setGender( self.gender);
            }
        })


        $( '#reg-image-prev').click( function(){
            if( self.avatar > 0) {

                self.avatar--;
                setImage();
            }
        });

        $( '#reg-image-next').click( function(){
            if( self.avatar < ( options.avatarsCount - 1)) {

                self.avatar++;
                setImage();
            }
        })

        $( '#registration-form-cancel').click( cancel)
        $( '#registration-form-success').click( success)

        //init
        self.idx = idx
        self.nickname = ''
        self.race = 0
        self.gender = 0
        self.avatar = 0

        $( '#input-nickname')
            .val( '')
            .parent().removeClass( 'has-error')

        setImage();

        $( '#select-characters').hide()
        $( '#registration').show()
    }
});