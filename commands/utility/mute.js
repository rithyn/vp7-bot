const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../config.json');
const log = require('../../logs.js')

/**
 * 
 * @param {Number} minutes - The number of minutes to convert to seconds.
 * @returns {number} - The result in milliseconds.
 */
function minutesEnSecondes(minutes) {
	if (minutes == 0) {
		minutes = 1;
	}
    var secondes = minutes * 60 * 1000;
    return secondes;
}
// Scripts of the command builder
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Timeout a member')
		.addUserOption(option => option.setName('user').setDescription('User to mute').setRequired(true))
		.addIntegerOption(option => option.setName('time').setDescription('Time to mute in minutes').setRequired(true)),
		async execute(interaction) {
			const user = interaction.options.getUser('user');
			const time = interaction.options.getInteger('time');
			const guild = interaction.guild;
			const member = guild.members.cache.get(user.id);
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You don\'t have the permissions to use that. Please contact a moderator.', ephemeral: true });
			const timedisplay = interaction.options.getInteger('time');
			const time_in_seconds = minutesEnSecondes(timedisplay);
			if (user === interaction.user) return await interaction.reply({ content: 'You can\'t timeout yourself.', ephemeral: true });
			if (user === interaction.client.user) return await interaction.reply({ content: 'You can\'t timeout me. :/', ephemeral: true});
			if (user === interaction.guild.owner) return await interaction.reply({ content: 'You can\'t timeout the server owner.', ephemeral: true});
			const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Danger);
			const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);
			const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);
			const reponse = await interaction.reply({
				content: `Are you sure you want to timeout <@${user.id}> for ${time} minutes?`,
				components: [row],
				ephemeral: false
			});
			const filtrer = i => i.user.id === interaction.user.id;
			try {
				const confirmation = await reponse.awaitMessageComponent({ filter: filtrer, time: 60_000 });
				switch (confirmation.customId) {
					case 'confirm':
						await member.timeout(time_in_seconds, 'Timed out by '+ interaction.user.username);
						const embed = new EmbedBuilder()
							.setAuthor({
								name: config.embeds.name,
								iconURL: config.embeds.logo,
							})
							.setTitle("You've been timeout.")
							.addFields(
								{
								name: "What's going on?",
								value: "You have been timeout by the server staff.\nYou can no longer talk, react or join voice channels.",
								inline: true
								},
								{
								name: "Time of your timeout :",
								value: `${time} minutes`,
								inline: true
								},
								{
								name: "Why ?",
								value: "You have not followed the server rules. A moderator has decided to mute you for a certain period of time. If you think this decision is unfair, you can contact the moderation team and explain why. Try to follow the rules next time.",
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
						let dmtarget = await user.createDM();
						await dmtarget.send({ embeds: [embed] });
						await interaction.editReply({ content: `<@${user.id}> has been timed out for ${time} minutes.`, ephemeral: false, components: [] });
						log(`Command Mute used by ${interaction.user.tag}`, "command");
						break;
					case 'cancel':
						await interaction.editReply({ content: 'Canceled.', ephemeral: false, components: [] });
						break;
				
				}

				
			} catch (error) {
				await interaction.followUp({ content: `An error occured. Please contact a moderator or Rithy \nError : \`${error}\``, ephemeral: false });
				console.error(error);
			}
			
		}

		}