var setup = require('./')
var lexint = require('lexicographic-integer')

setup(function(db, done) {
  var opts = {
    start: '',
    end: 'ÿ',
    limit: 1,
    reverse: true
  }
  db.createReadStream(opts).on('data', function(d) {
    var parts = d.key.split('ÿ')
    console.log(lexint.unpack(parts[1], 'hex'), lexint.unpack(parts[2], 'hex'))
    done()
  })
})
