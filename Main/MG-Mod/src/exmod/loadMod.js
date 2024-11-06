const modConfig = require("../../extend/config.json");
const getPrice = require("../exmod/getPrice");
const priceJson = require("../../res/price/price.json");
const extraJson = modConfig.extra;
const color = require("../models/ColorType");
class loadMod {

    infoload(mod) {

        if (JSON.stringify(priceJson.date)!==JSON.stringify(getPrice.getDate()) && extraJson.FleaMarket){
            getPrice.getPriceFun(mod,(result)=>{
                mod.Logger.log(result,color.MAGENTA);
                mod.Logger.log("如果同步的日期与当前游玩时间差距较大，请移步各大mod群前来催更！0_v_←",color.YELLOW);
            });
        }
        for (let option in modConfig) {
            let exmod = `../../extend/${option}/${option}.js`;
            if (mod.VFS.exists(__dirname + `/${exmod}`)) {
                require(exmod).loadExmod(option, modConfig[option], modConfig);
            }
        }
    }
}

module.exports = {load: new loadMod()};
