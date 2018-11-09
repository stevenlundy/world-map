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
  }
};

let app = new Vue({
  el: '#app',
  data: {
    countries: countryPaths,
    selectedCountry: null,
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
    }
  }
});

var panZoom = svgPanZoom('#world-map', {
  zoomEnabled: true,
  controlIconsEnabled: true
});
