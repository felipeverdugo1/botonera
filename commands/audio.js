import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAudioResource, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import voice from '../utils/voice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOUNDS_DIR = path.join(__dirname, '../sounds');



async function getMP3FromPage(pageUrl) {
  const baseURL = 'https://www.myinstants.com';
  const res = await axios.get(pageUrl);
  const $ = cheerio.load(res.data);
  const button = $('#instant-page-button-element');

  const relativeMp3 = button.attr('data-url');
  if (!relativeMp3) throw new Error('No se encontró ningún mp3 en la página.');

  return `${baseURL}${relativeMp3}`;
}

async function downloadMP3(url, filename = 'sound.mp3') {
  const res = await axios.get(url, { responseType: 'stream' });
  const fullPath = path.join(SOUNDS_DIR, filename);
  await fs.mkdir(SOUNDS_DIR, { recursive: true });
  const writer = await fs.open(fullPath, 'w');
  await new Promise((resolve, reject) => {
    const stream = res.data.pipe(writer.createWriteStream());
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
  await writer.close();
  return fullPath;
}

async function playSound(filepath) {
  const player = createAudioPlayer();
  const resource = createAudioResource(filepath);
  const connection = voice.getConnection();
  connection.subscribe(player);
  player.play(resource);

  player.on(AudioPlayerStatus.Idle, () => {
    // Auto cleanup opcional
    // fs.rm(SOUNDS_DIR, { recursive: true, force: true });
  });
}

export default {
  name: 'audio',
  async execute(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('📢 ¡Debés estar en un canal de voz!');
    }

    const { success, message: joinMsg } = voice.joinVoice(voiceChannel);
    if (!success) return message.reply(joinMsg);

    message.reply('🎧 Buscando sonido...');
    const pageUrl = 'https://www.myinstants.com/es/instant/discord-notification-38119/';
    const mp3Url = await getMP3FromPage(pageUrl);
    const mp3Path = await downloadMP3(mp3Url);

    await playSound(mp3Path);
    message.channel.send('✅ Sonido reproducido.');
  }
};
