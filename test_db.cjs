const { get } = require('idb-keyval');

// since we are running in node, idb-keyval won't work easily if it relies on indexedDB. 
// let's just grep the mockProducts? 
