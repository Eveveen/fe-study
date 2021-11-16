const TRAFFIC_LIGHT_CONFIG = {
    'green': 3000,
    'yellow': 1000,
    'red': 2000
}

function delay(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

async function changeColor(color) {
    document.getElementById('traffic-light').style.background = color;
    await delay(TRAFFIC_LIGHT_CONFIG[color]);
}

// 写死顺序
// async function run() {
//     await changeColor('green');
//     await changeColor('yellow');
//     await changeColor('red');
//     run()
// }

// 通过配置文件来控制顺序
async function run() {
    for (let key in TRAFFIC_LIGHT_CONFIG) {
        await changeColor(key);
    }
    run()
}
run();