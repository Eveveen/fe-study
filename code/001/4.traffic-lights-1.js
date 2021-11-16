function delay(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}
async function changeColor(color, duration) {
    document.getElementById('traffic-light').style.background = color;
    await delay(duration);
}
async function run() {
    // while (1) {
    //     await changeColor('green', 3000);
    //     await changeColor('yellow', 1000);
    //     await changeColor('red', 2000);
    // }
    await changeColor('green', 3000);
    await changeColor('yellow', 1000);
    await changeColor('red', 2000);
    run()
}
run();