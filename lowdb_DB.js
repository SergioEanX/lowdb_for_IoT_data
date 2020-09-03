require('dotenv').config()
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
adapter = new FileAsync(process.env.LOWDB_PATH)
const moment = require('moment')
const map = require('lodash/map')
const flatten = require('lodash/flatten')

const def_coll = process.env.DEFAULT_COLL_FS //'fixed_stations'
const def_dt_format = process.env.DEFAULT_DATE_FORMAT //'YYYY-MM-DD HH:00'

// init lowdb connection as async file write

exports.initDB = async (coll_name = def_coll) => {
    const db = await low(adapter);
    // create JSON file with main collection named <coll_name>
    // as an empty array
    db.defaults({
        [coll_name]: []
    }).write();
    return db
};

// CREATE 
exports.insertData = async (db, doc, coll_name = def_coll) => {
    const stations_data = await db.get(coll_name)
    await stations_data.push(doc).write()
    return
}

// READ
exports.readDataByStation = async (db, stationName, coll_name = def_coll) => {
    const stations_data = await db.get(coll_name)
        .filter({
            station: {
                name: stationName // filter by stationName
            }
        })
        .sortBy('date') // sort by date
        .value();
    return stations_data //retrun array objects
}

exports.readDataUnwind = async (db, stationName, coll_name = def_coll) => {
    const stations_data = await db.get(coll_name)
        .filter({
            station: {
                name: stationName // filter by stationName
            }
        })
        .sortBy('date').value() // sort by date
    const result = stations_data.map(doc => doc.samples.map(sample => ({
        station: doc.station.name,
        t: sample.t,
        ...sample.data
    }))).flat()
    //console.log(result)
    return result //retrun array objects
}

// UPDATE (INSERT)
// update by station name and datetime
// if bucket is found then 
// if sample  at time is found then add/modify data
// else add new data to samples
// if no bucket is found then insert a new one

exports.update_insertData = async (db, stationName, data, coll_name = def_coll) => {

    strDate = data.date
    time = data.samples[0].t
    //find by StationName and time and update 
    const station_data = await db.get(coll_name).
    find({
        station: {
            name: stationName
        },
        date: strDate
    })


    // found existing bucket then update  
    if (station_data.value()) {

        let updateSamples = await station_data
            .get('samples')
            .find({
                t: time
            })
        //console.log(updateSamples.value())

        // if found then update by keeping existing data
        // old values are updated if existing and new values are added
        if (updateSamples.value()) {
            await updateSamples.assign({
                data: {
                    ...updateSamples.value().data,
                    ...data.samples[0].data
                }
            }).write()

            // add data to samples            
        } else {
            station_data.get('samples')
                .push({
                    t: time,
                    data: data.samples[0].data
                }).write()
        }
        return
        // no bucket found than insert one
    } else {
        //insert 
        this.insertData(db, data, coll_name)
    }
}

// DELETE by station name and datetime (whole bucket)
exports.deleteDataByDate = async (db, stationName, datetime, coll_name = def_coll) => {
    const stations_data = await db.get(coll_name)
        .remove({
            station: {
                name: stationName
            },
            date: datetime
        }).write()
    return
}

// DELETE by station name, datetime and time data sample 
// (only single sample in bucket)
exports.deleteDataSamples = async (db, stationName, datetime, time_sample, coll_name = def_coll) => {

    // retrive LodasWrapper object having the provided station name and date
    const stations_data = await db.get(coll_name)
        .find({
            station: {
                name: stationName
            },
            date: datetime
        })

    if (stations_data.value()) {
        const filtered_data = stations_data.get('samples')
            .value()
            .filter((v => v.t != time_sample))
        await stations_data.assign({
            samples: filtered_data
        }).write()
    }


}