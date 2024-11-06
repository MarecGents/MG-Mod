const {mod} = require('../../src/MGUSmod');

const globalJson = require('../config.json').globals;

class globalsClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeGlobals();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeGlobals() {
        // let tables = mod.databaseServer.getTables();
        let globals = mod.tables.globals;
        let Glconf = globals.config;
        // 幸存撤离最短时间要求(秒)
        Glconf.exp.match_end.survived_seconds_requirement = globalJson.survived_seconds_requirement;
        // 跳蚤访问等级，默认15
        Glconf.RagFair.minUserLevel = globalJson.RagFair.minUserLevel;
        if(globalJson.RestrictionsInRaid){// 去除战局携带限制
            Glconf.RestrictionsInRaid = [];
        }
        // Scav优化
        if(globalJson.ScavOptimize.enable){
            //SCAV冷却时间
            Glconf.SavagePlayCooldown = globalJson.ScavOptimize.SavagePlayCooldown;
            //SCAV剩余冷却时间
            Glconf.SavagePlayCooldownNdaFree = globalJson.ScavOptimize.SavagePlayCooldownNdaFree;
            //减少SCAV冷却时间
            Glconf.SavagePlayCooldownDevelop = globalJson.ScavOptimize.SavagePlayCooldownDevelop;
        }
        //极低税率
        if(globalJson.RagFair.TaxRate.enable){
            Glconf.RagFair.communityTax = globalJson.RagFair.TaxRate.communityTax;
            Glconf.RagFair.communityItemTax = globalJson.RagFair.TaxRate.communityItemTax;
            Glconf.RagFair.communityRequirementTax = globalJson.RagFair.TaxRate.communityRequirementTax;
        }
        //跳蚤交易单倍率
        for (let Offers of Glconf.RagFair.maxActiveOfferCount) {
            Offers.count = Offers.count * globalJson.RagFair.count_Magnification;
        }
        //压弹速度
        Glconf.BaseLoadTime = globalJson.BaseLoadTime;
        //卸弹速度
        Glconf.BaseUnloadTime = globalJson.BaseUnloadTime;

        //超人模式
        if(globalJson.stamina.godmod){
            //基础恢复速度
            Glconf.Stamina.BaseRestorationRate = globalJson.stamina.BaseRestorationRate;
            //腿部耐力
            Glconf.Stamina.Capacity = globalJson.stamina.Capacity;
            //手部耐力
            Glconf.Stamina.HandsCapacity = globalJson.stamina.HandsCapacity;
            //氧气耐力
            Glconf.Stamina.OxygenCapacity = globalJson.stamina.OxygenCapacity;
            //氧气恢复速度
            Glconf.Stamina.OxygenRestoration = globalJson.stamina.OxygenRestoration;
            //压弹速度
            Glconf.BaseLoadTime = 0.01;
            //卸弹速度
            Glconf.BaseUnloadTime = 0.01;
        }
        // 物资倍率
        Glconf.GlobalItemPriceModifier = globalJson.LootMultiplier.Valuable;
        Glconf.GlobalLootChanceModifier = globalJson.LootMultiplier.Total;

        //护甲维修无损耗
        if(globalJson.RepairDegradation){
            for (let AMs in Glconf.ArmorMaterials) {
                Glconf.ArmorMaterials[AMs].MinRepairDegradation = 0; //商人
                Glconf.ArmorMaterials[AMs].MaxRepairDegradation = 0;
                Glconf.ArmorMaterials[AMs].MinRepairKitDegradation = 0; //维修包
                Glconf.ArmorMaterials[AMs].MaxRepairKitDegradation = 0;
            }
        }
        let skillsettings = Glconf.SkillsSettings;
        //100%护甲附魔
        if(globalJson.BuffSettings.AmmoBuff!=="default"){
            let chance = globalJson.BuffSettings.AmmoBuff
            skillsettings.HeavyVests.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.HeavyVests.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.HeavyVests.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.HeavyVests.BuffSettings.ReceivedDurabilityMaxPercent = chance/100;

            skillsettings.LightVests.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.LightVests.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.LightVests.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.LightVests.BuffSettings.ReceivedDurabilityMaxPercent = chance/100;

            skillsettings.Melee.BuffSettings.CommonBuffChanceLevelBonus = chance/100;
            skillsettings.Melee.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.Melee.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.Melee.BuffSettings.ReceivedDurabilityMaxPercent = chance/100;
        }
        //100%枪械附魔
        if(globalJson.BuffSettings.WeaponBuff!=="default"){
            let chance = globalJson.BuffSettings.WeaponBuff
            skillsettings.WeaponTreatment.BuffSettings.CommonBuffMinChanceValue = chance/100;
            skillsettings.WeaponTreatment.BuffSettings.RareBuffChanceCoff = chance/100;
            skillsettings.WeaponTreatment.SkillPointsPerRepair = 1000;
        }
        // 暗改优化：基础后座、手臂晃动、枪口上扬、受击屏幕晃动
        // Glconf.Aiming.RecoilBackBonus = 2;
        // Glconf.Aiming.RecoilVertBonus = 2;
        // Glconf.Aiming.RecoilHandDamping = 0.1;
        // Glconf.Aiming.RecoilConvergenceMult = 1.5;
        // Glconf.AimPunchMagnitude = 10;

        // 练技能速度
        if(globalJson.SkillExperience){
            Glconf.SkillEnduranceWeightThreshold = 0.65;   // 耐力技能增长条件：0.1*最大负重时
            Glconf.SkillFatiguePerPoint = 1.1;    // 疲劳因子  >=1 则没有疲劳
            Glconf.SkillFatigueReset = 200;   // 疲劳结束冷却时间 (s)
            Glconf.SkillFreshEffectiveness = 3;   // 疲劳冷却后 技能升级加速300%
            Glconf.SkillMinEffectiveness = 1;   //最低获得技能点数
            Glconf.SkillPointsBeforeFatigue = 10; //技能疲劳前可以升多少级

            Glconf.SkillsSettings.SkillProgressRate = 2 //全局技能速率
            // Glconf.SkillsSettings.WeaponSkillProgressRate = 2 //全局武器技能速率
            // Glconf.SkillsSettings.WeaponSkillRecoilBonusPerLevel = 2 //每级的全局武器技能速率加成
        }

    }
}

module.exports = new globalsClass();