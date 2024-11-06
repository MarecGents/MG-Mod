const {mod} = require('../../src/MGUSmod');
const questJson = require("../../res/quests.json");
const requestJson = require('../config.json').request;

class requestClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeRequests();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeRequests() {
        // let tables = mod.databaseServer.getTables();
        let r_quests_t = mod.tables.templates.repeatableQuests.templates;
        let quests = mod.tables.templates.quests;
        //任务免费重置
        for (let rqt in r_quests_t) {
            r_quests_t[rqt].changeCost[0].count = requestJson.changeCost_cont; //默认5000
        }
        // 任务难度优化
        if(requestJson.questOptimize){
            for(let qusetId in questJson){
                if(!(qusetId in quests)){
                    continue;
                }
                let AForFinish = quests[qusetId].conditions.AvailableForFinish;
                for(let Finish of AForFinish){
                    Finish.value = 1;
                }
                let AForStart = quests[qusetId].conditions.AvailableForStart;
                for(let Start of AForStart){
                    Start.availableAfter = 0;
                }
            }
        }
    }
}

module.exports = new requestClass();
        