const { cmd, commands } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    react: "🎵",
    desc: "Download TikTok video",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("*❌ Please provide a TikTok video URL!*\nExample: .tiktok <URL>");

        // Basic URL validation
        if (!q.includes("tiktok.com")) {
            return reply("*❌ Invalid TikTok URL!*");
        }

        // Construct the API endpoint URL
        const apiUrl = `https://api.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success || data.status !== 200) {
            return reply("❌ Failed to fetch TikTok video.");
        }

        const result = data.result;
        if (!result || !result.video) {
            return reply("❌ No video found in this TikTok post.");
        }

        // Prepare the caption/description to send along with the video
        let desc = `
╔══✦❘༻ *ANAYAT-MD* ༺❘✦══╗
┇  🎵 *TIKTOK DOWNLOAD* 🎵
┇╭───────────────────
┇│•📹 Type: ${result.type ? result.type.toUpperCase() : 'UNKNOWN'}
┇│•💬 Description: ${result.desc || 'No description'}
┇│•👤 Author: ${result.author?.nickname || 'Unknown'}
┇│•🔗 Link: ${q}
╰─・─・─・─・─・─・─・─╯
┇ *Statistics:*
┇ • Likes: ${result.statistics?.likeCount || '0'}
┇ • Comments: ${result.statistics?.commentCount || '0'}
┇ • Shares: ${result.statistics?.shareCount || '0'}
╰─────────────────────────
> POWERED BY ANAYAT-MD Official`;

        // Send the TikTok video message
        await conn.sendMessage(from, { video: { url: result.video }, caption: desc }, { quoted: mek });
    } catch (e) {
        console.error("Error fetching TikTok video:", e);
        reply("⚠️ Error fetching the TikTok video.");
    }
});
