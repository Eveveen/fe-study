# VirturalDOM



## 为什么需要 Virtual Dom

众所周知，操作 DOM 是很耗费性能的⼀件事情，

既然如此，我们可以考虑通过 JS 对象来模拟 DOM 对象，毕竟操作 JS 对象⽐操作 DOM 省时的多。

举个例⼦

```js
// 假设这⾥模拟⼀个 ul，其中包含了 5 个 li
[1, 2, 3, 4, 5]

// 这⾥替换上⾯的 li
[1, 2, 5, 4]
```

从上述例⼦中，我们⼀眼就可以看出先前的 ul 中的第三个 li 被移除了，四五替换了位置。

如果以上操作对应到 DOM 中，那么就是以下代码

```js
// 删除第三个 li
ul.childNodes[2].remove()

// 将第四个 li 和第五个交换位置
let fromNode = ul.childNodes[4]
let toNode = node.childNodes[3]
let cloneFromNode = fromNode.cloneNode(true)
let cloenToNode = toNode.cloneNode(true)
ul.replaceChild(cloneFromNode, toNode)
ul.replaceChild(cloenToNode, fromNode)
```

当然在实际操作中，我们还需要给每个节点⼀个标识，作为判断是同⼀个节点的依据。

所以这也是 Vue 和 React 中官⽅推荐列表⾥的节点使⽤唯⼀的 key 来保证性能。

那么既然 DOM 对象可以通过 JS 对象来模拟，反之也可以通过 JS 对象来渲染出对应的DOM



以下是⼀个 JS 对象模拟 DOM 对象的简单实现

```js
export default class Element {
    /**
 * @param {String} tag 'div'
 * @param {Object} props { class: 'item' }
 * @param {Array} children [ Element1, 'text']
 * @param {String} key option
 */
    constructor(tag, props, children, key) {
        this.tag = tag
        this.props = props
        if (Array.isArray(children)) {
            this.children = children
        } else if (isString(children)) {
            this.key = children
            this.children = null
        }
        if (key) this.key = key
    }
    // 渲染
    render() {
        let root = this._createElement(
            this.tag,
            this.props,
            this.children,
            this.key
        )
        document.body.appendChild(root)
        return root
    }
    create() {
        return this._createElement(this.tag, this.props, this.children,
                                   this.key)
    }
    // 创建节点
    _createElement(tag, props, child, key) {
        // 通过 tag 创建节点
        let el = document.createElement(tag)
        // 设置节点属性
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const value = props[key]
                el.setAttribute(key, value)
            }
        }
        if (key) {
            el.setAttribute('key', key)
        }
        // 递归添加⼦节点
        if (child) {
            child.forEach(element => {
                let child
                if (element instanceof Element) {
                    child = this._createElement(
                        element.tag,
                        element.props,
                        element.children,
                        element.key
                    )
                } else {
                    child = document.createTextNode(element)
                }
                el.appendChild(child)
            })
        }
        return el
    }
}
```



## Virtual Dom 算法简述

既然我们已经通过 JS 来模拟实现了 DOM，那么接下来的难点就在于如何判断旧的对象和新的对象之间的差异。

DOM 是多叉树的结构，如果需要完整的对⽐两颗树的差异，那么需要的时间复杂度会是 O(n^ 3)，这个复杂度肯定是不能接受的。

于是 React 团队优化了算法，实现了 O(n) 的复杂度来对⽐差异。

实现 O(n) 复杂度的关键就是只对⽐同层的节点，⽽不是跨层对⽐，这也是考虑到在实际业务中很少会去跨层的移动 DOM 元素。



所以判断差异的算法就分为了两步

- ⾸先从上⾄下，从左往右遍历对象，也就是树的深度遍历，这⼀步中会给每个节点添加索引，便于最后渲染差异

- ⼀旦节点有⼦元素，就去判断⼦元素是否有不同



## Virtual Dom 算法实现

#### 树的递归

⾸先我们来实现树的递归算法，在实现该算法前，先来考虑下两个节点对⽐会有⼏种情况

1. 新的节点的 tagName 或者 key 和旧的不同，这种情况代表需要替换旧的节点，并且也不再需要遍历新旧节点的⼦元素了，因为整个旧节点都被删掉了

2. 新的节点的 tagName 和 key （可能都没有）和旧的相同，开始遍历⼦树

3. 没有新的节点，那么什么都不⽤做

