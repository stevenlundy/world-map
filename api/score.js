const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const countryMappings = require('./country-decoder')
const countryCodes = require('./country-codes')

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

module.exports = (req, res) => {
  jsonParser(req, res, function(err) {
    if (err) {
      console.log(err)
    } else {
      let {correctAnswers, incorrectAnswers} = scoreGuesses(req.body.guesses);
      res.end(JSON.stringify({correct: correctAnswers, incorrect: incorrectAnswers}));
    }
  })
};
