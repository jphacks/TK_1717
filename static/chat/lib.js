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

const $ = q => document.querySelector(q);
const $$ = q => Array.from(document.querySelectorAll(q));
EventTarget.prototype.on = EventTarget.prototype.addEventListener;
