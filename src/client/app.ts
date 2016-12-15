///<reference path="references"/>

navigator.serviceWorker
    .register('service.js')
    .catch((err)=>{
       console.error(err);
    });