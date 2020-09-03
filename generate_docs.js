// helper to generate random values
const rn = require('lodash/random')

module.exports = class doc {

    constructor(PM1, PM2_5, PM10, CO, NO2, O3) {

        // set paramater to undefined to random generate value,
        // if null remain as is
        this.PM1 = PM1 === undefined ? parseFloat(rn(10, 1000, true).toFixed(3)) : PM1;
        this.PM2_5 = PM2_5 === undefined ? parseFloat(rn(10, 1000, true).toFixed(3)) : PM2_5;
        this.PM10 = PM10 === undefined ? parseFloat(rn(10, 1000, true).toFixed(3)) : PM10;
        this.CO = CO === undefined ? parseFloat(rn(20, 60, true).toFixed(3)) : CO;
        this.NO2 = NO2 === undefined ? parseFloat(rn(20, 600, true).toFixed(3)) : NO2;
        this.O3 = O3 === undefined ? parseFloat(rn(100, 800, true).toFixed(3)) : O3;
    }



    // return object with data member and different members
    get_data = () => {
        let result = {
            data: {
                // return object member if it is not null
                ...(this.PM1 !== null && {
                    PM1: this.PM1
                }),
                ...(this.PM2_5 !== null && {
                    PM2_5: this.PM2_5
                }),
                ...(this.PM10 !== null && {
                    PM10: this.PM10
                }),
                ...(this.CO !== null && {
                    CO: this.CO
                }),
                ...(this.NO2 !== null && {
                    NO2: this.NO2
                }),
                ...(this.O3 !== null && {
                    O3: this.O3
                })
            }
        }

        return result
    }


}