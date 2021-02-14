let mix = require('laravel-mix')

mix
  .options({
    processCssUrls: false,
    terser: {
      extractComments: false,
    },
    postCss: [
      require('autoprefixer')({
        grid: true,
      }),
    ],
  })
  .sourceMaps(true, 'source-map')

mix.sass(`./sass/main.scss`, `./dist/main.css`)
mix.js(`./javascript/app.js`, `./dist/app.js`)

mix.browserSync({
  proxy: false,
  server: {
    baseDir: './',
  },
  files: ['*/*.js', '*/*/*.scss', '*.html', '*.css'],
})
