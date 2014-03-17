var setup = require('./')
var lexint = require('lexicographic-integer')
var buff = require('fs').readFileSync('package.json')

setup(fill, function(db, settings, done) {
  var startOpts = {
    start: '',
    end: 'ÿÿ',
    limit: 1
  }
  
  var currentId = settings.ids
  
  getOne(startOpts, function(row, raw) {
    proceed(row, raw)
  })
  
  function proceed(row, raw) {
    // if (currentId === 1 && row.id === 1) {
    if (currentId === 1) {
      done()
      return
    }
    // if (row.id !== currentId) {
    //   console.error(row.id, currentId)
    //   done()
    // } else {
      currentId--
      var opts = {
        start: 'ÿ' + raw[1] + 'ÿÿ',
        end: 'ÿÿ',
        limit: 1
      }
      getOne(opts, function(row, raw) {
        proceed(row, raw)
      })
    // }
  }
  
  function getOne(opts, cb) {
    var rs = db.createReadStream(opts).on('data', function(d) {
      var parts = d.key.split('ÿ')
      // var doc = {
      //   id: lexint.unpack(parts[1], 'hex'),
      //   rev: lexint.unpack(parts[2], 'hex')
      // }
      // 
      // cb(doc, parts)
      cb(null, parts)
      rs.destroy()
    })
    rs.on('error', function(e) {
      throw e
    })
  }
})

function fill(db, opts, cb) {
  var num = opts.ids
  var versions = opts.versions
  var pending = num * versions
  for (var i = 1; i < num + 1; i++) {
    for (var j = 1; j < versions + 1; j++) {
      db.put('ÿ' + lexint.pack(i, 'hex') + 'ÿ' + lexint.pack(j, 'hex'), buff, function() {
        if (--pending === 0) cb()
      })
    }
  }
}