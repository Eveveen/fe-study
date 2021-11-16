# setState

setState 在 React 中是经常使⽤的⼀个 API，但是它存在⼀些问题，可能会导致犯错，核⼼原因就是因为这个 API 是异步的。



⾸先 setState 的调⽤并不会⻢上引起 state 的改变，并且如果你⼀次调⽤了多个 setState ，那么结果可能并不如你期待的⼀样。

```js
handle() {
    // 初始化 `count` 为 0
    console.log(this.state.count) // -> 0
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // -> 0
}
```



第⼀，两次的打印都为 0，因为 setState 是个异步 API，只有同步代码运⾏完毕才会执⾏。 

setState 异步的原因我认为在于， setState 可能会导致 DOM 的重绘，如果调⽤⼀次就⻢上去进⾏重绘，那么调⽤多次就会造成不必要的性能损失。

设计成异步的话，就可以将多次调⽤放⼊⼀个队列中，在恰当的时候统⼀进⾏更新过程。



第⼆，虽然调⽤了三次 setState ，但是 count 的值还是为 1。

因为多次调⽤会合并为⼀次，只有当更新结束后 state 才会改变，三次调⽤等同于如下代码

```js
Object.assign( 
    {},
    { count: this.state.count + 1 },
    { count: this.state.count + 1 },
    { count: this.state.count + 1 },
)
```

当然你也可以通过以下⽅式来实现调⽤三次 setState 使得 count 为 3

```js
handle() {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
    this.setState((prevState) => ({ count: prevState.count + 1 }))
    this.setState((prevState) => ({ count: prevState.count + 1 }))
}
```

如果你想在每次调⽤ setState 后获得正确的 state ，可以通过如下代码实现

```js
handle() {
    this.setState((prevState) => ({ count: prevState.count + 1 }), () =>
                  {
        console.log(this.state)
    })
}
```

