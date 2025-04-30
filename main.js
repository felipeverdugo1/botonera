import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();




// Configuración de rutas para ES Modules en Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Función para importar archivos correctamente en Windows
async function importFile(filePath) {
  const fileUrl = pathToFileURL(filePath).href;
  return await import(fileUrl);
}

// Carga dinámica de comandos
client.commands = new Collection();
const commandsPath = join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const filePath = join(commandsPath, file);
    const command = await importFile(filePath);

    
    client.commands.set(command.default.name, command.default);
  } catch (error) {
    console.error(`Error al cargar el comando ${file}:`, error);
  }
}

client.on('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  try {
    await client.commands.get(commandName).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Hubo un error al ejecutar el comando.');
  }
});


client.login(process.env.DISCORD_TOKEN);