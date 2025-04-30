// commands/stay.js
import voice from '../utils/voice.js';

function formatTime(ms) {
  if (ms <= 0) return '0 minutos';
  
  const minutes = Math.floor(ms / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  
  let result = '';
  if (minutes > 0) result += `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  if (seconds > 0) {
    if (minutes > 0) result += ' y ';
    result += `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
  }
  return result || '0 segundos';
}

export default {
  name: 'stay',
  description: 'Mantiene al bot en el canal por X minutos (default: 20). Sin parámetros muestra tiempo restante',
  usage: '[minutos]',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('⚠️ Debes estar en un canal de voz para usar este comando.');
    }

    // Comando sin parámetros: mostrar tiempo restante
    if (args.length === 0) {
      const remaining = voice.getRemainingTime();
      
      if (!voice.getConnection()) {
        return message.reply('ℹ️ No estoy conectado a ningún canal de voz.');
      }
      
      if (remaining === null) {
        return message.reply('ℹ️ Estoy conectado sin tiempo límite.');
      }
      
      if (remaining <= 0) {
        return message.reply('⚠️ El tiempo de conexión ha expirado, me desconectaré pronto.');
      }
      
      return message.reply(`⏳ Tiempo restante: ${formatTime(remaining)}`);
    }

    // Comando con parámetros: establecer tiempo
    if (!voice.getConnection()) {
      const joinResult = voice.joinVoice(voiceChannel);
      if (!joinResult.success) {
        return message.reply(joinResult.message);
      }
    }

    const minutes = parseInt(args[0]) || 20;
    voice.setStayTimeout(minutes);

    await message.reply(
      minutes > 0 
        ? `⏳ Permaneceré conectado por ${minutes} minuto${minutes !== 1 ? 's' : ''}.`
        : '🔓 Estaré conectado indefinidamente (usa !leave para desconectarme).'
    );
  }
};