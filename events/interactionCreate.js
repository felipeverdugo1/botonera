import { getConnection } from '../utils/voice';
import { createAudioPlayer } from '@discordjs/voice';

export const name = 'interactionCreate';
export async function execute(interaction) {
    if (!interaction.isButton()) return;

    const soundName = interaction.customId.split('_')[1];
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply({ content: '⚠️ Únete a un canal de voz primero!', ephemeral: true });
    }

    await interaction.deferUpdate();

    try {
        let connection = getConnection();
        if (connection) {
        

        	const player = createAudioPlayer();
        	connection.subscribe(player);

        	// Lógica de reproducción...
        	interaction.followUp({ content: `🔊 Sonido: ${soundName}`, ephemeral: true });
    		} 
    	}
    catch (error) {
        console.error(error);
        interaction.followUp({ content: '❌ Error al reproducir.', ephemeral: true });
    }
}