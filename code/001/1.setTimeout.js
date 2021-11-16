console.log('主代码开始执行');
let timerId = 0;

/**
 * 清除定时器
 * @param {Number} timerId 定时器Id 
 */
const mClearTimeout = (timerId) => {
    window.cancelAnimationFrame(timerId);
}

/**
 * 设置定时器
 * @param {Function} fn 回调函数
 * @param {Number} timeout 延迟时间
 * @param  {...any} args 回调函数的参数
 */
const mSetTimeout = (fn, timeout, ...args) => {
    const start = Date.now();
    let now;
    const loop = () => {
        timerId = window.requestAnimationFrame(loop);
        // 再次运行时获取当前时间
        now = Date.now();
        // 当前运行时间 - 初始当前时间 >= 等待时间 ===>> 跳出
        if (now - start >= timeout) {
            fn.apply(this, args)
            // 如果想自动取消timer的话, 就在这里cancel即可
            mClearTimeout(timerId)
        }
    }
    timerId = window.requestAnimationFrame(loop);

}

function showName(name = 'lubai') {
    console.log(`my name is ${name} !!!!`);
    console.timeEnd('showName');
}

console.time('showName');
mSetTimeout(showName, 3000, 'lubai1111');