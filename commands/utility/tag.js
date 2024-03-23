const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Show the official tag!'),
    async execute (interaction) {
        await interaction.reply(`The official tag is ${config.embeds.tag}`);
        log(`Command Tag used by ${interaction.user.tag}`, "command");
    }
}