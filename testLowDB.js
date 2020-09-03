require('dotenv').config()
const ldb = require('./lowdb_DB')
const doc = require('./generate_docs')
const json_docs = require('./docsJSON')


// test three docs patterns
const data_doc1a = new doc()
const data_doc1b = new doc()

const doc1 = json_docs.getJSON('AQ100', 40.25, 12.10, null,
  [
    data_doc1a.get_data(),
    data_doc1b.get_data()
  ])

const data_doc2 = new doc()
const doc2 = json_docs.getJSON('AQ101', 45.0, 15.2, null, [data_doc2.get_data()])

// only PM2_5
const data_doc3 = new doc(null, undefined, null, null, null, null)
const doc3 = json_docs.getJSON('AQ103', null, null, null, [data_doc3.get_data()])

// only PM1 and CO
const data_doc4 = new doc(undefined, null, null, undefined, null, null)
const doc4 = json_docs.getJSON('AQ103', 45.0, 12.45, null, [data_doc4.get_data()])

const data_doc5 = new doc(100, null, 800, null, null, null)
const doc5 = json_docs.getJSON('AQ103', 45.0, 12.45, null, [data_doc5.get_data()])


// ; are necessary to avoid error console.log is not a function
console.log('\n\nData doc1:\n')
console.log(JSON.stringify(doc1, null, 2));
console.log('\n\nData doc2:\n')
console.log(JSON.stringify(doc2, null, 2));
console.log('\n\nData doc3:\n')
console.log(JSON.stringify(doc3, null, 2));

console.log('\n\nData doc4:\n')
console.log(JSON.stringify(doc4, null, 2));

console.log('\n\nData doc5:\n')
console.log(JSON.stringify(doc5, null, 2));


const def_coll = process.env.DEFAULT_COLL_FS; //'fixed_stations'
const def_dt_format = process.env.DEFAULT_DATE_FORMAT; //'YYYY-MM-DD HH:00'

(async () => {
  try {
    //init AsyncFile connection
    const db = await ldb.initDB()

    // check main collection
    const stations = await db.get(def_coll)

    //await ldb.insertData(db, doc1)
    //await ldb.insertData(db, doc2)

    // add doc3 having only PM2_5
    // await ldb.insertData(db, doc3)

    // add doc4 having only PM1 and CO
    //await ldb.insertData(db, doc3)

    // update doc 4 adding PM2_5 and NO2


    // datetime not present insert single value 
    add_new_buket = false
    if (add_new_buket) {
      doc5.date = '2020-09-03T06:00:00.000Z'
      doc5.samples[0].t = '2020-09-03T06:10:57.617Z'
      doc5.id = `${doc5.station.name}_${doc5.date}`
      await ldb.update_insertData(db, 'AQ103', doc5)
    }


    // add value to existing sample
    add_value_to_samples_data = false;
    if (add_value_to_samples_data) {
      doc5.date = '2020-09-03T06:00:00.000Z' //doc5.date '2020-09-03T06:00:00.000Z'
      doc5.samples[0].t = '2020-09-03T06:10:57.617Z'
      doc5.id = `${doc5.station.name}_${doc5.date}`
      doc5.samples[0].data = {
        ...doc5.samples[0].data,
        O3: 300
      }
      await ldb.update_insertData(db, 'AQ103', doc5)
    }

    add_new_data_to_samples = false;
    if (add_new_data_to_samples) {
      doc5.date = '2020-09-03T06:00:00.000Z' //doc5.date '2020-09-03T06:00:00.000Z'
      doc5.samples[0].t = '2020-09-03T06:12:00.000Z'
      doc5.id = `${doc5.station.name}_${doc5.date}`
      doc5.samples[0].data = {
        ...doc5.samples[0].data,
        O3: 300.25,
        NO2: 100.45
      }
      await ldb.update_insertData(db, 'AQ103', doc5)
    }

    //doc5.samples[0].t //'2020-09-03T07:13:57.617Z' doc5.samples[0].t 





    //await ldb.deleteDataByDate(db, 'AQ100', '2020-09-02 05:00')
    //await ldb.deleteDataSamples(db, 'AQ100', '2020-09-03 07:00', '2020-09-03T05:28:00.000Z')



    //await ldb.deleteData(db, 'AQ101', '2020-09-01T15:00:00.000Z')

    // read Station data by Name
    const dataAQ = await ldb.readData(db, 'AQ103')
    const dataAQ101 = await ldb.readDataByStation(db, 'AQ103')
    console.log('\n\n Data for AQ103')
    console.log(JSON.stringify(dataAQ101, null, 2))

    // count docs
    console.log(`\n\nCurrently there are ${stations.size().value()} docs`)
  } catch (error) {
    console.log(error.message)
  }
})()

// USEFUL RESOURCES
// https://helpdev.eu/node-js-lowdb-a-lightweight-database-alternative/
//
// https://github.com/typicode/lowdb 
//
// https://stackoverflow.com/questions/51967846/lowdb-push-data-into-an-array-inside-another-array

// https://levelup.gitconnected.com/extremely-useful-lodash-methods-b38f121fea7e

// https://morioh.com/p/f6a47b5c40ff Introduction to Lodash
// https://morioh.com/p/8c33475e283b Common JavaScript functions with Lodash

// general JSON format for data
// {
//   "id": "AQ100_2020-09-02 04:00",
//   "date": "2020-09-02 04:00",
//   "station": {
//     "name": "AQ100",
//     "loc": {
//       "type": "Point",
//       "coordinates": [
//         40.25,
//         12.1
//       ]
//     }
//   },
//   "samples": [
//     {
//       "t": "2020-09-02T02:18:00.000Z",
//       "data": {
//         "PM1": "205.655",
//         "PM2_5": "260.734",
//         "CO": "1410.729",
//         "NO2": "677.337",
//         "O3": "667.537"
//       }
//     },
//     {
//       "t": "2020-09-02T02:18:00.000Z",
//       "data": {
//         "PM1": "455.756",
//         "PM2_5": "11.051",
//         "CO": "1860.075",
//         "NO2": "277.902",
//         "O3": "41.288"
//       }
//     }
//   ]
// }