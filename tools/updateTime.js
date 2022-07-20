let fse = require('fs-extra')
let path = require('path')

fse.writeJSONSync(path.join(__dirname, '../src/data/app/time.json'), {
  time: Date.now(),
})
