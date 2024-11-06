const {mod} = require('../../src/MGUSmod');
const hideoutJson = require('../config.json').hideout;

class hideoutClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeHideout();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeHideout() {
        let hideout = mod.tables.hideout;
        let areas = hideout.areas;
        let production = hideout.production.recipes;
        let scavecase = hideout.production.scavRecipes;

        //藏身处升级时间
        if(hideoutJson.areas!=="default"){
            for(let id1 in areas){
                for(let n in areas[id1].stages){
                    let time = areas[id1].stages[n].constructionTime;
                    if(time!==0){
                        areas[id1].stages[n].constructionTime = hideoutJson.areas;
                    }
                }
            }
        }
        //藏身处生产时间
        if(hideoutJson.production!=="default"){
            for(let it of production){
                if(it.productionTime !== 0){
                    it.productionTime = hideoutJson.production;
                }
            }
        }
        //Scav宝箱
        if(hideoutJson.scavcase!=="default"){
            for(let it of scavecase){
                if(it.productionTime !== 0){
                    it.productionTime = hideoutJson.scavcase;
                }
            }
        }
    }
}

module.exports = new hideoutClass();
