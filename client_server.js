let ping = function(serverURL){
    return new Promise((resolve, reject) => {
        const urlFormat = new RegExp(`(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%?=~_|]`);
        if(!urlFormat.test(serverURL)){
            reject(`Invalid URL: ${serverURL}`);
        }
        const myRequest = new Request(serverURL, {
            method: "GET",
            mode: "no-cors",
            cache: "no-cache",
            referrerPolicy: "no-referrer"
        });
        let sendTime = new Date();
        fetch(myRequest).then(() => {
            let receiveTime = new Date();
            resolve(receiveTime.getTime() -  sendTime.getTime());
        }).catch(() => resolve(false));
    });
};

ping("https://www.rutgers.edu/").then(rtt => {
    console.log(`Round-trip time: ${rtt} ms`);
}).catch(error => {
    console.error(error);
});
