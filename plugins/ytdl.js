const { cmd } = require('../command')
const yts = require('yt-search')

cmd({
    pattern: "music",
    alias: ["mp3"],
    react: "🎵",
    desc: "Search and download MP3 songs",
    category: "download",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, body, isCmd, command, args, q,
    isGroup, sender, senderNumber, botNumber2, botNumber,
    pushname, isMe, isOwner, groupMetadata, groupName,
    participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
try {

    if (!q) return reply("*❌ Please provide a song name or YouTube link*");

    const search = await yts(q);
    const song = search.videos[0];
    if (!song) return reply("❌ No song found. Try with a different keyword.");

    const url = song.url;

    let caption = `
🎶 *MP3 DOWNLOAD*

📌 *Title:* ${song.title}
📆 *Published:* ${song.ago}
⏱️ *Duration:* ${song.timestamp}
👁️ *Views:* ${song.views.toLocaleString()}
🌐 *URL:* ${url}

🌀 Powered by ANAYAT-MD
    `;

    await conn.sendMessage(from, {
        image: { url: song.thumbnail },
        caption: caption
    }, { quoted: mek });

    // Audio download via external API
    const res = await fetch(`https://apis.davidcyriltech.my.id/download/ytmp3?url=${url}`);
    const data = await res.json();
    if (!data.success || !data.result.downloadUrl) return reply("❌ Failed to fetch MP3. Please try again.");

    const downloadUrl = data.result.downloadUrl;

    // Send as audio and document
    await conn.sendMessage(from, {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        caption: "🎧 Enjoy your music!"
    }, { quoted: mek });

    await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: song.title + ".mp3",
        caption: "📥 Download complete"
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ Error: ${e.message}`);
}
});
