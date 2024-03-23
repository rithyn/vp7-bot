const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embed = new EmbedBuilder()
  .setAuthor({
    name: "Info",
    url: "https://example.com",
    iconURL: "https://cdn.discordapp.com/avatars/1200756278390177832/ac76e4473165a82a929e156a1e84ab51.webp?size=4096",
  })
  .setTitle("𝐅𝐑's Bot - A propos.")
  .setDescription("__**𝐅𝐑 Team™️ ©️ 2018-2024 Megalodon - All rights reserved.**__")
  .addFields(
    {
      name: "__Developpement :__",
      value: "__Développeur Principal__ : **[Rithy](https://discord.com/users/882990629838278746)**",
      inline: true
    },
    {
      name: "Contributeurs",
      value: "**[Megalodon](https://discord.com/users/374916657639981056)**\n**[Alex](https://discord.com/users/726335475110903818)**\n**[𝒩𝑒́𝒷𝓊𝓁𝑒𝓊𝓈𝑒](https://discord.com/users/789188685861224520)**",
      inline: true
    },
  )
  .setThumbnail("https://cdn.discordapp.com/avatars/1200756278390177832/ac76e4473165a82a929e156a1e84ab51.webp?size=4096")
  .setColor("#00b0f4")
  .setTimestamp();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('A propos de 𝐅𝐑\'s bot'),
	async execute(interaction) {
		await interaction.reply({embeds: [embed] });
	},
};
