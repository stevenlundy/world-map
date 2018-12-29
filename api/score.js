const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

const countryMappings = require('./country-decoder')
const countryCodes = require('./country-codes')

module.exports = (req, res) => {
  jsonParser(req, res, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log(req.body);
      let correctAnswers = [];
      let incorrectAnswers = [];
      let guesses = req.body.guesses;
      for (let key in guesses) {
        let countryCode = countryMappings[key];
        if (!countryCode) return;
        let guess = guesses[key].toUpperCase();
        let possibleAnswers = countryCodes[countryCode].map(s => s.toUpperCase());
        if (possibleAnswers.includes(guess)) {
          correctAnswers.push(key);
        } else {
          incorrectAnswers.push(key);
        }
      }
      res.end(JSON.stringify({correct: correctAnswers, incorrect: incorrectAnswers}));
    }
  })
};
