const FORM_SUBMIT_URL = "/api/score";

let storage = {
  _store: {},
  setItem: function(key, value) {
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      this._store.key = JSON.stringify(value);
    }
  },
  getItem: function(key) {
    if (localStorage) {
      return JSON.parse(localStorage.getItem(key));
    } else {
      return JSON.parse(this._store.key);
    }
  },
  clear: function() {
    if (localStorage) {
      localStorage.clear();
    } else {
      Object.keys(this._store).forEach(k => delete this._store[k]);
    }
  }
};

let app = new Vue({
  el: '#app',
  data: {
    countries: countryPaths,
    selectedCountry: null,
    userName: "",
    guesses: {}
  },
  created: function() {
    let storedGuesses = storage.getItem('guesses');
    if (storedGuesses) {
      this.guesses = storedGuesses;
    }
    this.selectRandomUnnamedCountry();
  },
  methods: {
    selectCountry: function(country) {
      this.selectedCountry = country;
    },
    isSelected: function(country) {
      return country == this.selectedCountry;
    },
    hasGuess: function(country) {
      return this.guesses[country.country];
    },
    selectRandomUnnamedCountry: function() {
      let unnamedCountries = Object.values(this.countries).filter(c => !this.hasGuess(c));
      if (unnamedCountries.length == 0) {
        if (!this.selectedCountry) {
          this.selectedCountry = Object.values(this.countries)[0]
        }
        return
      }
      let index = Math.floor(Math.random() * unnamedCountries.length);
      this.selectedCountry = unnamedCountries[index];
    },
    saveGuesses: function() {
      storage.setItem('guesses', this.guesses);
    },
    submitGuesses: function() {
      if (!this.userName) return;
      if (!confirm("Are you sure you want to submit your guesses?")) return;
      let data = {};
      data.guesses = Object.assign({}, this.guesses);
      data.name = this.userName;
      return fetch(FORM_SUBMIT_URL, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: 'cors',
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      }).then(r => r.json()).then(r => {
        storage.clear();
        this.guesses = {};
      })
    }
  }
});

var panZoom = svgPanZoom('#world-map', {
  zoomEnabled: true,
  controlIconsEnabled: true
});
