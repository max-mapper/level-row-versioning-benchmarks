var level = require('level')
var rimraf = require('rimraf')
var lexint = require('lexicographic-integer')

var buff = require('fs').readFileSync('package.json')

module.exports = function seed(cb) {
  level('test', function(err, db) {
    
    function done() {
      db.close()
      rimraf('test', function() {})
    }
    
    var num = process.argv[2] || 1000
    num = +num
    
    var pending = num * 25
    for (var i = 0; i < num; i++) {
      for (var j = 0; j < 25; j++) {
        db.put('ÿ' + lexint.pack(i, 'hex') + 'ÿ' + lexint.pack(j, 'hex'), buff, function() {
          if (--pending === 0) cb(db, done)
        })
      }
    }
  })
}
