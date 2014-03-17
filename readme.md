# level-row-versioning-benchmarks

benchmarking different ways to store versioned data in leveldb.

the benchmarks store many ids each with many versions and then get the latest version of each id

to run them:

```
npm i
npm run bench
```

## results

for 10,000 ids each with 25 versions

- forward.js: 987ms
- reverse.js: 924ms
- secondary.js: 475ms

## benchmarks
### reverse.js

- uses a single index
- stores data in format `IDÿVERSION` where both `ID` and `VERSION` sort lexicographically
- algorithm:
  - reverse read stream starting at end
  - first hit is the latest revision of the highest sorting id
  - end previous read stream (it had limit 1 anyway) and create a new one starting at current id
  - repeat until done

number of keys required is: `versions * number of ids`

### forward.js

- almost the same as reverse.js
- uses a single index
- stores data in format `IDÿVERSION` where both `ID` and `VERSION` sort lexicographically
- algorithm:
  - forward read stream starting at beginning
  - first hit is the first sorting revision of the first sorting ID
  - end current read stream, create new one at `currentId + 'ÿÿ'`
  - repeat until done
  
this requires you to store revisions in reverse lexicographical order!

number of keys required is: `versions * number of ids`

### secondary.js

- uses two indexes, `d` which is data at each id + version and `c` which is a pointer to the current version for an id
- stores data in format `ÿdÿIDÿVERSION` and `ÿsÿID = VERSION`
- algorithm:
  - does a read stream of all `ÿsÿ` keys
  - latest revision is stored in value, combine that with key to get key of latest rev
  - do db.get(latestKey) to get the current version
  
number of keys required is: `versions * number of ids + number of ids`
