const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

//'TELEGRAM_BOT_TOKEN'
const botToken = 'TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(botToken, { polling: false });

async function getRandomWikiArticle() {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        list: 'random',
        rnnamespace: 0, 
      },
    });

    return response.data.query.random[0].title;
  } catch (error) {
    throw new Error('Failed to fetch random Wikipedia article.');
  }
}

async function getArticleSummary(articleTitle) {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exintro: true,
        titles: articleTitle,
      },
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].extract;
  } catch (error) {
    throw new Error('Failed to fetch article summary from Wikipedia.');
  }
}

async function postRandomWikiToTelegram() {
  try {
    const randomArticleTitle = await getRandomWikiArticle();
    const articleSummary = await getArticleSummary(randomArticleTitle);

    const message = `Random Wikipedia Article:\n\nTitle: ${randomArticleTitle}\n\nSummary: ${articleSummary}`;

    //'TELEGRAM_GROUP_ID'
    const chatId = 'TELEGRAM_GROUP_ID';
    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error(error.message);
  }
}
postRandomWikiToTelegram();
