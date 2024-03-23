const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a idea for the server.'),
        async execute(interaction) {
            const modal = new Discord.ModalBuilder()
            .setCustomId('suggest')
            .setTitle('| Suggestion');

            const input = new Discord.TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel('What is your suggestion?')
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setPlaceholder('Please enter your suggestion here.')

            const ActionRow = new Discord.ActionRowBuilder().addComponents(input);
            modal.addComponents(ActionRow);

            await interaction.showModal(modal);
            const modalInteraction = await interaction.fetchModal(modal.customId);
            const suggestion = modalInteraction.fields.getTextInputValue('suggestion');
            const embed = new Discord.MessageEmbed()
            .setTitle('Suggestion')
            .setDescription(suggestion)
            .setFooter({ text: 'Suggestion by'+ interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor("#00b0f4")
            .setTimestamp();
            const channel = interaction.guild.channels.cache.get(channel => channel.id == "");
            await interaction.reply({ content: 'Your suggestion has been sent to the moderators.', ephemeral: true });
        
        }
}