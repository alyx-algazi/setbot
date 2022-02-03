const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');
const images = require('images');
const fs = require('fs');

const baseDeck = [1111,1112,1113,1121,1122,1123,1131,1132,1133,1211,1212,1213,1221,1222,1223,1231,1232,1233,1311,1312,1313,1321,1322,1323,1331,1332,1333,2111,2112,2113,2121,2122,2123,2131,2132,2133,2211,2212,2213,2221,2222,2223,2231,2232,2233,2311,2312,2313,2321,2322,2323,2331,2332,2333,3111,3112,3113,3121,3122,3123,3131,3132,3133,3211,3212,3213,3221,3222,3223,3231,3232,3233,3311,3312,3313,3321,3322,3323,3331,3332,3333];

function getRand(d) {
  let rand = Math.floor(Math.random()*d.length);
  let card = d[rand];
  d.splice(rand,1);
  return card;
}

function genBoard(b, d) {
  for (let i = 0; i < 4; i++) {
    b.push(getRand(d));
    b.push(getRand(d));
    b.push(getRand(d));
    images(910,225)
    .draw(images(`images/${b[i*3]}.jpeg`),0,0)
    .draw(images(`images/${b[i*3+1]}.jpeg`),305,0)
    .draw(images(`images/${b[i*3+2]}.jpeg`),610,0)
    .save(`temp/row${i+1}.jpeg`);
  }
  return b;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newgame')
    .setDescription('Starts a new game of SET'),
  async execute(interaction) {
    if (!fs.existsSync('./temp/gameData.json')) {
      let curDeck = baseDeck;
      let board = genBoard([], curDeck);
  
      const gameData = {
        "curDeck": curDeck,
        "board": board,
        "activeGame": true
      }
      const str = JSON.stringify(gameData);
      fs.writeFile('./temp/gameData.json', str, err => {
        if (err) {
          console.log('Error writing file', err);
        } else {
          console.log('Successfully wrote file');
        }
      });
  
      const row1 = await interaction.reply({files: ['./temp/row1.jpeg'], fetchReply: true});
      const row2 = await interaction.followUp({files: ['./temp/row2.jpeg']});
      const row3 = await interaction.followUp({files: ['./temp/row3.jpeg']});
      const row4 = await interaction.followUp({files: ['./temp/row4.jpeg']});
  
      try {
        await row1.react('1️⃣');
        await row1.react('2️⃣');
        await row1.react('3️⃣');
        await row2.react('1️⃣');
        await row2.react('2️⃣');
        await row2.react('3️⃣');
        await row3.react('1️⃣');
        await row3.react('2️⃣');
        await row3.react('3️⃣');
        await row4.react('1️⃣');
        await row4.react('2️⃣');
        await row4.react('3️⃣');
      } catch (error) {
        console.error('One of the emojis failed to react:', error);
      }
    }
    else {
      await interaction.reply('Game is already active');
    }
  }
};
