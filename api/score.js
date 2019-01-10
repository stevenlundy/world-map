const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const fetch = require('node-fetch')

const countryMappings = require('./country-decoder')
const countryCodes = require('./country-codes')
const FORM_SUBMIT_URL = "https://script.google.com/macros/s/AKfycbzMcwFTm3lC43zM-GPT09iql5_GJAo99hu42YQZj7y1yrVVhu4/exec"

function scoreGuesses(guesses) {
  let correctAnswers = [];
  let incorrectAnswers = [];
  for (let key in guesses) {
    let countryCode = countryMappings[key];
    if (!countryCode) continue;
    let guess = guesses[key].toUpperCase();
    let possibleAnswers = countryCodes[countryCode].map(s => s.toUpperCase());
    if (possibleAnswers.includes(guess)) {
      correctAnswers.push(key);
    } else {
      incorrectAnswers.push(key);
    }
  }
  return {correctAnswers, incorrectAnswers};
}

function submitGuesses(name, guesses, score) {
  let data = {};
  for (let key in countryMappings) {
    data[key] = guesses[key] || "";
  }
  data.name = name;
  data.score = score;
  return fetch(FORM_SUBMIT_URL, {
      method: "POST",
      mode: 'no-cors',
      cache: "no-cache",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
}

module.exports = (req, res) => {
  jsonParser(req, res, function(err) {
    if (err) {
      console.log(err)
    } else {
      let {correctAnswers, incorrectAnswers} = scoreGuesses(req.body.guesses);
      submitGuesses(req.body.name, req.body.guesses, correctAnswers.length).then(function() {
        res.end(JSON.stringify({correct: correctAnswers, incorrect: incorrectAnswers}));
      })
    }
  })
};
