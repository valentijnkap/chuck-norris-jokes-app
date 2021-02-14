import Vue from 'vue'
import axios from 'axios'

const app = new Vue({
  data: {
    randomJokes: localStorage.getItem('randomJokes')
      ? JSON.parse(localStorage.getItem('randomJokes'))
      : [],
    //randomJokes: [],
  },
  methods: {
    getJokes() {
      axios.get('https://api.icndb.com/jokes/random/10').then((response) => {
        localStorage.setItem('randomJokes', JSON.stringify(response.data.value))

        this.randomJokes = response.data.value
      })
    },
  },
})

app.$mount('#app')
