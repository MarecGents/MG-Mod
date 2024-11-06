const {mod} = require('../../src/MGUSmod');

const botsJson = require('../config.json').bots;

class botsClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeBots();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeBots() {
        // let tables = mod.databaseServer.getTables();
        let bots = mod.tables.bots.types
        if( "healthRate" in botsJson){
            if(botsJson.healthRate !== "default"){
                for(let bot in bots){
                    let bodyPart = bots[bot].health.BodyParts[0];
                    for(let parts in bots[bot].health.BodyParts[0]){
                        bodyPart[parts].max *= botsJson.healthRate;
                        bodyPart[parts].min *= botsJson.healthRate;
                    }
                }
            }
        }
    }
}

module.exports = new botsClass();