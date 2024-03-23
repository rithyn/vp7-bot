const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const log = require('../../logs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('senddm')
		.setDescription('Send a DM to a user')
        .addUserOption(option => option.setName('user').setDescription('Member to send a DM').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Content to send.').setRequired(true)),
	async execute(interaction) {
        let target = interaction.options.getUser('user');
        let message = interaction.options.getString('message');
        let guild = interaction.guild;
        let channel = await target.createDM();
        let member = guild.members.cache.get(interaction.user.id);
        if (!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({ content: 'You don\'t have the permissions to use that. Please contact a moderator.', ephemeral: false });
        }
        await channel.send(message);
		await interaction.reply('Le message a bien été envoyé à ' + target.username);
        log(`Command DM used by ${interaction.user.tag}`, "command");
	},
};
