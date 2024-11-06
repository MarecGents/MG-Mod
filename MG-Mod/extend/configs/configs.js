const {mod} = require('../../src/MGUSmod');
const ConfigTypes = require('../../src/models/ConfigTypes');
const configJson = require('../config.json').configs;

class configClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeConfigs();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeConfigs() {

        const Configs = mod.configServer;
        let ragfairs = Configs.getConfig(ConfigTypes.RAGFAIR);
        let traders = Configs.getConfig(ConfigTypes.TRADER);
        let CIne = Configs.getConfig(ConfigTypes.INSURANCE);
        let bots = Configs.getConfig(ConfigTypes.BOT);
        let pmc = Configs.getConfig(ConfigTypes.PMC);
        let inventory = Configs.getConfig(ConfigTypes.INVENTORY);
        let inraid = Configs.getConfig(ConfigTypes.INRAID);
        let location = Configs.getConfig(ConfigTypes.LOCATION);
        let repair = Configs.getConfig(ConfigTypes.REPAIR);
        let airdrop = Configs.getConfig(ConfigTypes.AIRDROP);
        let weather = Configs.getConfig(ConfigTypes.WEATHER);

        //商人config

        traders.updateTimeDefault = configJson.updateTimeDefault;

        for (let trader in traders) {
            //商人商品刷新    商人出货时间
            if (trader === "updateTime") {
                for (let i in traders[trader]) {
                    let it = traders[trader];
                    it[i].seconds.min = configJson.updateTime;
                    it[i].seconds.max = configJson.updateTime;
                }
            }
            if (trader === "purchasesAreFoundInRaid" && configJson.newItemsMarkedFound){
                traders[trader] = configJson.newItemsMarkedFound;
            }
            //黑商修改  黑商出货量
            if (trader === "fence" && configJson.fence.enable) {
                let fence = traders[trader];
                // 黑商出货刷新时间
                fence.partialRefreshTimeSeconds = configJson.fence.partialRefreshTimeSeconds;

                // 整枪出售数量限制
                fence.weaponPresetMinMax = configJson.fence.maxPresetsPercent;

                // 整枪出售价格倍率
                fence.presetPriceMult = configJson.fence.presetPriceMult;
                fence.itemPriceMult = configJson.fence.itemPriceMult;

                // 部分刷新百分比
                fence.partialRefreshChangePercent = 30;
                // 每类物品数量限制
                fence.itemTypeLimits = configJson.fence.itemTypeLimits;
                let assortSize = 0;
                for (let id in fence.itemTypeLimits) {
                    assortSize += fence.itemTypeLimits[id];
                }
                // 出售物品数量限制
                fence.assortSize = assortSize + 20;
                // 预设最大耐久百分比
                fence.weaponDurabilityPercentMinMax = configJson.fence.weaponDurabilityPercentMinMax;
                // 护甲最大耐久百分比
                fence.armorMaxDurabilityPercentMinMax = configJson.fence.armorMaxDurabilityPercentMinMax;
                // 限制特定物品出售堆叠数  通过ID
                fence.itemStackSizeOverrideMinMax = {};
                // fence.blacklistSeasonalItems = false;
                // 不可出售物品
                // fence.blacklist = [
                //     "5c110624d174af029e69734c"
                // ];
            }
        }
        //跳蚤config
        for (let ragfair in ragfairs) {
            if (ragfair === "sell") {
                //出售概率
                if (configJson.chance.enable) {
                    ragfairs[ragfair].chance.base = configJson.chance.base;//基础概率
                    ragfairs[ragfair].chance.sellMultiplier = 2;
                    ragfairs[ragfair].chance.maxSellChancePercent = 100;
                    ragfairs[ragfair].chance.minSellChancePercent = 100;
                }
                //出售时间
                if (configJson.time.enable) {
                    ragfairs[ragfair].time.min = configJson.time.min;
                    ragfairs[ragfair].time.max = configJson.time.max;
                }
            }
            //动态跳蚤
            if (ragfair === "dynamic") {
                let dynamic = ragfairs[ragfair];
                // 购买物品带钩
                if(configJson.newItemsMarkedFound){
                    dynamic.purchasesAreFoundInRaid = configJson.newItemsMarkedFound;
                }
                // 跳蚤购买优化
                if (configJson.dynamic.FleaOptimize.enable) {
                    // 跳蚤不可堆叠物品出售数量
                    dynamic.nonStackableCount = configJson.dynamic.FleaOptimize.nonStackableCount;
                    // 跳蚤可堆叠物品出售数量
                    dynamic.stackablePercent = configJson.dynamic.FleaOptimize.stackablePercent;
                    // // 跳蚤显示为单个物品的
                    // dynamic.showAsSingleStack = configJson.dynamic.FleaOptimize.showAsSingleStack;
                    // 护甲没有插板概率
                    dynamic.armor.removeRemovablePlateChance = configJson.dynamic.FleaOptimize.armor.removeRemovablePlateChance;
                }
                // 跳蚤市场物品全新
                if (configJson.dynamic.condition) {
                    for(let it in dynamic.condition){
                        dynamic.condition[it].conditionChance = 0;
                    }
                }
                // 禁用BSG黑名单
                if (!configJson.dynamic.blacklistEnable) {
                    dynamic.blacklist.enableBsgList = configJson.dynamic.blacklistEnable;
                }
            }
        }
        //俄商、大妈百分百回保
        if (configJson.returnChance.enable) {
            for (let traderId in CIne.returnChancePercent) {
                CIne.returnChancePercent[traderId] = 100;
            }
            CIne.runIntervalSeconds = configJson.returnChance.runIntervalSeconds;
        }

        //bot刷新数提高
        for (let botcap in bots.maxBotCap) {
            bots.maxBotCap[botcap] += configJson.botmod.botadd;
        }

