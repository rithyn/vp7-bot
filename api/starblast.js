// Modules
const pinger = require('starblast-pinger');

let reform_url = async (shorturl) => {
    if (!shorturl.includes('starblast.io/#') || !shorturl.includes('@')) { return "Please enter a valid short link. Exemple : \"https://starblast.io/#1234\""}
    
    let reponse = await pinger.getWebSocketAddress(shorturl);
    let returnContent = {
        url: `${shorturl}@${reponse.server.ip}:${reponse.server.port}`,
        ip: reponse.server.ip,
        port: reponse.server.port
    }
    return returnContent;
  }
let getIp = async (url) => {
    if (url.includes('@')) {
    let ip = url.split('@')[1].split(':')[0];
    }
    let reponse = await pinger.getWebSocketAddress(url);
    let returnContent = {
        ip: reponse.server.ip,
        port: reponse.server.port
    }
    return returnContent;
}
module.exports = {
    starblast: {
        reform_url: reform_url,
    }
}