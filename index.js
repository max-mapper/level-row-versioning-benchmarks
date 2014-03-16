var level = require('level')
var rimraf = require('rimraf')
var lexint = require('lexicographic-integer')

var buff = require('fs').readFileSync('package.json')

// creates db with (by default) 1000 ids, each id has 25 versions (25,000 keys total)
module.exports = function seed(cb) {
  level('test', function(err, db) {
    
    function done() {
      console.timeEnd('elapsed')
      db.close()
      rimraf('test', function() {})
    }
    
    var num = process.argv[2] || 1000
    num = +num
    
    var versions = 25
    var delay = 2000 // in case leveldb is compacting etc
    var opts = { versions: versions, ids: num }
    
    var pending = num * versions
    
    for (var i = 1; i < num + 1; i++) {
      for (var j = 1; j < versions + 1; j++) {
        db.put('ÿ' + lexint.pack(i, 'hex') + 'ÿ' + lexint.pack(j, 'hex'), buff, function() {
          if (--pending === 0) {
            setTimeout(function() {
              console.time('elapsed')
              cb(db, opts, done)
            }, delay)
          }
        })
      }
    }
  })
}
