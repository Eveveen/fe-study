let timerId = null;

/**
 * 使用setTimeout模拟实现setInterval
 * @param {Function} fn 
 * @param {*} delay 
 * @param  {...any} args 
 */
function mockSetInterval(fn, delay, ...args) {
    const recur = function () {
        timerId = setTimeout(() => {
            fn.apply(this, args);
            recur();
        }, delay)
    }
    recur();
}

function mockClearInterval(id) {
    clearTimeout(id);
}

mockSetInterval((name) => {
    console.log(name);
}, 1000, 'lubai')


setTimeout(() => {
    mockClearInterval(timerId);
}, 4000)