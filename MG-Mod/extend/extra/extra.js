const {mod} = require('../../src/MGUSmod');
const MapChName = require('../../res/Keys/MapChName.json');
const MapKey = require('../../res/Keys/MapKey.json');
const extraJson = require('../config.json').extra;
const priceJson = require('../../res/price/price.json');
const profileJson = require("./db/profile.json");

class extraClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeExtra();
        // mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeExtra() {
        if (typeof (extraJson.KeyNameExpand) === "boolean" && extraJson.KeyNameExpand) {
            let handbook = mod.tables.templates.handbook;
            let handCate = handbook.Categories;
            let handItem = handbook.Items;
            let Language = mod.tables.locales.global;
            let oriParentID = ["5c518ec986f7743b68682ce2", "5c518ed586f774119a772aee"];

            let MapNameToNewId = {};
            for (let Mapname in MapChName) {
                let newMapId = mod.HashUtil.generate()
                MapNameToNewId[Mapname] = newMapId;
                for (let lang in Language) {
                    Language[lang][newMapId] = MapChName[Mapname];
                }
                let newCate = {
                    "Id": newMapId,
                    "ParentId": "5b47574386f77428ca22b342",
                    "Icon": "/files/handbook/icon_keys_mechanic.png",
                    "Color": "",
                    "Order": "100"
                };
                handCate.push(newCate)
            }
            for (let keys in handItem) {
                let parentId = handItem[keys].ParentId;
                if (oriParentID.includes(parentId)) {
                    let id = handItem[keys].Id;
                    if (id === "64d4b23dc1b37504b41ac2b6") {
                        handItem[keys].Price = 5130400
                    }
                    for (let Mapname in MapKey) {
                        if (MapKey[Mapname].includes(id)) {
                            handItem[keys].ParentId = MapNameToNewId[Mapname];
                            for (let lang in Language) {
                                Language[lang][`${id} Name`] = Language[lang][`${id} Name`] + ` ${MapChName[Mapname]}`;
                                let keyinfo = "<color=#00cccc><b>" + MapChName[Mapname] + "</b></color>\r\n"
                                // ch[`${id} Description`] = ch[`${id} Description`] + `\n\n${MapChName[Mapname]}`;
                                Language[lang][`${id} Description`] = keyinfo.concat(Language[lang][`${id} Description`]);
                            }

                        }
                    }
                }
            }
            mod.Logger.log(`${mod.modname}："钥匙分类" 功能已开启`, 'yellow');
        }
        if (typeof (extraJson.FleaMarket) === "boolean" && extraJson.FleaMarket) {
            let prices = mod.tables.templates.prices
            let pricesJson = priceJson.prices;
            for (let id in pricesJson) {
                if (id in prices || pricesJson[id] > 0) {
                    prices[id] = pricesJson[id];
                }
            }
            mod.Logger.log(`${mod.modname}："实时跳蚤" 功能已开启`, 'yellow');
            mod.Logger.log(`注:当前实时跳蚤数据获取时间为：${priceJson.date[0]}年 ${priceJson.date[1]}月 ${priceJson.date[2]}日。`, "blue");
        }
        if (typeof (extraJson.newProfile) === "boolean" && extraJson.newProfile) {
            for (let pf in profileJson.profiles) {
                mod.tables.templates.profiles[pf] = profileJson.profiles[pf];
            }
            for (let Lang in mod.tables.locales.server) {
                for (let des in profileJson.desc) {
                    mod.tables.locales.server[Lang][des] = profileJson.desc[des];
                }
            }
        }
    }
}

module.exports = new extraClass();