const {mod} = require("../MGUSmod");
const color = require("../models/ColorType");
const colorBG = require("../models/ColorBGType");
class assortToTrader{
    getItemList(newItemList){
        if(!newItemList || Object.keys(newItemList).length === 0) return;
        let traders = mod.tables.traders;
        for(let Id in newItemList){
            let newItem = newItemList[Id];
            if(!(newItem.toTrader in traders)){
                mod.Logger.log(`MG独立物品:无法将独立物品id:${Id}添加到商人:${newItem.toTrader}中。\n原因：未能找到该商人`, color.BLUE, colorBG.YELLOWBG);
                continue;
            }
            let randId = mod.HashUtil.generate();
            let TraderAssort = traders[newItem.toTrader].assort;
            if(newItem.assort && newItem.assort.length !== 0){
                for(let ast of newItem.assort){
                    if(ast.parentId==="hideout" && ast.slotId==="hideout"){
                        randId = ast._id;
                    }
                    TraderAssort.items.push(ast);
                }
            }
            else{
                TraderAssort.items.push({
                    _id: randId,
                    _tpl: Id,
                    parentId: 'hideout',
                    slotId: 'hideout',
                    upd: {
                        UnlimitedCount: true,
                        StackObjectsCount: 999999
                    }
                });
            }

            TraderAssort.barter_scheme[randId] = [[{
                "count":newItem.Price,
                "_tpl":"5449016a4bdc2d6f028b456f"
            }]]
            TraderAssort.loyal_level_items[randId] = newItem.loyal_level;
        }
    }
}
module.exports = new assortToTrader();