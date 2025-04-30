// commands/join.js
import voice from '../utils/voice.js';

export default {
  name: 'join',
  description: 'Conecta el bot al canal de voz actual',
  async execute(message) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('⚠️ Debes estar en un canal de voz para usar este comando.');
    }

    const result = voice.joinVoice(voiceChannel);
    await message.reply(result.message);
  }
};