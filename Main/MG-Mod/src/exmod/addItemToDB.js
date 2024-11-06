const {mod} = require("../MGUSmod");
const color = require("../models/ColorType");
const colorBG = require("../models/ColorBGType");
const addAssortToTrader = require("./assortToTrader");
const ConfigTypes = require("../models/ConfigTypes");

class addItemToDB {

    getAllItem(){
        const totalItem = mod.JsonUtil.clone(mod.ImporterUtil.loadRecursive(mod.itemDBpath));
        this.itemPath = mod.itemDBpath + "MGItem/";
        this.broItemPath = mod.itemDBpath + "BrothersItem/";
        this.superItemPath = mod.itemDBpath+"SuperModItem/";
        if("BrothersItem" in totalItem){
            const broItem = mod.JsonUtil.clone(mod.ImporterUtil.loadRecursive(this.broItemPath));
            this.brotherItemToMG(broItem);
        }
        if("SuperModItem" in totalItem){
            const superItem = mod.JsonUtil.clone(mod.ImporterUtil.loadRecursive(this.superItemPath));
            this.superItemToMG(superItem);
        }
        const mgItem = mod.JsonUtil.clone(mod.ImporterUtil.loadRecursive(this.itemPath));
        let newItemList = this.addItemToDB(mgItem);

        this.addFilterToDB(newItemList);
        addAssortToTrader.getItemList(newItemList);
    }
    brotherItemToMG(broItemList){
        const broItem = ["newId", "itemTplToClone", "overrideProperties", "locales"];
        for(const it in broItemList){
            const item = broItemList[it];
            let errorKey = [];
            for(let bI in broItem){
                if(!(broItem[bI] in item)){
                    errorKey.push(broItem[bI]);
                }
            }
            if(errorKey.length>0){
                mod.Logger.log(`三兄贵独立物品：${it}缺少必要字段:${errorKey},请重新检查格式。`,color.RED, colorBG.CYANBG);
                continue;
            }
            let newitem = {"items":{}};
            newitem.items.newId = item.newId;
            newitem.items.cloneId = item.itemTplToClone;
            newitem.items._props = item.overrideProperties;
            newitem.price = item.fleaPriceRoubles||item.fleaPriceRoubles.CreditsPrice||10000;
            newitem["description"] = {
                "name":item.locales.ch.name||"unknown",
                "shortName":item.locales.ch.shortName||"unknown",
                "description":item.locales.ch.description||"unknown"
            };
            if("Buffs" in item && item.Buffs){
                newitem.Buffs = item.Buffs;
            }
            mod.VFS.writeFile(`${this.itemPath}${it}-bro.json`,JSON.stringify(newitem, null, 4));
            mod.VFS.removeFile(mod.itemDBpath+`BrothersItem/${it}.json`);
        }

    }
    superItemToMG(superItemList){
        const superItem = ["tpl", "items", "handbook"];
        for(const it in superItemList){
            let item = superItemList[it];
            let newitem = {}
            let errorKey = [];
            for(let sI in superItem){
                if(!(superItem[sI] in item)){
                    errorKey.push(superItem[sI]);
                }
            }
            if(errorKey.length>0){
                mod.Logger.log(`超模独立物品：${it}缺少必要字段：${errorKey},请重新检查格式。`,color.RED, colorBG.CYANBG);
                continue;
            }
            newitem["items"] = {};
            newitem["items"]["newId"] = item.items._id;
            newitem["items"]["cloneId"] = item.tpl;
            newitem["items"]["_props"] = item.items._props;
            newitem["price"] = item.handbook.Price||item.items._props.CreditsPrice;
            newitem["description"] = {
                "name":item.items._props.Name||"unknown",
                "shortName":item.items._props.ShortName||"unknown",
                "description":item.items._props.Description||"unknown"
            };
            if("Buffs" in item && item.Buffs){
                newitem["Buffs"] = item.Buffs;
            }
            mod.VFS.writeFile(`${this.itemPath}${it}-super.json`,JSON.stringify(newitem, null, 4));
            mod.VFS.removeFile(mod.itemDBpath+`SuperModItem/${it}.json`);
        }
    }
    addItemToDB(itemList){
        let newItemList = {};
        const MGItem = ["items", "price", "description"];
        const MGItem_items = ["cloneId", "_props"];
        let itemDB = mod.tables.templates.items;
        let handbookDB = mod.tables.templates.handbook.Items;
        let pricesDB = mod.tables.templates.prices;
        let Language = mod.tables.locales.global;
        let globals = mod.tables.globals;
        let globalsBuffs = globals.config.Health.Effects.Stimulator.Buffs;
        let pmcConfig = mod.configServer.getConfig(ConfigTypes.PMC);
        for(let it in itemList){
            const item = itemList[it];

            //纠错段
            let errorKey1 = [];
            let errorKey2 = [];
            for(let MGI in MGItem){
                let key = MGItem[MGI];
                if(!(key in item)){
                    errorKey1.push(key);
                }
            }
            if(errorKey1.length>0){
                mod.Logger.log(`MG独立物品：${it}缺少必要字段:${errorKey1},请重新检查格式！`,color.RED, colorBG.CYANBG);
                continue;
            }
            for(let MGI_i in MGItem_items){
                let key = MGItem_items[MGI_i];
                if(!(key in item.items)){
                    errorKey2.push(key);
                }
            }
            if(errorKey2.length>0){
                mod.Logger.log(`MG独立物品：${it}缺少必要字段:${errorKey2},请重新检查格式！`,color.RED, colorBG.CYANBG);
                continue;
            }

            //复写段
            let itemId = item.items.newId;
            const itemcloneId = item.items.cloneId;
            const itemprops = item.items._props;
            if(!itemDB[itemcloneId]){
                mod.Logger.log(`无法找到MG独立物品：${it}.json的原型item，请重新检查文件信息`,color.BLUE, colorBG.WHITEBG);
                continue;
            }
            const itemparentId = itemDB[item.items.cloneId]._parent;

            //已存在此物品
            if(item[itemId]){
                for(const prop in itemprops){
                    item[itemId]._props[prop] = itemprops[prop];
                }
                const des = item.description;
                for(let lang in Language){
                    Language[lang][`${itemId} Name`] = des.name;
                    Language[lang][`${itemId} ShortName`] = des.shortName;
                    Language[lang][`${itemId} Description`] = des.description;
                }
                mod.Logger.log(`MG独立物品:已更新id:${itemId}物品的属性`, color.MAGENTA, colorBG.WHITEBG);
                continue;
            }

            const inHandbook = handbookDB.find(x => x.Id === itemcloneId);
            let newItemDetails = {
                "itemTplToClone": itemcloneId,
                "overrideProperties": itemprops,
                "parentId":itemparentId,
                "newId":itemId,
                "fleaPriceRoubles":item.price,
                "handbookPriceRoubles":item.price,
                "handbookParentId":inHandbook?inHandbook.ParentId:itemDB[itemcloneId]._parent,
                "locales":{}
            }
            newItemDetails.locales["ch"] = item.description;
            mod.CustomItemService.createItemFromClone(newItemDetails);
            this.inventoryBlackList(itemId);
            if(itemprops.StimulatorBuffs){
                const Buffname = itemprops.StimulatorBuffs;
                if(!(Buffname in globalsBuffs)){
                    if(item.Buffs){
                        if(Buffname in item.Buffs){
                            globalsBuffs[Buffname] = item.Buffs[Buffname];
                        }
                    }
                }
            }
            if("isSold" in item){
                if(item.isSold){
                    newItemList[itemId] = {
                        "cloneId":itemcloneId,
                        "parentId":itemparentId,
                        "Price":item.price,
                        "loyal_level":item.loyal_level?item.loyal_level:1,
                        "assort":item.assort?item.assort:false,
                        "toTrader": item.toTraderId || "MarecGents"
                    };
                }
            }
            else{
                newItemList[itemId] = {
                    "cloneId":itemcloneId,
                    "parentId":itemparentId,
                    "Price":item.price,
                    "loyal_level":item.loyal_level?item.loyal_level:1,
                    "assort":item.assort?item.assort:false,
                    "toTrader": item.toTraderId || "MarecGents"
                };
            }
            pricesDB[itemId] = item.price;
            const lootSlots = ['vestLoot', 'pocketLoot', 'backpackLoot'];
            for(let lS of lootSlots){
                if(!pmcConfig[lS]?.blacklist) continue;
                pmcConfig[lS].blacklist.push(itemId);
            }
            mod.Logger.log(`MG-Mod:已加载独立物品:${it}`, color.WHITE);
        }
        return newItemList;
    }
    addFilterToDB(newItemList){
        let itemsDB = mod.tables.templates.items;
        const FilterList = ["Slots", "Chambers", "Cartridges"];
        for (const item in itemsDB) {
            for (const types in FilterList) {
                const tp = FilterList[types];
                if (itemsDB[item]._props[tp] && itemsDB[item]._props[tp].length>0) {
                    for (const type in itemsDB[item]._props[tp]) {
                        if (itemsDB[item]._props[tp][type]._props.filters.length > 0) {
                            let idList = itemsDB[item]._props[tp][type]._props.filters[0].Filter
                            for(let nId in newItemList){
                                let keyId = newItemList[nId].cloneId;
                                if (idList.includes(keyId) && !idList.includes(nId)) {
                                    itemsDB[item]._props[tp][type]._props.filters[0].Filter.push(nId);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    inventoryBlackList(itemId){
        let pmcConfig = mod.configServer.getConfig(ConfigTypes.PMC);
        let botConfig = mod.configServer.getConfig(ConfigTypes.BOT);
        const lootSlots = ['vestLoot', 'pocketLoot', 'backpackLoot'];
        for(let lS of lootSlots){
            if(!pmcConfig[lS]?.blacklist) continue;
            pmcConfig[lS].blacklist.push(itemId);
        }
        if(this.parentList(itemId).includes("57bef4c42459772e8d35a53b")){
            this.equipmentBlackList(botConfig,itemId);
        }
    }

    equipmentBlackList(botConfig,itemId){
        for(let botType in botConfig.equipment){
            let equipment=botConfig.equipment[botType];
            if(!("blacklist" in equipment)){
                equipment["blacklist"] = [
                    {
                        "levelRange": {
                            "min": 1,
                            "max": 100
                        },
                        "equipment": {
                        },
                        "cartridge": {
                        }
                    }
                ];
            }
            for(let it in equipment.blacklist){
                let slotsBlacklist = equipment.blacklist[it].equipment;
                const AmmoPlate = ["Back_plate", "Front_plate", "Left_side_plate", "Right_side_plate","back_plate", "front_plate", "left_side_plate", "right_side_plate"];
                for(let AP in AmmoPlate){
                    if(!(AP in slotsBlacklist)) slotsBlacklist[AP] = []
                    if(itemId in slotsBlacklist[AP]) continue;
                    slotsBlacklist[AP].push(itemId);
                }
            }
        }

    }

    parentList(itemId){
        let itemDB = mod.tables.templates.items;
        let ids = itemId;
        let parentList = [];
        do{
            parentList.push(itemDB[ids]._parent);
            ids = itemDB[ids]._parent;
        }while(itemDB[ids]._parent);

        return parentList;
    }

}

module.exports = new addItemToDB();