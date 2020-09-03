const moment = require('moment')
exports.getJSON = (station, long, lat, date, docs) => {


    // define date string with no minutes/seconds
    const str_date = !date ? moment().format('YYYY-MM-DD HH:00') : moment(date).format('YYYY-MM-DD HH:00')
    // convert to ISOString (UTC)
    const str_date_ISO = new Date(str_date).toISOString()

    // retrive current minutes
    let now = new Date(str_date)


    samples_array = []

    docs.forEach(doc => {
        let minutes = (new Date()).getMinutes()
        let seconds = (new Date()).getSeconds()
        let milliseconds = (new Date()).getMilliseconds()
        now.setMinutes(minutes)
        now.setSeconds(seconds)
        now.setMilliseconds(milliseconds)
        let document = {
            t: new Date(now).toISOString(),
            data: doc.data
        }
        samples_array.push(document)
    });

    return {
        // add id as <station>_<datetime_YYYY-MM-DD HH:00>
        id: `${station}_${str_date_ISO}`,
        // add datetime (no minutes or seconds to create hourly buckets)
        date: str_date_ISO,
        // add station name and loc as GeoJSON
        station: {
            name: station,
            loc: {
                type: "Point",
                coordinates: [!long ? 14.34 : long, !lat ? 40.81 : lat]
            }
        },
        samples: samples_array
    }
}