// commands/leave.js
import voice from '../utils/voice.js';
import fs from 'fs';

export default {
  name: 'leave',
  description: 'Desconecta el bot del canal de voz',
  async execute(message) {
    const result = voice.leaveVoice();
    fs.rmSync('./sounds', { recursive: true, force: true });
    await message.reply(result.message);
  }
};