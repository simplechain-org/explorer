

const Sequelize = require('sequelize');
const db = require('../lib/db');
const schedule = require('node-schedule');

let countChartDat = () => {
    db.query(`
        insert into chart
        select difficulty,size,blockCount,avgTime,txCount,uncleCount,addressCount,addressCount - prevCount as newAddress,round(difficulty/avgtime) as avgHashrate,date from (
            select t.*,@addressCount as prevCount,@addressCount:=addressCount from (
                select t1.*,t2.uncleCount, 
                    (select count(distinct address) from (
                        select distinct miner as address,
                            concat(year(from_unixtime(\`timestamp\`)),'-',LPAD(month(from_unixtime(\`timestamp\`)),2,0),'-',LPAD(day(from_unixtime(\`timestamp\`)),2,0)) as date
                        from blocks  union  
                        select distinct t.\`from\` as address,
                            concat(year(from_unixtime(b.\`timestamp\`)),'-',LPAD(month(from_unixtime(b.\`timestamp\`)),2,0),'-',LPAD(day(from_unixtime(b.\`timestamp\`)),2,0)) as date
                        from transactions as t left join blocks b on t.blockNumber = b.height 
                        union
                        select distinct t.\`to\` as address,
                            concat(year(from_unixtime(b.\`timestamp\`)),'-',LPAD(month(from_unixtime(b.\`timestamp\`)),2,0),'-',LPAD(day(from_unixtime(b.\`timestamp\`)),2,0)) as date
                        from transactions  as t left join blocks b on t.blockNumber = b.height
                    ) as a where a.date < t1.date + INTERVAL 1 day) as addressCount
                from (
                    select round(avg(\`difficulty\`)) as difficulty,round(avg(\`size\`)) as size,count(1) as blockCount,
                            round((max(\`timestamp\`)-min(\`timestamp\`))/count(1),2)  as avgTime,sum(txCount) txCount,
                    concat(year(from_unixtime(\`timestamp\`)),'-',LPAD(month(from_unixtime(\`timestamp\`)),2,0),'-',LPAD(day(from_unixtime(\`timestamp\`)),2,0)) as date
                    from blocks as b left join (
                        select count(1) txCount,blockNumber from transactions group by blockNumber
                    ) as tx on b.height = tx.blockNumber group by date 
                ) as t1 left join (
                    select count(1) as uncleCount, 
                        concat(year(from_unixtime(\`timestamp\`)),'-',LPAD(month(from_unixtime(\`timestamp\`)),2,0),'-',LPAD(day(from_unixtime(\`timestamp\`)),2,0)) as date
                    from \`uncles\` group by date 
                ) t2 on t1.date = t2.date order by date asc
            ) as t,(SELECT @addressCount:=0) s
        ) tt where date = date_format(now() - INTERVAL 1 day,'%Y-%m-%d')
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