// Modules
const pinger = require('starblast-pinger');
const modding = require('starblast-modding');
/**
 * 
 * @param {String} shorturl The short url
 * @returns Complete Url
 */
let reform_url = async (shorturl) => {
    if (!shorturl.includes('starblast.io/#') || !shorturl.includes('@')) {
        return "Please enter a valid short link. Exemple : \"https://starblast.io/#1234\""
    }

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
// Sesame Modules
/*

    Sesame Database API Dev Log

    📅 Created: Aug. 9, 2023
    🔄 Last Update: Oct. 22, 2024

 */
const __Path__ = "https://raw.githubusercontent.com/W0lfan/sesame/main/database/";

const __LINKS__ = {
    codes: "codes",
    users: "users",
    mods: "mods",
    communities: "communities",
    ships: "ships"
};

const __Version__ = "0.0.1";

/**
 * 
 * @param url Internal Function
 * @returns JSON file
 */
function fetchData(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}
/**
 * 
 * @param {string} directory The type of data you want to search for
 * @param {Array} gathering The keywords you wish to search for in the database
 * @returns {Array} Datas
 * @since 0.0.1
 * @author naflouille
 */
async function FetchDataFromDatabase(directory, gathering) {

    /*
        
                NOTE : gathering is set to 1 for a whole return
    
        
            */

    // Checking if the directory is available
    if (!__LINKS__.hasOwnProperty(directory)) {
        console.error(`Error: "${directory}" key not found in the object.\nAvailable keys: ${Object.keys(__LINKS__).join(", ")}`);
        return;
    }

    let path = __Path__ + directory + ".json";

    try {
        const content = await fetchData(path);


        if (gathering === 1) {
            return content;
        } else {
            gathering = gathering.map(value => value.toLowerCase());
            const gathering_available = content.filter(item =>
                gathering.some(gather =>
                    item.name.toLowerCase().includes(gather) ||
                    (
                        item.description && item.description.toLowerCase().includes(gather.toLowerCase())
                    ) ||
                    (
                        item.author && item.author.some(
                            aut => aut && aut.name.toLowerCase().includes(gather.toLowerCase())
                        )
                    )
                )
            );



            console.log(gathering_available, "EEEE")
            return gathering_available;
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


async function QuerySpecific(query, directory) {
    let path = "https://raw.githubusercontent.com/W0lfan/sesame/main/database/" + directory + ".json";
    try {
        const content = await fetchData(path);
        for (let value of content) {
            if (value.name && value.name == query) {
                return value;
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}



// Exports
module.exports = {
    starblast: {
        reform_url: reform_url,
        sesame: {
            __Path__,
            __LINKS__,
            __Version__,
            fetchData,
            FetchDataFromDatabase,
            QuerySpecific
        }
    }
}