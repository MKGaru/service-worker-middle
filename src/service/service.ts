///<reference path="./references"/>

declare const Response;
declare const template;

let tmp;

importScripts('lib/sugar/dist/sugar-es5.js');
Sugar.extend();

const loader = (async ()=>{
    // required pre-data here
})();

self.addEventListener('install', function(event:InstallEvent) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event:ExtendableEvent) {
    event.waitUntil(self.clients.claim());
});
self.registration.update();

self.addEventListener('fetch', (event:FetchEvent)=>{
    // if request url has not '.' then response from this service.
    const path = event.request.url.match(/\/\/[^\/]*\/([^?]*)/)[1]||'';
    if(path.includes('.')) return; // or response from cache.
    if(!path) return;
    if(path.startsWith('api/')){
        return APIRequestHandler(event.request);
    }
    async function parseRequestData(request:Request){
        let data;
        const fromQueryString = Object.fromQueryString( (request.url.match(/\?(.*)$/)||[,''])[1] );
        data = fromQueryString;
        if(request.method=='POST'){
            const blob = await event.request.blob();
            const query = await (new Promise((res)=>{
                const fileReader = new FileReader();
                fileReader.addEventListener('loadend',(e:any)=>{
                    const queryString = decodeURI( e.srcElement.result);
                    res(Object.fromQueryString(queryString,{deep:true}));
                });
                fileReader.readAsText(blob);
            }));
            data = {...data,...query}
        }
        return data;
    }
    // fetch pre-compiled pug template.
    event.respondWith((async ()=>{
        await loader;
        const data = await parseRequestData(event.request);
        importScripts(`service/template/${path}.js`);
        tmp = data;
        const html = template({
            // template parameter here
            ...data
        });
        return new Response(html,{
            headers:{
                'Content-Type':'text/html'
            }
        });
    })());
});

function APIRequestHandler(request:Request):Response{
    const path = (request.url.match(/\/\/[^\/]*\/api\/(.*)/)[1]||'').split('/');
    let result;
    switch (path[0]){
        default:
            result = {}
    }
    return new Response(JSON.stringify(result),{
        headers:{
            'Content-Type':'application/json'
        }
    });
}

