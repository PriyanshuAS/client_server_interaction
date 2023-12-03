const fetch = require('node-fetch');

let ping = function(serverURL, delay) {
    return new Promise((resolve, reject) => {
        let text = "I solemnly swear that I am up to no good";
        let delay_time = delay;
        let sendTime;

        setTimeout(() => {
            text = "Mischief Managed";
            sendTime = new Date();
        }, delay_time);

        fetch(serverURL, {
            method: "POST",
            body: text,
            headers: {'Content-Type': 'text/plain'}
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        }).then(receivedText => {
            let receivedTime = new Date();
            let rtt = receivedTime - sendTime;
            let isTextSame = receivedText === text;
            resolve({ rtt, isTextSame });
        }).catch(error => {
            reject(error);
        });
    });
};

let check = function(url, delay){
    return new Promise((resolve, reject) => {
        Promise.all(Array.from({ length: 1 }, () => ping(url, delay)))
        .then(results => {
            console.log("Round-trip times:", results.map(result => result.rtt));
            console.log("IsTextSame for each ping:", results.map(result => result.isTextSame));
            resolve(results);
        })
        .catch(error => {
            console.error(error);
            reject(error);
        });
    });
}



let check_20 = function(url){
    Promise.all(Array.from({ length: 20 }, () => ping(url, 20)))
    .then(times => {
        console.log("Round-trip times:", times);
    })
    .catch(error => {
        console.error(error);
    });
};

let url = "http://localhost:3000";
// check_20(url);
check(url, 10);

module.exports = { check_20, check };