var level = require('level')
var rimraf = require('rimraf')

// creates db with (by default) 1000 ids, each id has 25 versions (25,000 keys total)
module.exports = function seed(setup, cb) {
  level('test', function(err, db) {
    
    function done() {
      console.timeEnd('elapsed')
      db.close()
      rimraf('test', function() {})
    }
    
    var num = process.argv[2] || 10000
    num = +num
    
    var versions = 25
    var delay = 2000 // in case leveldb is compacting etc
    var opts = { versions: versions, ids: num }
    
    setup(db, opts, function() {
      setTimeout(function() {
        console.time('elapsed')
        cb(db, opts, done)
      }, delay)
    })
  })
}
