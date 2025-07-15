const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');

cmd({
    pattern: "music",
    alias: ["mp3"],
    react: "🎵",
    desc: "Search and download MP3 songs",
    category: "📁 Download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, reply
}) => {
    try {
        if (!q) return reply("❌ *Please provide a song name or YouTube link.*");

        const search = await yts(q);
        const song = search.videos[0];

        if (!song) return reply("❌ *No song found. Try another title.*");

        const url = song.url;
        const title = song.title || "Unknown Title";
        const thumbnail = song.thumbnail || "https://via.placeholder.com/300";

        const caption = `
🎶 *MP3 Download*

🎵 *Title:* ${title}
⏱️ *Duration:* ${song.timestamp}
📆 *Published:* ${song.ago}
👁️ *Views:* ${song.views.toLocaleString()}
🔗 *Link:* ${url}

🎧 *Powered by ANAYAT-MD* ⚡
        `;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: mek });

        // External MP3 downloader API
        const api = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(url)}`;
        const res = await fetch(api);

        if (!res.ok) throw new Error("API did not respond properly.");

        const data = await res.json();

        if (!data.success || !data.result?.downloadUrl) {
            return reply("❌ *Failed to fetch MP3. Please try again later.*");
        }

        const downloadUrl = data.result.downloadUrl;

        // Send as voice note (audio message)
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            ptt: true
        }, { quoted: mek });

        // Send as downloadable MP3
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: "✅ *Download complete!*"
        }, { quoted: mek });

    } catch (err) {
        console.error("MP3 Error:", err);
        reply("❌ *An error occurred while processing your request. Try again later.*");
    }
});
