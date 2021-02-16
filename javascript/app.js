import Vue from 'vue'
import axios from 'axios'
import VueSvgInlinePlugin from 'vue-svg-inline-plugin'

Vue.use(VueSvgInlinePlugin)

const app = new Vue({
  data: {
    randomJokes: localStorage.getItem('randomJokes')
      ? JSON.parse(localStorage.getItem('randomJokes'))
      : [],
    favorites: [],
    isSearch: true,
    isFavorites: false,
    message: '',
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
    saveJoke(id, joke) {
      const searched = findJoke(id, this.favorites)

      if (!searched && this.favorites.length <= 10) {
        this.favorites.push({
          id: id,
          joke: joke,
        })
      } else {
        this.message =
          'You saved this one or already saved the maximum amount of jokes'
      }
    },
    checkIfSaved(id) {
      const searched = findJoke(id, this.favorites)

      if (searched) {
        return 'is-saved'
      }
    },
  },
})

app.$mount('#app')

function findJoke(id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return array[i]
    }
  }
}
