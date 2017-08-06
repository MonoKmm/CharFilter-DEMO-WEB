var images = require('images')
var fs = require('fs')
var path = require('path')

fs.readdirSync('./').filter((value) => /\.jpg$/.test(value))
  .forEach((item) => {
    images(item)
    .resize(62)
    .save(path.basename(item, '.jpg') + '.png')
  })
// var arr = fs.readdirSync('./').filter((value) => /\.jpg$/.test(value))
//   .map((item) => {
//     return path.basename(item, '.jpg')
//   })
console.log('done')
