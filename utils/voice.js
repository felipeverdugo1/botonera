// utils/voice.js
import { joinVoiceChannel } from '@discordjs/voice';

// utils/voice.js
let connection = null;
let stayTimeout = null;
let currentChannelId = null;
let stayEndTime = null;  // Nuevo: Guardaremos el momento en que termina el stay
export default {
  getConnection: () => connection,
  getCurrentChannel: () => currentChannelId,
  getRemainingTime: () => stayEndTime ? stayEndTime - Date.now() : null,
  
  joinVoice: (voiceChannel) => {
    if (connection && currentChannelId === voiceChannel.id) {
      return { success: true, message: '⚠️ Ya estoy conectado a este canal.' };
    }

    try {
      if (connection) {
        connection.destroy();
        clearTimeout(stayTimeout);
      }

      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      currentChannelId = voiceChannel.id;
      stayEndTime = null; // Resetear el tiempo al unirse
      return { success: true, message: '🔊 Conectado al canal de voz.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: '❌ Error al conectar al canal de voz.' };
    }
  },

  setStayTimeout: (minutes) => {
    clearTimeout(stayTimeout);
    if (minutes > 0) {
      stayEndTime = Date.now() + minutes * 60 * 1000; // Guardar tiempo de finalización
      stayTimeout = setTimeout(() => {
        this.leaveVoice();
      }, minutes * 60 * 1000);
      return minutes * 60 * 1000; // Devolver el tiempo establecido en ms
    }
    stayEndTime = null;
    return 0; // Tiempo indefinido
  },

  leaveVoice: () => {
    if (!connection) {
      return { success: false, message: '⚠️ No estoy conectado a ningún canal.' };
    }

    try {
      connection.destroy();
      connection = null;
      currentChannelId = null;
      clearTimeout(stayTimeout);
      stayEndTime = null;
      return { success: true, message: '🔌 Desconectado del canal de voz.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: '❌ Error al desconectar del canal.' };
    }
  }
};