```js
import { StateEnums, isString, move } from './util'
import Element from './element'
export default function diff(oldDomTree, newDomTree) {
    // ⽤于记录差异
    let pathchs = {}
    // ⼀开始的索引为 0
    dfs(oldDomTree, newDomTree, 0, pathchs)
    return pathchs
}

function dfs(oldNode, newNode, index, patches) {
    // ⽤于保存⼦树的更改
    let curPatches = []
    // 需要判断三种情况
    // 1.没有新的节点，那么什么都不⽤做
    // 2.新的节点的 tagName 和 `key` 和旧的不同，就替换
    // 3.新的节点的 tagName 和 key（可能都没有） 和旧的相同，开始遍历⼦树
    if (!newNode) {
    } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
        // 判断属性是否变更
        let props = diffProps(oldNode.props, newNode.props)
        if (props.length) curPatches.push({ type: StateEnums.ChangeProps,
                                           props })
        // 遍历⼦树
        diffChildren(oldNode.children, newNode.children, index, patches)
    } else {
        // 节点不同，需要替换
        curPatches.push({ type: StateEnums.Replace, node: newNode })
    }
    if (curPatches.length) {
        if (patches[index]) {
            patches[index] = patches[index].concat(curPatches)
        } else {
            patches[index] = curPatches
        }
    }
}
```



#### 判断属性的更改

判断属性的更改也分三个步骤

1. 遍历旧的属性列表，查看每个属性是否还存在于新的属性列表中

2. 遍历新的属性列表，判断两个列表中都存在的属性的值是否有变化

3. 在第⼆步中同时查看是否有属性不存在与旧的属性列列表中

```js
function diffProps(oldProps, newProps) {
    // 判断 Props 分以下三步骤
    // 先遍历 oldProps 查看是否存在删除的属性
    // 然后遍历 newProps 查看是否有属性值被修改
    // 最后查看是否有属性新增
    let change = []
    for (const key in oldProps) {
        if (oldProps.hasOwnProperty(key) && !newProps[key]) {
            change.push({
                prop: key
            })
        }
    }
    for (const key in newProps) {
        if (newProps.hasOwnProperty(key)) {
            const prop = newProps[key]
            if (oldProps[key] && oldProps[key] !== newProps[key]) {
                change.push({
                    prop: key,
                    value: newProps[key]
                })
            } else if (!oldProps[key]) {
                change.push({
                    prop: key,
                    value: newProps[key]
                })
            }
        }
    }
    return change
}
```



#### 判断列表差异算法实现

这个算法是整个 Virtual Dom 中最核⼼的算法，且让我⼀⼀为你道来。

这⾥的主要步骤其实和判断属性差异是类似的，也是分为三步

1. 遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中

2. 遍历新的节点列表，判断是否有新的节点

3. 在第⼆步中同时判断节点是否有移动

PS：该算法只对有 key 的节点做处理

```js
function listDiff(oldList, newList, index, patches) {
    // 为了遍历⽅便，先取出两个 list 的所有 keys
    let oldKeys = getKeys(oldList)
    let newKeys = getKeys(newList)
    let changes = []
    // ⽤于保存变更后的节点数据
    // 使⽤该数组保存有以下好处
    // 1.可以正确获得被删除节点索引
    // 2.交换节点位置只需要操作⼀遍 DOM
    // 3.⽤于 `diffChildren` 函数中的判断，只需要遍历
    // 两个树中都存在的节点，⽽对于新增或者删除的节点来说，完全没必要
    // 再去判断⼀遍
    let list = []
    oldList &&
        oldList.forEach(item => {
        let key = item.key
        if (isString(item)) {
            key = item
        }
        // 寻找新的 children 中是否含有当前节点
        // 没有的话需要删除
        let index = newKeys.indexOf(key)
        if (index === -1) {
            list.push(null)
        } else list.push(key)
    })
    // 遍历变更后的数组
    let length = list.length
    // 因为删除数组元素是会更改索引的
    // 所有从后往前删可以保证索引不变
    for (let i = length - 1; i >= 0; i--) {
        // 判断当前元素是否为空，为空表示需要删除
        if (!list[i]) {
            list.splice(i, 1)
            changes.push({
                type: StateEnums.Remove,
                index: i
            })
        }
    }
    // 遍历新的 list，判断是否有节点新增或移动
    // 同时也对 `list` 做节点新增和移动节点的操作
    newList &&
        newList.forEach((item, i) => {
        let key = item.key
        if (isString(item)) {
            key = item
        }
        // 寻找旧的 children 中是否含有当前节点
        let index = list.indexOf(key)
        // 没找到代表新节点，需要插⼊
        if (index === -1 || key == null) {
            changes.push({
                type: StateEnums.Insert,
                node: item,
                index: i
            })
            list.splice(i, 0, key)
        } else {
            // 找到了，需要判断是否需要移动
            if (index !== i) {
                changes.push({
                    type: StateEnums.Move,
                    from: index,
                    to: i
                })
                move(list, index, i)
            }
        }
    })
    return { changes, list }
}
function getKeys(list) {
    let keys = []
    let text
    list &&
        list.forEach(item => {
        let key
        if (isString(item)) {
            key = [item]
        } else if (item instanceof Element) {
            key = item.key
        }
        keys.push(key)
    })
    return keys
}
```



