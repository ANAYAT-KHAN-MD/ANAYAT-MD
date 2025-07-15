const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "apk",
    alias: ["app"],
    react: "📲",
    desc: "📥 Download APK",
    category: "📁 Download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, q, reply }) => {
    try {
        if (!q) {
            return reply("❌ *Please provide the app name to search APK!*");
        }

        const apiUrl = `https://api.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error("API response not OK");
        }

        const data = await response.json();

        if (!data.success || !data.download_link) {
            return reply("❌ *Failed to fetch APK. Try with another app name.*");
        }

        const apkName = data.apk_name || "Unknown App";
        const thumbnail = data.thumbnail || "https://via.placeholder.com/300";
        const downloadLink = data.download_link;

        const description = `
╭═══〘 *📲 ANAYAT-MD APK* 〙═══⊷❍
┃ 📂 *App Name:*  *『 ${apkName} 』*
┃ 📥 *Download started...*
╰────────────────────────────╯

*🔰 Powered by ANAYAT-MD Official* ⚡
`;

        // Send thumbnail and info
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: description
        }, { quoted: mek });

        // Send APK file
        await conn.sendMessage(from, {
            document: { url: downloadLink },
            mimetype: "application/vnd.android.package-archive",
            fileName: `『 ${apkName} 』.apk`,
            caption: "✅ *APK Uploaded Successfully!*\n🔰 *Powered by ANAYAT-MD* ⚡"
        }, { quoted: mek });

    } catch (error) {
        console.error("APK Download Error:", error);
        reply("❌ *An error occurred while fetching the APK. Please try again later.*");
    }
});
