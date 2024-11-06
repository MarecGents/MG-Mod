const axios = require('axios');
const fs = require("fs");
const path = require("path");

class getPrice{
    getPriceFun(mod,callback){
        let url = "";
        eval(function (a){
            a = a.slice(1,a.length-1).split("},{").map(hex => parseInt(hex,16)).map(b => String.fromCharCode(b)).join("");
            return a;
        }("{0x75},{0x72},{0x6c},{0x20},{0x3d},{0x20},{0x22},{0x68},{0x74},{0x74},{0x70},{0x73},{0x3a},{0x2f},{0x2f},{0x64},{0x65},{0x76},{0x2e},{0x73},{0x70},{0x2d},{0x74},{0x61},{0x72},{0x6b},{0x6f},{0x76},{0x2e},{0x63},{0x6f},{0x6d},{0x2f},{0x4d},{0x61},{0x72},{0x65},{0x63},{0x47},{0x65},{0x6e},{0x74},{0x73},{0x2f},{0x53},{0x79},{0x6e},{0x63},{0x2d},{0x46},{0x6c},{0x65},{0x61},{0x2d},{0x4d},{0x61},{0x72},{0x6b},{0x65},{0x74},{0x2f},{0x72},{0x61},{0x77},{0x2f},{0x62},{0x72},{0x61},{0x6e},{0x63},{0x68},{0x2f},{0x6d},{0x61},{0x69},{0x6e},{0x2f},{0x70},{0x72},{0x69},{0x63},{0x65},{0x2e},{0x6a},{0x73},{0x6f},{0x6e},{0x22}"));
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
        axios.get(url, { headers })
            .then(response => {
                const content = response.data;
                const priceDate = content.date;
                // console.log(content);
                const filePath = path.join(__dirname, "../../res/price/price.json");
                // const jsonData = JSON.stringify(priceJson, null, 2);
                //
                fs.writeFile(filePath, JSON.stringify(content,null,3), (err) => {
                    if (err) {
                        console.error("price.json保存出现错误:", err);
                        callback("001"+err);
                    } else {
                        // console.log("price.json 文件已成功保存。");
                        callback(`${mod.modname}:实时跳蚤数据已更新至 ${priceDate[0]}年 ${priceDate[1]}月 ${priceDate[2]}日。请自主选择是否重启服务端！`);
                    }
                });
            })
            .catch(error => {
                console.error("请求出现错误:", error.message);
                callback("002"+error);
            });
    }

    getDate(){
        const currentDate = new Date();
        const Year = currentDate.getFullYear();
        const Month = currentDate.getMonth() + 1;
        const Day = currentDate.getDate();
        return [Year,Month,Day];
    }

    abc(){

    }
}
module.exports = new getPrice()