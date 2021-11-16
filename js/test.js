/**
 * 防抖
 * 在事件被触发后 n 秒再执行回调，如果在这 n 秒内又被触发，则重新计时
 * @param {*} fn 
 * @param {*} wait 
 */
let timer = null;
function debounce(fn, wait) {
  return function () {
    let context = globalThis;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  }
}

function log(data) {
  console.log(data || 'default');
  console.timeEnd('time');
}

console.time('time');
debounce(log, 1000)()
setTimeout(debounce(() => { log('hello') }, 1000), 500);