const color = require("../../src/models/ColorType");
const ConfigTypes = require("../../src/models/ConfigTypes");
const {mod} = require("../../src/MGUSmod");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const LocalesType = require("../../src/models/LocalesType");
const MGTraderJson = require("../config.json").MGTrader;
const addItemToDB = require("../../src/exmod/addItemToDB");
class MGTrader{
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.templates = mod.tables.templates;
        this.globals = mod.tables.globals;
        this.traders = mod.tables.traders;
        this.traderConf = mod.configServer.getConfig(ConfigTypes.TRADER);
        this.Insurance = mod.configServer.getConfig(ConfigTypes.INSURANCE);
        this.Inventory = mod.configServer.getConfig(ConfigTypes.INVENTORY);
        this.ragfairConf = mod.configServer.getConfig(ConfigTypes.RAGFAIR);
        this.pmcConfig = mod.configServer.getConfig(ConfigTypes.PMC);
        this.questConfig = mod.configServer.getConfig(ConfigTypes.QUEST);
        this.LocalesData = mod.tables.locales.global;
        this.profiles = this.templates.profiles;
        this.traderPath = __dirname + '/traders/';
        const TraderList = mod.JsonUtil.clone(mod.ImporterUtil.loadRecursive(this.traderPath));
        if (mod.VFS.exists(`${mod.modpath}bundles.json`)) {
            mod.VFS.removeFile(`${mod.modpath}bundles.json`);
        }
        let bundles = {
            "manifest": []
        }
        let allitemsList = {
            "StackSlots": {},
            "Slots": {},
            "Chambers": {},
            "Cartridges": {},
            "Grids": {}
        };
        for (let traderName in TraderList) {
            const traderInfo = TraderList[traderName][traderName];
            let traderId = traderInfo[traderName]._id;
            if (traderId in this.traders || traderId in Traders_1.Traders) {
                mod.Logger.log(`商人ID：${traderId}已存在，请更换ID重新加载`, color.RED);
            }
            else if (TraderList[traderName][traderName]) {
                if (traderInfo[traderName].enable) {
                    this.addTrader(mod, traderName, traderId, TraderList[traderName]);
                    Traders_1.Traders[traderId] = traderId;
                    let vars = this.addOthersToDb(mod, traderName, traderId, TraderList[traderName]);
                    let manifest = vars[0]
                    let FilterList = vars[1];
                    for (let type in FilterList) {
                        for (let id in FilterList[type]) {
                            allitemsList[type][id] = FilterList[type][id];
                        }
                    }
                    for (let it in manifest) {
                        bundles.manifest.push(manifest[it]);
                    }
                    if(traderId=="MarecGents"){
                        mod.Logger.log(`商人：${traderId}已加载\n《MG商人任务系列》由【奶糖菜菜鸭】和【MG】共同创作。感谢sepi酱对于任务系列前期的帮助！`, color.MAGENTA);
                    }
                    else{
                        mod.Logger.log(`商人：${traderName}已加载`, color.MAGENTA);
                    }
                }
            }
        }
        this.addItemToFilter(mod, allitemsList);
        mod.VFS.writeFile(`${mod.modpath}bundles.json`, JSON.stringify(bundles, null, 4));
        mod.Logger.log(`${mod.modname}：MG商人组已部署完毕！`, color.YELLOW);
    }
    addTrader(mod, traderName, traderId, traderData) {
        const baseDatas = mod.JsonUtil.clone(mod.ImporterUtil.loadRecursive(__dirname + '/db/'));
        this.addTraderToGame(mod, traderName, traderId, traderData, baseDatas);
        if(MGTraderJson.addItems){
            addItemToDB.getAllItem();
        }
    }
    addTraderToGame(mod, traderName, traderId, traderData, baseData) {
        let traderInfo = traderData[traderName];
        let TraderImage = `${traderName}.jpg`;
        baseData.base._id = traderId;
        const imagePath = this.traderPath + `${traderName}`;
        if (mod.VFS.exists(`${imagePath}/${TraderImage}`)) {
            baseData.base.avatar = baseData.base.avatar.replace("unknown", traderName);
            mod.ImageRouter.addRoute(baseData.base.avatar.replace(".jpg", ""), `${imagePath}/${TraderImage}`);
        }
        else {
            mod.Logger.log(`${traderName}:混蛋！你把我的头像放哪了！快还给我！`, color.YELLOW);
        }
        baseData.base._id = traderId;
        for (let loca in traderInfo[traderName].locales) {
            if (loca === "Description") {
                continue;
            }
            baseData.base[LocalesType[loca]] = traderInfo[traderName].locales[loca];
        }
        baseData.base.insurance.availability = !!traderInfo[traderName].insurance.enable;
        baseData.base.insurance.min_return_hour = traderInfo[traderName].insurance.minreturnTime;
        baseData.base.insurance.max_return_hour = traderInfo[traderName].insurance.maxreturnTime;
        baseData.base.insurance.max_storage_time = traderInfo[traderName].insurance.storageTime ? traderInfo[traderName].insurance.storageTime : 100;
        baseData.base.repair.availability = !!traderInfo[traderName].repair.enable;
        baseData.base.repair.quality = traderInfo[traderName].repair.quality?traderInfo[traderName].repair.quality:"1"
        baseData.base.repair.currency_coefficient = traderInfo[traderName].repair.coefficient?traderInfo[traderName].repair.coefficient:3;
        baseData.base.medic = !!traderInfo[traderName].medic;
        baseData.base.loyaltyLevels = traderInfo[traderName].loyaltyLevels.range?traderInfo[traderName].loyaltyLevels.range:baseData.base.loyaltyLevels;
        baseData.base.discount = traderInfo[traderName].discount?traderInfo[traderName].discount:0;
        baseData.base.unlockedByDefault = !!traderInfo[traderName].unlockedDefault;

        if ("Message" in traderInfo[traderName].insurance) {
            for (let mesType in traderInfo[traderName].insurance.Message) {
                let messList = [];
                for (let mes in traderInfo[traderName].insurance.Message[mesType]) {
                    let message = `${traderId} ${mesType} ${mes}`;
                    messList.push(message);
                    for(let lang in this.LocalesData){
                        this.LocalesData[lang][message] = traderInfo[traderName].insurance.Message[mesType][mes];
                    }
                }
                baseData.dialogue[mesType] = messList;

            }
        }

        if (traderData.traderData) {
            baseData.assort = traderData.traderData.assort ? traderData.traderData.assort : baseData.assort;
            baseData.dialogue = traderData.traderData.dialogue ? traderData.traderData.dialogue : baseData.dialogue;
            baseData.questassort = traderData.traderData.questassort ? traderData.traderData.questassort : baseData.questassort;

        }

        this.traders[baseData.base._id] = {
            base: baseData.base,
            assort: baseData.assort,
            dialogue: baseData.dialogue,
            questassort: baseData.questassort
        };
        const traderUpdateTime = {
            _name:traderInfo[traderName].locales.Nickname,
            traderId: baseData.base._id,
            seconds: traderInfo[traderName].updateTime ? traderInfo[traderName].updateTime : {min:3600,max:3600}
        };

        this.traderConf.updateTime.push(traderUpdateTime);
        this.Insurance.returnChancePercent[baseData.base._id] = traderInfo[traderName].insurance.chance ? traderInfo[traderName].insurance.chance : 80;
        this.ragfairConf.traders[baseData.base._id] = true;
        const traderWhitelist = {
            "traderId": baseData.base._id,
            "name": traderInfo[traderName].locales.Nickname,
            "questTypes": [
                "Completion",
                "Exploration",
                "Elimination"
            ],
            "rewardBaseWhitelist": [
                "543be6564bdc2df4348b4568",
                "5485a8684bdc2da71d8b4567",
                "590c745b86f7743cc433c5f2",
                "57864c322459775490116fbf",
                "57864a66245977548f04a81f"
            ],
            "rewardCanBeWeapon": true,
            "weaponRewardChancePercent": 20
        };
        this.questConfig.repeatableQuests[0].traderWhitelist.push(traderWhitelist);
        this.questConfig.repeatableQuests[1].traderWhitelist.push(traderWhitelist);
        for(let profType in this.profiles){
            let prof = this.profiles[profType];
            let Sides = ["bear", "usec"];
            for(let side of Sides){
                prof[side].trader.initialLoyaltyLevel[baseData.base._id]=1;
            }
        }
        for (let loc in traderInfo[traderName].locales) {
            for(let lang in this.LocalesData){
                this.LocalesData[lang][`${baseData.base._id} ${loc}`] = traderInfo[traderName].locales[loc];
            }
        }
    }
    addOthersToDb(mod, traderName, traderId, traderData) {
        let manifest = [];
        let itemFilter = {
            "StackSlots": {},
            "Slots": {},
            "Chambers": {},
            "Cartridges": {},
            "Grids": {}
        }
        if (traderData.items) {
            for (let it in traderData.items) {
                let item_ = traderData.items[it];
                if("pmcEquipment" in item_){
                    if(!item_.pmcEquipment){
                        this.pmcEquipmentBlackList(item_.item._id);
                    }
                }
                else{
                    this.pmcEquipmentBlackList(item_.item._id);
                }
                if(!(item_.item._id in this.templates.items)){
                    this.templates.items[item_.item._id] = item_.item;
                    if(item_.Type && item_.origin){
                        let Type = item_.Type
                        if(typeof(Type) === "string"){
                            itemFilter[Type][item_.item._id] = item_.origin
                        }
                        else if (Type.length > 1){
                            for(let type in Type){
                                itemFilter[Type[type]][item_.item._id] = item_.origin
                            }
                        }
                    }
                }
            }
        }
        if ("handbook" in traderData.templates) {
            for (let hd in traderData.templates.handbook) {
                this.templates.handbook.Items.push(traderData.templates.handbook[hd]);
            }
        }
        if ("quests" in traderData.templates) {
            for (let qt in traderData.templates.quests) {
                this.templates.quests[qt] = traderData.templates.quests[qt]
            }
        }
        if ("globals" in traderData) {
            for (let buff in traderData.globals.Buffs) {
                if(!(buff in this.globals.config.Health.Effects.Stimulator.Buffs)){
                    this.globals.config.Health.Effects.Stimulator.Buffs[buff] = traderData.globals.Buffs[buff];
                }
            }
            for (let master in traderData.globals.Mastering_Templates) {
                this.globals.config.Mastering[13].Templates.push(master);
            }
            if("ItemPresets" in traderData.globals){
                for(let presetId in traderData.globals.ItemPresets){
                    this.globals.ItemPresets[presetId] = traderData.globals.ItemPresets[presetId];
                }
            }
        }
        if("images" in traderData){
            for (let imgType in traderData.images) {
                let iconPath = this.traderPath + `${traderName}/images/${imgType}`;
                if(imgType === "quests"){
                    let iconList = mod.VFS.getFiles(iconPath);
                    for (let icon of iconList) {
                        const filename = mod.VFS.stripExtension(icon);
                        mod.ImageRouter.addRoute(`/files/quest/icon/${filename}`, `${iconPath}/${icon}`);
                    }
                }
            }
        }
        if ("mail" in traderData.locales) {
            for(let des in traderData.locales.mail){
                for(let lang in this.LocalesData){
                    if(!(des in this.LocalesData[lang])){
                        this.LocalesData[lang][des] = traderData.locales.mail[des];
                    }
                }

            }
        }
        if ("itemsdescription" in traderData.locales) {
            for (let itemsdes in traderData.locales.itemsdescription) {
                for (let key in traderData.locales.itemsdescription[itemsdes]) {
                    for(let lang in this.LocalesData){
                        if(!(`${itemsdes} ${key}` in this.LocalesData[lang])){
                            this.LocalesData[lang][`${itemsdes} ${key}`] = traderData.locales.itemsdescription[itemsdes][key];
                        }
                        else{
                            mod.Logger.log(`${itemsdes} ${key}已存在于 ${lang}.json, 请重新修改独立物品信息！`,color.RED);
                        }
                    }
                }
            }
        }
        if ("bundles" in traderData) {
            for (let bd in traderData.bundles.manifest) {
                manifest.push(traderData.bundles.manifest[bd])
            }
            let rootbundles = {
                "manifest": manifest
            }
        }
        if("weaponbuilds" in traderData.templates){
            let weaponbuilds = traderData.templates.weaponbuilds;
            for(let wbId in weaponbuilds){
                this.globals.ItemPresets[wbId] = weaponbuilds[wbId];
            }
        }
        if("randomContainer" in traderData.templates && "db" in traderData.templates){
            if ("rC_items" in traderData.templates.db){
                for(let rCId in traderData.templates.randomContainer){
                    let rCInfo = traderData.templates.randomContainer[rCId];
                    let baserC = traderData.templates.db.rC_items;
                    baserC._id = rCId;
                    baserC._name = rCId;
                    baserC._props.Prefab = rCInfo.Prefab;
                    baserC._props.Width = rCInfo.Width;
                    baserC._props.Height = rCInfo.Height;
                    baserC._props.Grids[0]._id = rCId+"_Grids_id";
                    baserC._props.Grids[0]._parent = rCId;
                    baserC._props.Name = rCInfo.locales.Name;
                    baserC._props.ShortName = rCInfo.locales.ShortName;
                    baserC._props.Description = rCInfo.locales.Description;
                    this.templates.items[rCId] = baserC;

                    for(let key in rCInfo.locales){
                        for(let lang in this.LocalesData){
                            if(!(`${rCId} ${key}` in this.LocalesData[lang])){
                                this.LocalesData[lang][`${rCId} ${key}`] = rCInfo.locales[key];
                            }
                        }
                    }

                    this.Inventory.randomLootContainers[rCId] = rCInfo.setup;

                    let AssortInfo = {
                        Id:rCId,
                        Price:rCInfo.Price,
                        Leval:rCInfo.Leval
                    }
                    this.addAssortToTrader(mod, traderName, traderId,AssortInfo);
                }
            }
        }

        // 修复商人assort的问题
        const traderAssort = mod.JsonUtil.clone(this.traders[traderId].assort);
        let tAStr = JSON.stringify(traderAssort);
        for(let it in this.traders[traderId].assort.items){
            let randId = mod.HashUtil.generate();
            tAStr = this.replaceAll(tAStr,JSON.stringify(this.traders[traderId].assort.items[it]._id),JSON.stringify(randId))
        }
        this.traders[traderId].assort=JSON.parse(tAStr);

        return [manifest, itemFilter];
    }
    addItemToFilter(mod, FilterList) {
        for (const item in this.templates.items) {
            for (const types in FilterList) {
                if (Object.keys(FilterList[types]).length !== 0) {
                    if (this.templates.items[item]._props[types]) {
                        for (const type in this.templates.items[item]._props[types]) {
                            if (this.templates.items[item]._props[types][type]._props.filters.length !== 0) {
                                let idList = this.templates.items[item]._props[types][type]._props.filters[0].Filter
                                for (let id in FilterList[types]) {
                                    if (typeof (FilterList[types][id]) === "string") {
                                        if (idList.indexOf(FilterList[types][id]) >= 0) {
                                            this.templates.items[item]._props[types][type]._props.filters[0].Filter.push(id);
                                        }
                                    }
                                    else {
                                        for (let n in FilterList[types][id]) {
                                            if (idList.indexOf(FilterList[types][id][n]) >= 0) {
                                                this.templates.items[item]._props[types][type]._props.filters[0].Filter.push(id);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    pmcEquipmentBlackList(itmeId){
        const lootSlots = ['vestLoot', 'pocketLoot', 'backpackLoot'];
        for(let lS of lootSlots){
            if(!this.pmcConfig[lS]?.blacklist) continue;
            this.pmcConfig[lS].blacklist.push(itmeId);
        }
    }
    addAssortToTrader(mod, traderName, traderId, AssortInfo){
        const randId = mod.HashUtil.generate();
        let TraderAssort = this.traders[traderId].assort;
        TraderAssort.items.push({
            _id: randId,
            _tpl: AssortInfo.Id,
            parentId: 'hideout',
            slotId: 'hideout',
            upd: {
                UnlimitedCount: true,
                StackObjectsCount: 999999
            }
        })
        TraderAssort.barter_scheme[randId] = [[{
            "count":AssortInfo.Price,
            "_tpl":"5449016a4bdc2d6f028b456f"
        }]]
        TraderAssort.loyal_level_items[randId] = AssortInfo.Leval;
    }

    escapeRegExp(string) {
        // 转义正则表达式中的特殊字符
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个匹配的字符串
    }
    replaceAll(str, searchValue, newValue) {
        // searchValue = JSON.stringify(searchValue);
        // newValue = JSON.stringify(newValue);
        // 对searchValue进行转义，以避免正则表达式特殊字符的问题
        const escapedSearchValue = this.escapeRegExp(searchValue);
        // 构建带有全局标志的正则表达式
        const regex = new RegExp(escapedSearchValue, 'g');
        // 使用replace方法进行替换
        return str.replace(regex, newValue);
    }
}
module.exports = new MGTrader();