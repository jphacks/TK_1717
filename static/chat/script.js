if (!localStorage.username) {
    $('#go').on('click', function () {
        if ($('#username').val()) {
            localStorage.username = $('#username').val();
            $('#splash').remove();
        }
    });
} else {
    $('#splash').remove();
}

/********************************
 * URL Parsing
 ********************************/
const parseSearch = search => {
    const kv = {};
    search.split(/[\?&]/g).map(q => {
        if (q==="") return;
        const i = q.indexOf("=");
        const key = (i>=0) ? q.slice(0,i) : q;
        const val = (i>=0) ? q.slice(i+1) : null;
        kv[key] = val;
    });
    return kv;
}

const search = parseSearch(decodeURI(location.search));
console.log(search);

if (search.pkey) {
    $.get(`https://jphacks.tk/homes/api/realestate_article/${search.pkey}`).then(data => {
        console.log(data.realestate_article_name)
        $('h1').text(data.realestate_article_name)
    });
    $('#url').val(location.href);
    $('body').addClass('active');
} else {
    $('h1').text('Oops, room or room name not found!');
    throw new Error();
}

var room = search.pkey;


/********************************
 * Sample Programs
 ********************************/

// create our webrtc connection
var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: true
});

// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
    // you can name it anything
    console.log(room);
    if (room) webrtc.joinRoom(room);
});

function showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) { // vary between -45 and -20
        el.style.height = '0px';
    } else if (volume > -20) {
        el.style.height = '100%';
    } else {
        el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
}
webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type == 'volume') {
        showVolume(document.getElementById('volume_' + peer.id), data.volume);
    }
});
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('videos');
    if (remotes) {
        var d = document.createElement('div');
        d.className = 'videoContainer';
        d.id = 'container_' + webrtc.getDomId(peer);
        d.appendChild(video);
        var vol = document.createElement('div');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume_bar';
        d.appendChild(vol);
        remotes.appendChild(d);
    }
    $('.videoContainer').css('width',  `calc(100vw / ${$('.videoContainer').length} - 10px)`);
    $('.videoContainer').css('height', `calc((100vw / ${$('.videoContainer').length} - 10px) * 2 / 3)`);
});
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('videos');
    var el = document.getElementById('container_' + webrtc.getDomId(peer));
    if (remotes && el) {
        remotes.removeChild(el);
    }
    $('.videoContainer').css('width', `calc(100vw / ${$('.videoContainer').length})`);
});
webrtc.on('volumeChange', function (volume, treshold) {
    //console.log('own volume', volume);
    showVolume(document.getElementById('localVolume'), volume);
});


/********************************
 * Chat Programm
 ********************************/
const addChat = ({time, name, message}) => {
    const $elm = $('<div>');
    $elm.addClass('message');
    $elm.html(`<span class="name">${name}</span>: <span class="body">${message}</span><span class="time">${new Date(time).toLocaleString().slice(-8)}</span>`);
    $('#messages').append($elm);
}

webrtc.connection.on('message', function (data) {
    if (data.type === "chat") {
        addChat(data.payload);
    }
});

$('#sendMessage').on('click', function (event) {
    const time = 1*new Date();
    const name = localStorage.username;
    const message = $('#message').val();
    $('#message').val("");
    const payload = {time, name, message};
    addChat(payload);
    webrtc.sendToAll('chat', payload);
});

void async function () {
    // const options = {};
    // options.credentials = "same-origin";
    // options.headers = {'Access-Control-Allow-Origin':'*'};
    // const response = await fetch('/messages', options);
    // const data = await response.json();
    // console.log(data);
}();
