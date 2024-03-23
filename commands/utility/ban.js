const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member')
        .addUserOption(option => option.setName('user').setDescription('Member to ban.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(true)),
    async execute (interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('role') || 'No reason provided.';;
        const guild = interaction.guild;
        const member = guild.members.cache.get(user.id);
        const dm = await user.createDM();
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You don\'t have the permissions to use that. Please contact a moderator.', ephemeral: true });
        if (user === interaction.user) return await interaction.reply({ content: 'You can\'t ban yourself.', ephemeral: true });
        if (user === interaction.client.user) return await interaction.reply({ content: 'You can\'t ban me. :/', ephemeral
        : true});
        const embed = new EmbedBuilder()
					.setAuthor({
						name: config.embeds.name,
						iconURL: config.embeds.logo,
					})
					.setTitle("You've been banned.")
					.addFields(
						{
						name: "What's going on?",
						value: "You have been banned by the server staff.\nYou can't join the server anymore.",
						inline: true
						},
						{
						name: "Reason :",
						value: `${reason}`,
						inline: true
						},
						{
						name: "Why ?",
						value: "You have not followed the server rules. A moderator has decided to ban you. If you think this decision is unfair, you can contact the moderation team and explain why. Try to follow the rules next time.",
						inline: false
						},
						{
						name: "Responsable Moderator :",
						value: `<@${interaction.user.id}>`,
						inline: false
						},
					)
					.setThumbnail(config.embeds.logo)
					.setColor("#f50000")
					.setTimestamp();
        try {
            await dm.send({embeds: [embed]});
            await guild.members.ban(user, {reason: reason});
            
            await interaction.reply({content: `<@${user.id}> has been banned.`});
            log(`Command Ban used by ${interaction.user.tag}`, "command");
        } catch(error) {
            await interaction.reply(`A error occured while trying to ban <@${user.id}>\nError: ${error}`);
        }


    }
}