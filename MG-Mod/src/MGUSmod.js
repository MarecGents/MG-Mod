const modInfo = require("../package.json");
const {load} = require('./exmod/loadMod');
const color = require("./models/ColorType");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
class Mod {

    preSptLoad(container) {
        this.Watermark = container.resolve('Watermark');
        this.Logger = container.resolve('WinstonLogger');
        this.VFS = container.resolve('VFS');
        this.ImporterUtil = container.resolve('ImporterUtil');
        this.ImageRouter = container.resolve('ImageRouter');
        this.HashUtil = container.resolve('HashUtil');
        this.JsonUtil = container.resolve('JsonUtil');
        this.LocaleService = container.resolve('LocaleService');
        this.databaseServer = container.resolve('DatabaseServer');
        this.RepairService = container.resolve('RepairService');
        this.PlatformLocale = this.LocaleService.getPlatformLocale();
        this.SaveServer = container.resolve('SaveServer');
        this.PreSptModLoader = container.resolve('PreSptModLoader');
        this.Language = this.PlatformLocale === 'zh' ? 'ch' : this.PlatformLocale;
        this.modname = modInfo.name;
        this.modpath = this.PreSptModLoader.getModPath(this.modname);
        this.itemDBpath = this.modpath + "db/";
    }

    postDBLoad(container) {
        this.databaseServer = container.resolve('DatabaseServer');
        this.configServer = container.resolve('ConfigServer');
        this.CustomItemService = container.resolve("CustomItemService");
        this.tables = this.databaseServer.getTables();
        load.infoload(this);
    }

}

module.exports = {mod: new Mod()};