var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
///<reference path="./references"/>
let tmp;
importScripts('lib/sugar/dist/sugar-es5.js');
Sugar.extend();
const loader = (() => __awaiter(this, void 0, void 0, function* () {
    // required pre-data here
}))();
self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});
self.registration.update();
self.addEventListener('fetch', (event) => {
    // if request url has not '.' then response from this service.
    const path = event.request.url.match(/\/\/[^\/]*\/([^?]*)/)[1] || '';
    if (path.includes('.'))
        return; // or response from cache.
    if (!path)
        return;
    if (path.startsWith('api/')) {
        return APIRequestHandler(event.request);
    }
    function parseRequestData(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            const fromQueryString = Object.fromQueryString((request.url.match(/\?(.*)$/) || [, ''])[1]);
            data = fromQueryString;
            if (request.method == 'POST') {
                const blob = yield event.request.blob();
                const query = yield (new Promise((res) => {
                    const fileReader = new FileReader();
                    fileReader.addEventListener('loadend', (e) => {
                        const queryString = decodeURI(e.srcElement.result);
                        res(Object.fromQueryString(queryString, { deep: true }));
                    });
                    fileReader.readAsText(blob);
                }));
                data = __assign({}, data, query);
            }
            return data;
        });
    }
    // fetch pre-compiled pug template.
    event.respondWith((() => __awaiter(this, void 0, void 0, function* () {
        yield loader;
        const data = yield parseRequestData(event.request);
        importScripts(`service/template/${path}.js`);
        tmp = data;
        const html = template(__assign({}, data));
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html'
            }
        });
    }))());
});
function APIRequestHandler(request) {
    const path = (request.url.match(/\/\/[^\/]*\/api\/(.*)/)[1] || '').split('/');
    let result;
    switch (path[0]) {
        default:
            result = {};
    }
    return new Response(JSON.stringify(result), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
