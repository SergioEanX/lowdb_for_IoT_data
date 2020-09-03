const doc = require('./generate_docs')


c1 = new doc(null, 100, null, null, undefined, 300);
console.log(JSON.stringify(c1.get_data()))