        // pmc 同阵营敌视百分比.
        pmc.chanceSameSideIsHostilePercent = configJson.botmod.chanceSameSideIsHostilePercent
        // pmc占比
        if (configJson.botmod.pmcPercent !== "default") {
            pmc.convertIntoPmcChance.default.assult={
                min: configJson.botmod.pmcPercent,
                max: configJson.botmod.pmcPercent
            };pmc.convertIntoPmcChance.factory4_day.assult={
                min: configJson.botmod.pmcPercent,
                max: configJson.botmod.pmcPercent
            };
        }

        //购买物品带钩
        inventory.newItemsMarkedFound = configJson.newItemsMarkedFound;
        // 关闭战局迷失，到时间了未撤离不算失败
        inraid.MIAOnRaidEnd = configJson.inraid.MIAOnRaidEnd;
        // 战局默认选项，在进入战局时仍然可以手动更改
        inraid.raidMenuSettings = {
            aiAmount: configJson.inraid.raidMenuSettings.aiAmount, // AI数量，可选参数：Low / Medium / High / Horde / AsOnline(默认值)
            aiDifficulty: configJson.inraid.raidMenuSettings.aiDifficulty, // AI难度，可选参数：Easy / Medium / Hard / Impossible / Random / AsOnline(默认值)
            bossEnabled: configJson.inraid.raidMenuSettings.bossEnabled, // 开启boss
            scavWars: configJson.inraid.raidMenuSettings.scavWars, // scav内战
            taggedAndCursed: configJson.inraid.raidMenuSettings.taggedAndCursed, // 标记诅咒
            enablePve: configJson.inraid.raidMenuSettings.enablePve // PVE模式
        };
        //武器不消耗耐久
        inraid.save.durability = configJson.inraid.save.durability;

        // 容器内物资倍率
        let loosesets = location.looseLootMultiplier;
        for (let looseset in loosesets) {
            if (loosesets[looseset] === 0) {
                loosesets[looseset] = 1;
            }
            loosesets[looseset] = loosesets[looseset] * configJson.LootMultiplier.container;
        }
        // 地面物资倍率
        let staticsets = location.staticLootMultiplier;
        for (let staticset in staticsets) {
            if (staticsets[staticset] === 0) {
                staticsets[staticset] = 1;
            }
            staticsets[staticset] = staticsets[staticset] * configJson.LootMultiplier.static;
        }

        //容器随机生成设置
        location.containerRandomisationSettings.enabled=false;

        let repairBuff = repair.repairKit
        // 100%护甲附魔
        if (configJson.BuffSettings.AmmoBuff !== "default") {
            let chance = configJson.BuffSettings.AmmoBuff;
            repairBuff.armor.rarityWeight = {
                "common": chance/100,
                "rare": chance/100
            };
            repair.repairKitIntellectGainMultiplier.armor = chance;
            repair.armorKitSkillPointGainPerRepairPointMultiplier *= chance;
            repair.maxIntellectGainPerRepair.kit = chance;
        }
        // 100%枪械附魔
        if (configJson.BuffSettings.WeaponBuff !== "default") {
            let chance = configJson.BuffSettings.WeaponBuff;
            repairBuff.weapon.rarityWeight = {
                "common": chance/100,
                "rare": chance/100
            };
            repair.repairKitIntellectGainMultiplier.weapon = chance;
            repair.weaponSkillRepairGain *= chance;
            repair.maxIntellectGainPerRepair.kit = chance;
        }
        // 其他附魔
        // if (configJson.BuffSettings.Otherwise !== "default") {
        //     let chance = configJson.BuffSettings.Otherwise;
        //     repairBuff.vest.rarityWeight = {
        //         "common": chance/100,
        //         "rare": chance/100
        //     };
        //     repairBuff.headwear.rarityWeight = {
        //         "common": chance/100,
        //         "rare": chance/100
        //     };
        // }

        //空投修改
        if (configJson.airdrop.airdropChancePercent !== "default") {
            //空投100%
            for (let map in airdrop.airdropChancePercent) {
                airdrop.airdropChancePercent[map] = configJson.airdrop.airdropChancePercent;
            }
            airdrop.airdropMinStartTimeSeconds = 0;
        }
        //空投种类
        if (configJson.airdrop.airdropType !== "default") {
            let Type = configJson.airdrop.airdropType;
            let Weight = airdrop.airdropTypeWeightings;
            if (Type === "moreWeapon") {
                Weight.weaponArmor = 12;
            }
            else if (Type === "moreFoodMedical") {
                Weight.foodMedical = 12;
            }
            else if (Type === "moreBarter") {
                Weight.barter = 12;
            }
            else if (Type === "moreMixed") {
                Weight.mixed = 9;
            }
        }
        //空投下降速度
        if (configJson.airdrop.crateFallSpeed !== "default") {
            airdrop.crateFallSpeed = configJson.airdrop.crateFallSpeed;
        }

        // 天气修改
        if (configJson.weather.OverAll !== "default") {
            // 云
            weather.weather.clouds = {
                values: configJson.weather.clouds.values,
                weights: configJson.weather.clouds.weights,
            };
            // 风
            weather.weather.windSpeed = {
                values: configJson.weather.windSpeed.values,
                weights: configJson.weather.windSpeed.weights
            };
            // 雨
            weather.weather.rain = {
                values: configJson.weather.rain.values,
                weights: configJson.weather.rain.weights
            };
            weather.weather.rainIntensity = configJson.weather.rainIntensity;
            // 雾
            weather.weather.fog = {
                values: configJson.weather.fog.values,
                weights: configJson.weather.fog.weights
            };
        }
    }
}

module.exports = new configClass();