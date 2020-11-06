// 引用line機器人套件
import linebot from 'linebot'
// 引用dotenv機器人套件
import dotenv from 'dotenv'
// 讀取json資料
import json from './aed資料.js'

const distance = (lat1, lon1, lat2, lon2, unit) => {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0
  } else {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
  }
}

// 讀取.env
dotenv.config()

// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  try {
    let reply = []
    const lat = event.message.latitude
    const lng = event.message.longitude
    for (const data of json) {
      const dis = distance(data.地點LAT, data.地點LNG, lat, lng, 'K')
      if (dis <= 0.5) {
        reply.push(
          {
            type: 'location',
            title: `${data.場所名稱}`,
            address: ` ${data.場所地址} `,
            latitude: data.地點LAT,
            longitude: data.地點LNG
          },
          {
            type: 'text',
            text: '連絡電話' + `${data.開放時間緊急連絡電話}`,
            weight: 'bold',
            size: 'xl'
          }
        )
      }
    }

    reply = (reply.length === 0) ? '輸入有誤，請重新傳送位置資訊' : reply
    console.log(reply)
    event.reply(reply)
  } catch (error) {
    event.reply('發現錯誤')
    console.log(error)
  }
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
