import createApp from 'ringcentral-chatbot/dist/apps'
import { Bot } from 'ringcentral-chatbot/dist/models'
import skill from 'ringcentral-chatbot-skill-voicemail-helper'

async function welcomeMsg (bot, group) {
  await bot.sendMessage(
    group.id,
    {
      text: `
I am a Glip chatbot, I can monitor and transcript your voicemail, and do some analysis. If you want me to monitor your voicemail, please reply "![:Person](${bot.id}) monitor"
`
    }
  )
}

const handle = async event => {
  const { type, text } = event
  if (
    event.type === 'Message4Bot' &&
    (
      text.toLowerCase() === 'help' ||
      text.toLowerCase() === 'about'
    )
  ) {
    const { bot, group } = event
    await welcomeMsg(bot, group)
  } else if (type === 'GroupJoined') {
    const botId = event.message.ownerId
    const bot = await Bot.findByPk(botId)
    const groupId = event.message.body.id
    await welcomeMsg(bot, { id: groupId })
  }
}

const app = createApp(handle, [ skill ])
app.get('/test', (req, res) => res.send('server running'))

export default app