#### 遍历⼦元素打标识

对于这个函数来说，主要功能就两个

1. 判断两个列表差异

2. 给节点打上标记

总体来说，该函数实现的功能很简单

```js
function diffChildren(oldChild, newChild, index, patches) {
    let { changes, list } = listDiff(oldChild, newChild, index, patches)
    if (changes.length) {
        if (patches[index]) {
            patches[index] = patches[index].concat(changes)
        } else {
            patches[index] = changes
        }
    }
    // 记录上⼀个遍历过的节点
    let last = null
    oldChild &&
        oldChild.forEach((item, i) => {
        let child = item && item.children
        if (child) {
            index =
                last && last.children ? index + last.children.length + 1 :
            index + 1
            let keyIndex = list.indexOf(item.key)
            let node = newChild[keyIndex]
            // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
            if (node) {
                dfs(item, node, index, patches)
            }
        } else index += 1
        last = item
    })
}
```



#### 渲染差异

通过之前的算法，我们已经可以得出两个树的差异了。既然知道了差异，就需要局部去更新DOM 了，

下⾯就让我们来看看 Virtual Dom 算法的最后⼀步骤



这个函数主要两个功能

1. 深度遍历树，将需要做变更操作的取出来

2. 局部更新 DOM

整体来说这部分代码还是很好理解的

```js
let index = 0
export default function patch(node, patchs) {
    let changes = patchs[index]
    let childNodes = node && node.childNodes
    // 这⾥的深度遍历和 diff 中是⼀样的
    if (!childNodes) index += 1
    if (changes && changes.length && patchs[index]) {
        changeDom(node, changes)
    }
    let last = null
    if (childNodes && childNodes.length) {
        childNodes.forEach((item, i) => {
            index =
                last && last.children ? index + last.children.length + 1 : index
                + 1
            patch(item, patchs)
            last = item
        })
    }
}
function changeDom(node, changes, noChild) {
    changes &&
        changes.forEach(change => {
        let { type } = change
        switch (type) {
            case StateEnums.ChangeProps:
                let { props } = change
                props.forEach(item => {
                    if (item.value) {
                        node.setAttribute(item.prop, item.value)
                    } else {
                        node.removeAttribute(item.prop)
                    }
                })
                break
            case StateEnums.Remove:
                node.childNodes[change.index].remove()
                break
            case StateEnums.Insert:
                let dom
                if (isString(change.node)) {
                    dom = document.createTextNode(change.node)
                } else if (change.node instanceof Element) {
                    dom = change.node.create()
                }
                node.insertBefore(dom, node.childNodes[change.index])
                break
            case StateEnums.Replace:
                node.parentNode.replaceChild(change.node.create(), node)
                break
            case StateEnums.Move:
                let fromNode = node.childNodes[change.from]
                let toNode = node.childNodes[change.to]
                let cloneFromNode = fromNode.cloneNode(true)
                let cloenToNode = toNode.cloneNode(true)
                node.replaceChild(cloneFromNode, toNode)
                node.replaceChild(cloenToNode, fromNode)
                break
            default:
                break
        }
    })
}
```

### 最后

Virtual Dom 算法的实现也就是以下三步

1. 通过 JS 来模拟创建 DOM 对象

2. 判断两个对象的差异

3. 渲染差异

```js
let test4 = new Element('div', { class: 'my-div' }, ['test4'])
let test5 = new Element('ul', { class: 'my-div' }, ['test5'])
let test1 = new Element('div', { class: 'my-div' }, [test4])
let test2 = new Element('div', { id: '11' }, [test5, test4])
let root = test1.render()
let pathchs = diff(test1, test2)
console.log(pathchs)
setTimeout(() => {
    console.log('开始更新')
    patch(root, pathchs)
    console.log('结束更新')
}, 1000)
```

当然⽬前的实现还略显粗糙，但是对于理解 Virtual Dom 算法来说已经是完全⾜够的了。