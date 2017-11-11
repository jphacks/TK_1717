let webrtc, pkey, userName, userId;

/**
 * Server Requests
 */
const makeOptions = () => ({credentials: "same-origin", headers: {'Access-Control-Allow-Origin':'*'}});
const fetchAuth = () => fetch('/auth', makeOptions()).then(it=>it.json());
const fetchMessages = () => fetch(`/messages/${pkey}`, makeOptions()).then(it=>it.json());
const postMessage = async message => {
    const options = makeOptions();
    options.method = 'POST';
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify({message});
    const response = await fetch(`/messages/${pkey}`, options).then(it=>it.json());
}

/**
 * Chat View
 */
const addChat = message => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <span class="name">${message.userName}</span>:
        <span class="body">${message.body}</span>
        <span class="time">${new Date(parseInt(message.createdAt)).toLocaleString().slice(-8)}</span>
    `;
    $('#messages').appendChild(div);
}

const recvMessage = data => {
    if (data.type !== "chat") return;
    const message = data.payload;
    addChat(message);
}

const sendMessage = () => {
    const body = $('#message').value;
    const createdAt = (1*new Date()).toString();
    const message = { pkey, userName, userId, createdAt, body };
    $('#message').value = "";
    addChat(message);
    webrtc.sendToAll('chat', message);
    postMessage(message);
}

/**
 * WebRTC Videos
 */
const containerId = peer => `container_${webrtc.getDomId(peer)}`;
const volumeId = peer => `volume_${peer.id}`;

const showVolume = (el, volume) => {
    if (!el) return;
    if (volume < -45) { // vary between -45 and -20
        el.style.height = '0px';
    } else if (volume > -20) {
        el.style.height = '100%';
    } else {
        el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
};

const createVolume = (video, peer) => {
    const div = document.createElement('div');
    div.id = volumeId(peer);
    div.classList.add('volume_bar');
    return div;
};

const createVideoContainer = (video, peer) => {
    const div = document.createElement('div');
    div.classList.add('videoContainer');
    div.id = containerId(peer);
    div.appendChild(video);
    div.appendChild(createVolume(video, peer));
    return div;
};

const arrangeVideos = () => {
    const videos = $$('.videoContainer');
    videos.forEach(video => {
        video.style.width  = `calc(100vw / ${videos.length} - 10px)`
        video.style.height = `calc((100vw / ${videos.length} - 10px) * 2 / 3)`;
    });
};

const initWebRTC = room => {
    const webrtc = new SimpleWebRTC({
        localVideoEl: $('#local.videoContainer video'),
        remoteVideosEl: '',
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true
    });
    webrtc.on('readyToCall', () => webrtc.joinRoom(room));

    webrtc.on('videoAdded',   (video, peer) => { $('#videos').appendChild(createVideoContainer(video, peer)); arrangeVideos(); });
    webrtc.on('videoRemoved', (video, peer) => { $('#videos').removeChild($(`#${containerId(peer)}`)); arrangeVideos(); });

    webrtc.on('channelMessage', (peer, label, data) => (data.type != 'volume') ? showVolume($(`#${volumeId(peer)}`), data.volume) : null);
    webrtc.on('volumeChange', (volume, treshold) => showVolume($('#local.videoContainer .volume_bar'), volume));
    return webrtc;
}


/**
 * General Views
 */
const setView = async () => {
    if (!pkey) {
        $('h1').textContent = 'Oops, pkey not found!';
        throw new Error();
    }

    $('body').classList.add('active');
    $('#url').value = location.href;
    if (location.origin === "jphacks.tk") {
        const article = await jQUery.get(`https://jphacks.tk/homes/api/realestate_article/${pkey}`);
        $('h1').textContent = article.realestate_article_name;
    } else {
        $('h1').textContent = "DEVELOPMENT";
    }
}


/**
 * Main
 */
void async function main () {
    const auth = await fetchAuth();

    userName = auth.userName;
    userId = auth.userId;
    pkey = parseSearch(decodeURI(location.search)).pkey;

    webrtc = initWebRTC(pkey);

    await setView();
    await fetchMessages().then(({messages}) => messages.forEach(addChat));

    $('#splash').remove();

    webrtc.connection.on('message', recvMessage);
    $('#sendMessage').on('click', sendMessage);
}();

