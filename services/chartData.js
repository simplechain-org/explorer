

const Sequelize = require('sequelize');
const db = require('../lib/db');
const schedule = require('node-schedule');

let countChartDat = () => {
    db.query(`
        call insert_chart_data()
    `, {
        replacements: [],
        type: Sequelize.QueryTypes.INSERT
    })
}




let chartData = function() {
    schedule.scheduleJob('0 0 3 * * *',async ()=>{
        console.log('Count chart data');
        countChartDat();
    });
}

module.exports = chartData;