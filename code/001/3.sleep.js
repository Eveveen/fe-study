/**
 * 1. Promise + setTimeout
 * @param {Number}} time 
 * @returns 
 */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
}

(async function () {
    console.log('路白 开始' + new Date());
    await sleep(3000);
    console.log('路白 结束' + new Date());
})();

// 1. Promise + setTimeout end

/**
 * 2. while + timestamp
 * @param {Number} delay 
 */
function sleep(delay) {
    const start = Date.now();
    while (Date.now() - start < delay) {
        continue;
    }
}

function test() {
    console.log('路白 开始' + new Date());
    sleep(3000);
    console.log('路白 结束' + new Date());
}

test()
// 2. while + timestamp end


/**
 * 3. setTimeout + generator
 * @param {Number} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(res => {
        setTimeout(res, ms)
    })
}

const co = require('co')

co(function* () {
    console.log('路白 开始' + new Date());
    yield sleep(1000)
    console.log('路白 结束' + new Date());
})

// 3. setTimeout + generator end