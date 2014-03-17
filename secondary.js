var setup = require('./')
var lexint = require('lexicographic-integer')
var buff = require('fs').readFileSync('package.json')

setup(fill, function(db, settings, done) {
  var seqOpts = {
    start: 'ÿcÿ',
    end: 'ÿcÿÿ'
  }
  
  var count = settings.ids
  db.createReadStream(seqOpts).on('data', function(row) {
    var encKey = row.key.split('ÿ')[2]
    var key = 'ÿdÿ' + encKey + 'ÿ' + row.value
    db.get(key, function(err, val) {
      if (--count === 0) done()
    })
  })
  
})

function fill(db, opts, cb) {
  var num = opts.ids
  var versions = opts.versions
  var pending = num * versions + num
  for (var i = 1; i < num + 1; i++) {
    for (var j = 1; j < versions + 1; j++) {
      var key = lexint.pack(i, 'hex')
      var rev = lexint.pack(j, 'hex')
      db.put('ÿdÿ' + key + 'ÿ' + rev, buff, done)
      if (j === versions) db.put('ÿcÿ' + key, rev, done)
      function done() {
        if (--pending === 0) cb()
      }
    }
  }
}