const {mod} = require('../../src/MGUSmod');
const color = require("../../src/models/ColorType");
const looseJson = require("./db/loose.json");
const locationJson = require('../config.json').locations;
const MapType = require('../../src/models/MapChType');

class locationClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeLocations();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeLocations() {
        let locations = mod.tables.locations;
        const looseJson = require("./db/loose.json");
        for(let lo in locations){
            if(lo==="develop") continue;
            if (!(typeof (locations[lo].base) === 'object' && locations[lo].base.Locked === false)){
                continue;
            }
            //战局时长(分钟)
            if(locationJson.EscapeTime!=="default"){
                locations[lo].base.EscapeTimeLimit = locationJson.EscapeTime;
            }
            //boss刷新率
            if (typeof (locations[lo].base.BossLocationSpawn) === 'object'){
                let locationBoss = locations[lo].base.BossLocationSpawn;
                for (let BZone of locationBoss) {
                    //boss刷新率100%
                    if (BZone.BossName.indexOf('boss') === 0 || !BZone.Supports) {
                        if(locationJson.Boss_100_Chance){
                            BZone.BossChance = 100;//出现概率
                        }
                    }
                    else if(locationJson.otherBossType.enable){
                        const botType = locationJson.otherBossType.botType;
                        for(let bT in botType){
                            if(BZone.BossName.indexOf(bT) === 0 && locationJson.otherBossType.botType[bT]!== "default"){
                                BZone.BossChance = locationJson.otherBossType.botType[bT]; //非boss类型  如 霉菌
                            }
                        }
                    }
                }
            }

            //100%拉闸
            if (typeof (locations[lo].base.exits) === 'object' && (locationJson.WorldEventChance || locationJson.EscapeChance)){
                for(let i in locations[lo].base.exits){
                    let exit = locations[lo].base.exits[i]
                    // 100%可拉闸
                    if(exit.PassageRequirement === "WorldEvent" && locationJson.WorldEventChance){
                        exit.Chance = 100;
                    }
                    // 100%可撤离
                    else if(locationJson.EscapeChance){
                        exit.Chance = 100;
                    }
                }
            }
            //地图是否回保
            locations[lo].base.Insurance=locationJson.Insurance[MapType[lo]];
            locations[lo].base.IsSecret=!locationJson.Insurance[MapType[lo]];
            
            //地图刷新
            if(locationJson.newLooseLoot){
                let newLooseLootNum = 0;
                let looseLoot = locations[lo].looseLoot;
                for(let looseType in looseJson[lo]){
                    // nLLII is the newLooseLootItemInfo
                    for(let nLLII of looseJson[lo][looseType]){
                        looseLoot[looseType].push(nLLII);
                        newLooseLootNum += 1;
                    }
                }
                if(newLooseLootNum>0){
                    mod.Logger.log(`地图：${MapType[lo]}成功添加${newLooseLootNum}个自定义刷新物品`,color.BLUE);
                }
            }
        }
    }
}

module.exports = new locationClass();