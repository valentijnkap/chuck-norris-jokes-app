import Vue from 'vue'
import axios from 'axios'
import VueSvgInlinePlugin from 'vue-svg-inline-plugin'

Vue.use(VueSvgInlinePlugin)

const app = new Vue({
  data: {
    randomJokes: [],
    favorites: localStorage.getItem('favorites')
      ? JSON.parse(localStorage.getItem('favorites'))
      : [],
    isSearch: false,
    isFavorites: true,
    message: '',
    timer: false,
    interval: 0,
  },
  methods: {
    getJokes() {
      axios.get('https://api.icndb.com/jokes/random/10').then(response => {
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
      const jokeObj = {
        id: id,
        joke: joke,
      }

      // Check if there are favorites in local storage
      if (!localStorage.getItem('favorites')) {
        const initialArray = [jokeObj]
        localStorage.setItem('favorites', JSON.stringify(initialArray))
        this.favorites = initialArray
      } else {
        // Get favorites from localstorage as a object
        const favoritesFromStorage = JSON.parse(
          localStorage.getItem('favorites')
        )

        // If not already saved or reached max length
        if (!searched && this.favorites.length < 10) {
          // Save the joke in the original list
          favoritesFromStorage.push(jokeObj)

          // Renew the list of favorites
          localStorage.setItem(
            'favorites',
            JSON.stringify(favoritesFromStorage)
          )
          // Update the favorite state
          this.favorites.push(jokeObj)
        } else {
          this.message =
            'You saved this one or already saved the maximum amount of jokes'
        }
      }
    },
    deleteJoke(id) {
      const oldFavorites = this.favorites

      if (oldFavorites.length <= 10) {
        this.message = ''
      }

      const newFavorites = oldFavorites.filter(item => {
        return item.id !== id
      })

      this.favorites = newFavorites
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    },
    checkIfSaved(id) {
      const searched = findJoke(id, this.favorites)

      if (searched) {
        return 'is-saved'
      }
    },
    setTimer() {
      if (this.timer) {
        this.timer = false
      } else {
        this.timer = true
      }
    },
  },
  watch: {
    timer(newTimer) {
      if (newTimer) {
        const favorites = this.favorites

        this.interval = setInterval(() => {
          axios.get('https://api.icndb.com/jokes/random/1').then(response => {
            const prepareJoke = {
              id: response.data.value[0].id,
              joke: response.data.value[0].joke,
            }

            const searched = findJoke(response.data.value[0].id, favorites)

            if (!searched) {
              favorites.push(prepareJoke)

              this.favorites = favorites
              localStorage.setItem('favorites', JSON.stringify(favorites))
            }
          })
        }, 5000)
      } else {
        clearInterval(this.interval)
      }
    },
    favorites(newFav, oldFav) {
      if (newFav.length >= 10) {
        this.timer = false
        this.message = 'Reached maximum amount of stored favorites'
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
