let webrtc, pkey, userName, userId;
let members = {};

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
const fetchMyLogs = () => fetch(`/messages`, makeOptions()).then(it=>it.json());

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
    members[message.userId] = message.userName;
    addChat(message);
}

const sendMessage = body => {
    const createdAt = (1*new Date()).toString();
    const message = { pkey, userName, userId, createdAt, body };
    $('#message').value = "";
    addChat(message);
    webrtc.sendToAll('chat', message);
    postMessage(message);
    $('#star').classList.add('on');
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
        const article = await jQuery.get(`https://jphacks.tk/homes/api/realestate_article/${pkey}`);
        $('#pname').textContent = article.realestate_article_name;
    } else {
        $('#pname').textContent = "DEVELOPMENT";
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
    const data = await fetchMessages();
    data.messages.forEach(addChat);
    if (data.messages.find(message => message.userId === userId)) {
        $('#star').classList.add('on');
    }

    data.messages.forEach(({userId,userName}) => members[userId] = userName);

    $('#star').on('click', function () {
        if ($('#star:not(.on)')) sendMessage('興味あり！');
    });

    // $('#splash').remove();

    webrtc.connection.on('message', recvMessage);
    $('#sendMessage').on('click', () => sendMessage($('#message').value));

    const $members = $('#members');
    const $membersList = $('#members-list');
    $('#member').on('click', () => {
        if ($members.style.display === "none") {
            $members.style.display = "block";
            $mypageView.style.display = "none";
            while ($membersList.firstChild) $membersList.removeChild($membersList.firstChild);
            Object.keys(members).map(_userId => {
                const userName = members[_userId];
                const div = document.createElement('div');
                const label = document.createElement('label');
                const span = document.createElement('span');
                const input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                input.value = _userId;
                input.classList.add('member');
                span.textContent = userName;

                if (userId === _userId) {
                    input.disabled = true;
                    input.checked = true;
                }

                label.appendChild(input);
                label.appendChild(span);
                div.appendChild(label);

                $membersList.appendChild(div);
            });
        } else {
            $members.style.display = "none";
        }
    });

    $('#make-private').on('click', () => {
        const group = $$('.member').filter(e => e.checked).map(e => e.value);
        console.log(group);
    });

    const $mypageView = $('#mypage-view');
    $('#mypage').on('click', () => {
        if ($mypageView.style.display === "none") {
            $mypageView.style.display = "block";
            $members.style.display = "none";
        } else {
            $mypageView.style.display = "none";
        }
    });

    const myLogs = await fetchMyLogs();
    const getArticle = ({pkey}) => jQuery.get(`https://jphacks.tk/homes/api/realestate_article/${pkey}`);
    const articles = await Promise.all(myLogs.pkeys.map(getArticle));
    articles.forEach(article => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = article.realestate_article_name;
        a.href = `/chat/?pkey=${article.pkey}`;
        li.appendChild(a);
        $('#interests').appendChild(li);
    });
}();

