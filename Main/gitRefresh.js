const { exec } = require('child_process');
const path = require('path');

function getDate(){
    // 创建一个新的Date对象，表示当前日期和时间
    const currentDate = new Date();
// 获取年份（四位数）
    const year = currentDate.getFullYear();
// 获取月份（0-11），所以需要加1来得到实际的月份
    const month = currentDate.getMonth() + 1;
// 获取日期（1-31）
    const day = currentDate.getDate();

    const Year = `${year}`
    const Month = `${month < 10 ? '0' : ''}${month}`
    const Day = `${day < 10 ? '0' : ''}${day}`

    return [Year,Month,Day]
}


exec("git pull MG-Mod main",(error, stdout, stderr) => {
    if (error) {
        console.error(`git pull error: ${error}`);
        return;
    }
    console.log(`git pull:\n${stdout}`);
    // if (stderr) {
    //     console.error(`标准错误输出: ${stderr}`);
    // }
});

exec("git add .",(error, stdout, stderr) => {
    if (error) {
        console.error(`git add error: ${error}`);
        return;
    }
    console.log(`git add:\n${stdout}`);
    // if (stderr) {
    //     console.error(`标准错误输出: ${stderr}`);
    // }
});
nowDate = getDate();
commit_message = `${nowDate[0]}.${nowDate[1]}.${nowDate[2]} updated`

exec(`git commit -m \"${commit_message}\"`,(error, stdout, stderr) => {
    if (error) {
        console.error(`git commit error: ${error}`);
        return;
    }
    console.log(`git commit:\n${stdout}`);
    // if (stderr) {
    //     console.error(`标准错误输出: ${stderr}`);
    // }
});

exec("git push MG-Mod main",(error, stdout, stderr) => {
    if (error) {
        console.error(`git push error: ${error}`);
        return;
    }
    console.log(`git push:\n${stdout}`);
    // if (stderr) {
    //     console.error(`标准错误输出: ${stderr}`);
    // }
});