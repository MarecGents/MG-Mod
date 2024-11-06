const {mod} = require('../../src/MGUSmod');
const traderJson = require('../config.json').traders;
const returnPay = require('../config.json').configs.returnChance.returnPay;
class tradersClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeTraders();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeTraders() {
        // let tables = mod.databaseServer.getTables();
        let traders = mod.tables.traders;


        for (let tra in traders) {
            let traB = traders[tra].base;
            if (tra !== "ragfair") {
                //保险秒回
                if ("availability" in traB.insurance && traB.insurance.availability === true) {
                    traB.insurance.min_return_hour = traderJson.insurance.min_return_hour;
                    traB.insurance.max_return_hour = traderJson.insurance.max_return_hour;

                    //投保花费
                    if (returnPay !== "default") {
                        for(let index in traB.loyaltyLevels){
                            traB.loyaltyLevels[index].insurance_price_coef = returnPay * 100;
                        }
                    }
                }
            }
        }
    }
}

module.exports = new tradersClass();