Function.prototype.myBind = function (context) {
  // 1. 判断调用对象是否为函数
  if (typeof this !== 'function') {
    console.error('type error');
  }
  // 2. 判断上下文对象是否存在，不存在则设为 window
  context = context || globalThis;
  // 3. 将调用函数设为上下文对象的属性
  context.fn = this;
  // 4. 获取参数
  let args = [...arguments].slice(1);
  // 5. 通过上下文对象执行函数
  // let result = context.fn(...args);
  return function Fn() {
    context.fn.apply(content, ...args)
  }
}


function fn() {
  console.log(this);
}

fn.bind(1).bind(2)();
  // fn.myBind(1).myBind(2)();