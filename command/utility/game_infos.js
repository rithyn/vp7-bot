const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pinger = require('starblast-pinger');
const axios = require('axios');
const api = require('../../api/starblast.js');
function reform_url(url) {
    const link = 'https://starblast.io/#3451@51.255.91.80:3008';

    const parts = link.split('@')[1].split(':');
    const ip = parts[0]; 
    const port = parts[1];

    return {
        ip: ip,
        port: port,
        url: function() {
            return `${this.ip}:${this.port}`;
    }
    }    
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('infosystem')
		.setDescription('Get informations about a system/game')
        .addStringOption(option => option.setName('link').setDescription('Put the URL of the game.').setRequired(true)),

	async execute(interaction) {
        

        await interaction.reply("This command is currently under development. Please wait.");
    }
};