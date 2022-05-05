const Discord = require('discord.js');
const fs = require('fs');
const rss = require('rss-converter');
const ayarlar = require('./ayarlar.json');
const client = new Discord.Client();

client.on("ready", async () => {
    console.log("Ewing youtube sistemi aktif oldu.");
    setInterval(async () => {
    let feed = await rss.toJson('https://www.youtube.com/feeds/videos.xml?channel_id=' + ayarlar.channel_yt);
    let jsonOpen = fs.readFileSync('./link-data.json');
    let json = JSON.parse(jsonOpen);
    if (jsonOpen.includes(feed.items[0].yt_videoId)) return;
    json.push(feed.items[0].yt_videoId);
    let jsonLink = JSON.stringify(json);
    fs.writeFileSync('./link-data.json', jsonLink);
    const embed = new Discord.MessageEmbed()
    .setColor("#ff4fa7")
    .setAuthor("Yeni video var!", "https://upload.wikimedia.org/wikipedia/commons/9/9f/Youtube%28amin%29.png")
    .addField("**Başlık**", feed.items[0].media_group.media_title)
    .addField("**Beğeni Sayısı**", feed.items[0].media_group.media_community.media_starRating_count, true)
    .addField("**Beğeni Ortalaması**", feed.items[0].media_group.media_community.media_starRating_average, true)
    .addField("**Görüntüleme**", feed.items[0].media_group.media_community.media_statistics_views, true)
    .setImage(feed.items[0].media_group.media_thumbnail_url)
    .setFooter("Developed By Ewing")
    client.channels.cache.get(ayarlar.channel_id).send(`Merhaba! **${feed.author.name}** yeni video yükledi Like Atmayı Yorum Yapmayı Unutma!\n\nİzle: https://www.youtube.com/watch?v=${feed.items[0].yt_videoId}`, embed)
    }, 60000);
})
client.login(ayarlar.token);