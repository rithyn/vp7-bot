let api = require('./api/starblast.js');
let axios = require('axios');
let f    =      async () => {
                const link = "https://starblast.io/#7794@51.255.91.80:3008";
                if (!link.includes('starblast.io/#')) {
                    return await interaction.reply('Please enter a valid link.');
                    
                }

                let completeUrl;
                if (link.includes('@') == false) {
                    completeUrl = await api.starblast.reform_url(link);
                } else {
                    completeUrl = link;
                }
                if (completeUrl == "Please enter a valid link.") {
                    return await interaction.reply('Please enter a valid link.');
                }
                console.log(completeUrl);
                // Extraction du numéro de partie
                const gameId = completeUrl.split('#')[1].split('@')[0]; 

                // Extraction de l'adresse du serveur
                const serverAddress = completeUrl.split('@')[1];




                let apiUrl = `https://starblast.dankdmitron.dev/api/status/${gameId}@${serverAddress}`;
                console.log(apiUrl);
                let apiReponse = await axios.get(apiUrl);
                let reponse = apiReponse.data;
                
                const searchTerms = ['RoW', 'NUB'];

                let count = 0;
                let players = reponse.players;
                for (const player of players) {
                if (searchTerms.some(term => player.player_name.includes(term))) {
                    count++;
                }
                }

                console.log(count); // 3





            }
f();