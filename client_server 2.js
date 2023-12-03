let ping = function(serverURL) {
    return new Promise((resolve, reject) => {
    3 const urlFormat = new RegExp('(https?|ftp|file)://[-A-Za-z0-
    9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');
    4 if (!urlFormat.test(serverURL))
    5 reject(`Invalid URL: ${serverURL}`);
    6
    7 const myRequest = new Request(serverURL, {
    8 method: "GET",
    9 mode: "no-cors",
    10 cache: "no-cache",
    11 referrerPolicy: "no-referrer"
    12 });
    13
    14 let sendTime = new Date();
    15 fetch(myRequest)
    16 .then(() => {
    17 let receiveTime = new Date();
    18 resolve( receiveTime.getTime() - sendTime.getTime() );
    19 })
    20 .catch(() => resolve(false));
    21 });
    22 };