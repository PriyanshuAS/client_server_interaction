let ping = function(serverURL){
    return new Promise((resolve, reject) => {
        const urlFormat = new RegExp(`(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%?=~_|]`);
        if(!urlFormat.test(serverURL)){
            reject(`Invalid URL: ${serverURL}`);
        }

        let timeoutTrigger = setTimeout(() => {
            reject('Request timed out');
        }, 4000);

        const myRequest = new Request(serverURL, {
            method: "GET",
            mode: "no-cors",
            cache: "no-cache",
            referrerPolicy: "no-referrer"
        });
        let sendTime = new Date();
        fetch(myRequest).then(() => {
            clearTimeout(timeoutTrigger);
            let receiveTime = new Date();
            resolve(receiveTime.getTime() -  sendTime.getTime());
        }).catch(() => resolve(false));
    });
};


let call_once = function(url){
    ping(url).then(rtt => {
        console.log(`Round-trip time: ${rtt} ms`);
    }).catch(error => {
        console.error(error);
    });
};

let call_mul = function(count, url){
    Promise.all(Array.from({ length: 10 }, () => ping(url)))
    .then(times => {
        console.log("Average Round-trip time:", times.reduce((a, b) => a + b) / times.length);
    })
    .catch(error => {
        console.error(error);
    });
};


let url = "http://localhost:3000";
call_once(url);

// Uncomment the below code to run this 10 times on localhost to find the average RTT time: 

// let count = 10;
// call_mul(count, url)

module.exports = { ping, call_once, call_mul };



