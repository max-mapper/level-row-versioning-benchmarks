var setup = require('./')
var lexint = require('lexicographic-integer')

setup(function(db, settings, done) {
  var startOpts = {
    start: 'ÿÿ',
    end: '',
    limit: 1,
    reverse: true
  }
  
  var currentId = settings.ids
  
  getOne(startOpts, function(row, raw) {
    proceed(row, raw)
  })
  
  function proceed(row, raw) {
    if (currentId === 1 && row.id === 1) {
      console.log('PASSED')
      done()
      return
    }
    if (row.id !== currentId) {
      console.error(row.id, currentId)
      done()
    } else {
      currentId--
      var opts = {
        end: '',
        start: 'ÿ' + lexint.pack(row.id, 'hex'),
        // end: 'ÿ' + raw[1],
        limit: 1,
        reverse: true
      }
      getOne(opts, function(row, raw) {
        proceed(row, raw)
      })
    }
  }
  
  function getOne(opts, cb) {
    var rs = db.createReadStream(opts).on('data', function(d) {
      var parts = d.key.split('ÿ')
      var doc = {
        id: lexint.unpack(parts[1], 'hex'),
        rev: lexint.unpack(parts[2], 'hex')
      }
      
      cb(doc, parts)
      rs.destroy()
    })
    rs.on('error', function(e) {
      throw e
    })
  }
})


