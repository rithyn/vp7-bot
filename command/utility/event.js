/* Notes:
*   C'est la principale commande de Bloody, donc je vais essayer de faire tout au top.
*   Je vais faire ça proprement donc tout ce qui est là sera commenté, pour une meilleure compréhention pour tout le monde.
*   - Note: Pour l'execution, se référer au ficher index.js :D
*   - Note: Pour l'execution, se référer au ficher index.js :D
*   - Note: Pour l'execution, se référer au ficher index.js :D
*   - Note: Pour l'execution, se référer au ficher index.js :D
*   - Note: Pour l'execution, se référer au ficher index.js :D
*/


// Let Node modules who need to access it load it

const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } = require('discord.js');
const config = require('../../config.json');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Start an event now!')
        .addStringOption(
            option =>
            option.setName('name')
            .setDescription('Name of the event')
            .setRequired(true)
        )
        .addStringOption(
            option =>
            option.setName('description')
            .setDescription('Description of the event')
            .setRequired(true)
        )
        .addStringOption( option =>
            option.setName('type')
            .setDescription('Type of event')
            .setRequired(true)
            .addChoices(
                {name: 'Team Mode', value: 'team'},
                {name: 'Survival Mode', value:'survival'},
                {name: 'Invasion', value: 'invasion'},
                {name: 'Pro Deathmatch', value: 'pdm'},
            )
        )
        .addStringOption(option =>
            option.setName('link')
            .setDescription('Put the URL of the game.')
            .setRequired(true)

            )
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('The role who will be pinged when the event starts.')
            .setRequired(true)
            ),
    async execute(interaction) {
        const name = interaction.options.getString('name')
        const type = interaction.options.getString('type');
        const link = interaction.options.getString('link');
        const role = interaction.options.getRole('role');
        const description = interaction.options.getString('description');
        const guild = interaction.guild;
        const eventChannel = guild.channels.cache.find(channel => channel.id === "1200780916075806768");
        const eventRole = guild.roles.cache.find(role => role.id === this.eventRoleID);
        const GamelinkChannel = guild.channels.cache.find(channel => channel.id === "1200780916566528024");
        const voiceChannel = guild.channels.cache.find(channel => channel.id === "1200780916981768334")
        if (!guild.members.cache.get(interaction.user.id).permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return await interaction.reply({ content: 'You don\'t have the permissions to use that. Please contact a moderator.', ephemeral: false });
        }
        if (eventChannel === null) {
            return await interaction.reply({ content: 'The event channel doesn\'t exist.', ephemeral: false });
        }
        if (eventRole === null) {
            return await interaction.reply({ content: 'The event role doesn\'t exist.', ephemeral: false });
        }
        if (type !== 'team' && type !=='survival' && type !== 'invasion' && type !== 'pdm') {
            return await interaction.reply({ content: 'The type of event is not valid.', ephemeral: false });
        }
        if (!link.includes('starblast.io/#')) {
            return await interaction.reply({ content:'The link is not valid.', ephemeral:false });

        }
        let DescrType
        if (type === 'team') {
            DescrType = 'Team Mode'
        }
        if (type ==='survival') {
            DescrType = 'Survival Mode'
        }
        if (type === 'invasion') {
            DescrType = 'Invasion'
        }
        if (type === 'pdm') {
            DescrType = 'Pro Deathmatch'
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: config.embeds.name,
                iconURL: config.embeds.logo,
            })
            .setTitle("Event started!")
            .addFields(
                {
                name: "Name :",
                value: name,
                inline: true
                },
                {
                name: "Type",
                value: DescrType,
                inline: true
                },
                {
                name: "Mention:",
                value: `<@&${role.id}>`,
                inline: true
                },
                {
                name: "Description",
                value: description,
                inline: true
                },
                {
                name: "Link",
                value: `${link}`,
                inline: true
                },
            )
            .setThumbnail(config.embeds.logo)
            .setColor("#f50000")
            .setTimestamp();


        try {
            await interaction.reply('Event started!');
            await eventChannel.send({ embeds: [embed] });
            await GamelinkChannel.send(`<@&${role.id}>\n${link}`)        
            
    



        } catch (trash) {
            try {
                console.error(trash)
                return await interaction.reply(`An error has occured. Please contact a moderator.\n Error: \`${trash}\``);
                
            } catch {
                console.error(trash)
                return await interaction.followUp(`An error has occured. Please contact a moderator.\n Error: \`${trash}\``);
                
            }
            
        }
        


    }
}
