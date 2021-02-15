import Vue from 'vue'
import axios from 'axios'

const app = new Vue({
  data: {
    randomJokes: localStorage.getItem('randomJokes')
      ? JSON.parse(localStorage.getItem('randomJokes'))
      : [],
    favorites: [],
    isSearch: true,
    isFavorites: false,
  },
  methods: {
    getJokes() {
      axios.get('https://api.icndb.com/jokes/random/10').then(response => {
        localStorage.setItem('randomJokes', JSON.stringify(response.data.value))

        this.randomJokes = response.data.value
      })
    },
    toggleView() {
      if (this.isSearch) {
        this.isSearch = false
        this.isFavorites = true
      } else {
        this.isSearch = true
        this.isFavorites = false
      }
    },
    saveJoke(joke) {
      this.favorites.push(joke)
      console.log(this.favorites)
    },
  },
})

app.$mount('#app')
