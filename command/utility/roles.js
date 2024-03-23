const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const guild = require('../../config.json').guildId;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrole')
		.setDescription('Ajoute un rôle à un membre')
        .addUserOption(option => option.setName('user').setDescription('Membre à ajouter le rôle').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Rôle à ajouter').setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
		let author = interaction.guild.members.cache.get(user.id);
		interaction.guild.members.cache.get(user.id).roles.add(role.id)	;
		i
		await interaction.reply(`The role has been added to ${user.username} `);
		log(`Command Roles used by ${interaction.user.tag}`, "command");
	},
};