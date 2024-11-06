const {mod} = require('../../src/MGUSmod');
const itemJson = require('../config.json').items;
const GPNVG = require('./db/GPNVG.json')
const T7 = require('./db/T7.json')

class itemClass {
    loadExmod(extend, options, config) {
        if (!options.enable) return;
        this.executeItems();
        mod.Logger.log(`${mod.modname}：已加载插件：[${extend}]`, 'yellow');
    }

    executeItems() {
        let items = mod.tables.templates.items;
        let language = mod.tables.locales.global;
        for (let item in items) {
            let itemId = items[item]._id,
                itemParent = items[item]._parent,
                itemProps = items[item]._props;
            // 物品全检视
            itemProps.ExaminedByDefault = itemJson.ExaminedByDefault;
            //武器栏可放全部武器
            if (itemId === "55d7217a4bdc2d86028b456d" && itemJson.AllWeaponInColumn) {
                //主武器栏
                itemProps.Slots.find(x => x._name === 'FirstPrimaryWeapon')._props.filters[0].Filter = ['5422acb9af1c889c16000029'];
                //副武器栏
                itemProps.Slots.find(x => x._name === 'SecondPrimaryWeapon')._props.filters[0].Filter = ['5422acb9af1c889c16000029'];
                //手枪栏
                itemProps.Slots.find(x => x._name === 'Holster')._props.filters[0].Filter = ['5422acb9af1c889c16000029'];
                //近战武器栏
                itemProps.Slots.find(x => x._name === 'Scabbard')._props.filters[0].Filter = [
                    '5422acb9af1c889c16000029',
                    '5447e1d04bdc2dff2f8b4567'
                ];
            }
            // 子弹
            let AmmoBlacklist = [
                "5656eb674bdc2d35148b457c",
                "5ede474b0c226a66f5402622",
                "5ede475b549eed7c6d5c18fb",
                "5ede4739e0350d05467f73e8",
                "5ede47405b097655935d7d16",
                "5ede475339ee016e8c534742",
                "5f0c892565703e5c461894e9",
                "62389aaba63f32501b1b444f",
                "62389ba9a63f32501b1b4451",
                "62389bc9423ed1685422dc57",
                "62389be94d5d474bf712e709",
                "635267f063651329f75a4ee8"
            ]
            if (itemParent === "5485a8684bdc2da71d8b4567") {
                if (itemJson.AmmoSetting.StackEnable) {
                    // 每个堆叠最大数量
                    itemProps.StackMaxSize = itemJson.AmmoSetting.StackMaxSize;
                    let stackmaxrandom = itemJson.AmmoSetting.StackMaxSize;
                    if (itemJson.AmmoSetting.StackMaxSize >= 100) {
                        itemProps.Weight = 0;
                        stackmaxrandom = 100;
                    }
                    if (itemJson.AmmoSetting.StackMaxSize >= 500) {
                        stackmaxrandom = 500;
                    }
                    if (AmmoBlacklist.includes(itemId)) {
                        itemProps.StackMinRandom = 1;
                        itemProps.StackMaxRandom = 20;
                    } else {
                        itemProps.StackMinRandom = 30;
                        itemProps.StackMaxRandom = stackmaxrandom;
                    }
                }
                // 子弹数据
                if (itemJson.AmmoSetting.Info) {
                    let retStr_ammo = "<color=#00cccc><b>肉伤：" + itemProps.Damage + "     甲伤：" + itemProps.ArmorDamage + "     穿甲：" + itemProps.PenetrationPower + "     穿透率：" + itemProps.PenetrationChanceObstacle + "     跳弹率：" + itemProps.RicochetChance + "     碎弹率：" + itemProps.FragmentationChance + "</b></color>\r\n";
                    for (let lang in language) {
                        language[lang][item + " Description"] = retStr_ammo.concat(language[lang][item + " Description"]);
                    }
                }
            }
            // 容器扩容
            const container = itemJson.Container;
            if (itemId in container) {
                // 容器扩容
                if (itemJson.Container[itemId].enable) {
                    let itemIssue = itemJson.Container[itemId]
                    itemProps.Grids[0]._props.cellsH = itemIssue.cellsH;
                    itemProps.Grids[0]._props.cellsV = itemIssue.cellsV;
                }
                // 容器兼容
                if (itemJson.Container[itemId].Filter) {
                    itemProps.Grids[0]._props.filters = [{Filter: ['54009119af1c881c07000029'], ExcludedFilter: []}];
                }
                // 无负重
                if (!itemJson.Container[itemId].Weight) {
                    itemProps.Weight = 0;
                }
            }
            // 保险箱
            if (itemParent === "5448bf274bdc2dfc2f8b456a") {
                // 容量格子调整为：宽6高8
                if (itemJson.SafeBox.contain.enable) {

                    itemProps.Grids[0]._props.cellsH = itemJson.SafeBox.contain.cellsH;
                    itemProps.Grids[0]._props.cellsV = itemJson.SafeBox.contain.cellsV;
                }
                // 去除安全箱物品存放限制
                if (itemJson.SafeBox.Filter) {
                    itemProps.Grids[0]._props.filters = [{Filter: ['54009119af1c881c07000029'], ExcludedFilter: []}];
                }
                // 安全箱重量(可以实现负重)
                if (!itemJson.SafeBox.Weight) {
                    itemProps.Weight = -9999;
                }
            }
            // 钱堆叠
            if (itemParent === "543be5dd4bdc2deb348b4569" && itemJson.MoneyStack.enable) {
                // 每个堆叠最大数量
                itemProps.StackMaxSize = itemJson.MoneyStack.value;
                itemProps.Weight = 0;
                // 每个堆叠的最小和最大随机数量(影响战局内刷到的数量)
                if (itemId === "5449016a4bdc2d6f028b456f") {
                    itemProps.StackMinRandom = 1000;
                    itemProps.StackMaxRandom = 10000;
                }
                if (itemId === "569668774bdc2da2298b4568") {
                    itemProps.StackMinRandom = 100;
                    itemProps.StackMaxRandom = 500;
                }
                if (itemId === "5696686a4bdc2da3298b456a") {
                    itemProps.StackMinRandom = 100;
                    itemProps.StackMaxRandom = 500;
                }
            }
            // 背包、盲盒
            if (itemParent === "5448e53e4bdc2d60728b4567") {
                // 去除物品限制
                if (itemJson.Backpack.Filter) {
                    itemProps.Grids[0]._props.filters = [{Filter: ['54009119af1c881c07000029'], ExcludedFilter: []}];
                }
                // 背包折叠
                if (itemJson.Backpack.Size) {
                    itemProps.Width = parseInt(itemProps.Width / 2)
                    itemProps.Height = parseInt(itemProps.Height / 2)
                }

                if (itemJson.Backpack.Buff) {
                    // 速度惩罚
                    itemProps.speedPenaltyPercent = 0;
                    // 转向惩罚
                    itemProps.mousePenalty = 0;
                    // 武器人机工效惩罚
                    itemProps.weaponErgonomicPenalty = 0;
                }
                // 无负重
                if (!itemJson.Backpack.Weight) {
                    itemProps.Weight = 0;
                }
            }
            // 弹挂修改 护甲修改
            if (itemParent === "5448e5284bdc2dcb718b4567" || itemParent === "5448e54d4bdc2dcc718b4568" || itemParent === "57bef4c42459772e8d35a53b") {
                if (itemJson.ArmorRig.BlocksArmorVest) {
                    // 去除护甲穿戴冲突
                    itemProps.BlocksArmorVest = false;
                }
                if (itemJson.ArmorRig.Buff) {
                    // 速度惩罚
                    itemProps.speedPenaltyPercent = 0;
                    // 转向惩罚
                    itemProps.mousePenalty = 0;
                    // 武器人机工效惩罚
                    itemProps.weaponErgonomicPenalty = 0;
                }
                // 重量
                if (!itemJson.ArmorRig.Weight) {
                    itemProps.Weight = 0;
                }

            }
            if (itemParent === "644120aa86ffbe10ee032b6f" || itemParent === "65649eb40bf0ed77b8044453"){
                if (itemProps.Durability) {
                    itemProps.Durability = itemProps.Durability * itemJson.ArmorRig.DurabilityTimes;
                }
                if (itemProps.MaxDurability) {
                    itemProps.MaxDurability = itemProps.MaxDurability * itemJson.ArmorRig.DurabilityTimes;
                }
            }
            // 头盔修改
            if (itemParent === "5a341c4086f77401f2541505"){
                if (itemJson.Helmet.BlocksArmorVest) {
                    // 去除耳机佩戴冲突
                    itemProps.BlocksEarpiece = false;
                }
                if (itemJson.Helmet.Buff) {
                    // 速度惩罚
                    itemProps.speedPenaltyPercent = 0;
                    // 转向惩罚
                    itemProps.mousePenalty = 0;
                    // 武器人机工效惩罚
                    itemProps.weaponErgonomicPenalty = 0;
                }
                if (!itemJson.Helmet.Weight) {
                    // 重量
                    itemProps.Weight = 0;
                }
            }
            // 钥匙和卡无限使用次数
            if (itemParent === "5c164d2286f774194c5e69fa" || itemParent === "5c99f98d86f7745c314214b3") {
                if (itemJson.MaximumNumberOfUsage) {
                    itemProps.MaximumNumberOfUsage = 0;
                }
            }
            // 医疗物品耐久调整
            let MedParent = ["5448f39d4bdc2d0a728b4568", "5448f3a14bdc2d27728b4569", "5448f3a64bdc2d60728b456a", "5448f3ac4bdc2dce718b4569"];
            if (MedParent.includes(itemParent) && itemJson.MedicalSupply !== "default") {
                if (itemProps.MaxHpResource === 0) {
                    itemProps.MaxHpResource = 1;
                }
                itemProps.MaxHpResource *= itemJson.MedicalSupply;
                itemProps.hpResourceRate *= itemJson.MedicalSupply;
            }
            //武器无故障
            if (itemProps.BaseMalfunctionChance > 0 && itemJson.HeatFactor) {
                itemProps.BaseMalfunctionChance = 0;
                itemProps.AllowFeed = false;
                itemProps.AllowJam = false;
                itemProps.AllowMisfire = true;
                itemProps.AllowOverheat = false;
                itemProps.AllowSlide = false;
            }
            for (let weapons in itemProps) {
                //武器维修无损耗
                if (weapons === "MaxRepairDegradation" && itemJson.RepairDegradation) {
                    itemProps[weapons] = 0; //商人
                }
                if (weapons === "MaxRepairKitDegradation" && itemJson.RepairDegradation) {
                    itemProps[weapons] = 0; //维修包
                }
                if (weapons === "DurabilityBurnModificator" && itemJson.DurabilityBurnModificator) {
                    itemProps.DurabilityBurnModificator = 0;
                }
            }
            //弹夹容量
            if (itemParent === "5448bc234bdc2d3c308b4569" && itemJson.CartridgesTimes > 0) {
                let Cartridges = itemProps.Cartridges;
                for (let n in Cartridges) {
                    Cartridges[n]._max_count = Cartridges[n]._max_count * itemJson.CartridgesTimes;
                }
            }
            // 优化 T7、夜视仪
            if (itemJson.itemOptimize) {
                if (itemParent === "5a2c3a9486f774688b05e574") {
                    itemProps = Object.assign(itemProps, GPNVG._props);
                }
                if (itemParent === "5d21f59b6dbe99052b54ef83") {
                    itemProps = Object.assign(itemProps, T7._props);
                }
            }
        }
    }
}

module.exports = new itemClass();