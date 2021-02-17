; (function (window, undefined) {
    window.$ = function (selector, all) {
        // 创建全局变量$用来代理 new _$()
        if (selector[0] === "+") {
            //$('+xx')创建一个标签名为xx的dom元素（可以在创建时直接通过($('+xx').dom)）访问到
            if (all) {
                var temp=new _$(document.createElement(selector.substring(1)));
                temp.dom.innerHTML=all;
                return temp;
            }else{
                return new _$(document.createElement(selector.substring(1)));
            }
            
        } else if (selector[0] === "-") {
            //移除dom元素，从父节点移除该子节点
            if (selector.substring(1)) {
                var temp = (new _$(selector.substring(1)));
                temp.dom.parentNode.removeChild($(temp.dom.parentNode).$(selector.substring(1)).dom);
            } else if (all) {
                var temp;
                if (all instanceof _$) {
                    temp=all;
                    all=all.dom;
                }else{
                    temp=$(all);
                }
                temp.dom.parentNode.removeChild(all);
            }
        } else {
            return new _$(selector, all);
        }
    }
    window.$random = function (min, max) {
        //工具方法返回一个在min-max之间的一个随机整数
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    window.$quicksort = function (arr) {
        //快速排序方法封装
        var baseNum = arr[0];
        var leftArr = [], rightArr = [];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < baseNum) {
                leftArr.push(arr[i]);
            } else {
                rightArr.push(arr[i]);
            }
        }
        if (leftArr.length >= 2) leftArr = $quicksort(leftArr);
        if (rightArr.length >= 2) rightArr = $quicksort(rightArr);
        return leftArr.concat(baseNum, rightArr);
    }
    function _$(selector, all, fatherele) {
        //用来实现链式操作和隐式迭代的关键(构造函数)
        if (selector instanceof Node) {
            this.dom = selector;
            // 把真正的dom元素储存在该实例下的键'dom'对应的值上
        } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
            this.dom = selector;
            this.alldom = true;
            // 如果该选择器选择的是一个数组 该实例下面的alldom属性会为true
        }
        else {
            this.dom =
                fatherele ?
                    (all ? (this.alldom = true, fatherele.querySelectorAll(selector)) : fatherele.querySelector(selector))
                    : (all ? (this.alldom = true, document.querySelectorAll(selector)) : document.querySelector(selector));
        }
        //实现多层选择，有父节点则在父节点范围内进行选择
    }
    _$.prototype = {
        //修改原型，实现链式操作
        constructor: _$,
        addEvent: function (name, fn) {
            //事件绑定函数，接收一个事件名和一个响应方法
            if (typeof name === "string" && typeof fn === "function") {
                if (this.dom instanceof HTMLElement) {
                    this.dom.addEventListener(name, fn, false);
                } else if (this.alldom) {
                    //alldom
                    //如果调用该方法的实例是一个dom数组就为该实例下dom数组中每一个dom都绑定该事件
                    for (let i = 0; i < this.dom.length; i++) {
                        this.dom[i].addEventListener(name, fn, false);
                    }
                }
            } else if (typeof name === "object") {
                // obj
                //手动实现多态，如果传入第一个参数是对象，则该对象的键名为事件名，对应的值为响应函数
                var key = Object.keys(name);
                if (this.dom instanceof HTMLElement) {
                    for (let i = 0; i < key.length; i++) {
                        this.dom.addEventListener(key[i], name[key[i]], false);
                    }
                } else if (this.alldom) {
                    //alldom和上一处的作用相同
                    for (let i = 0; i < this.dom.length; i++) {
                        for (let j = 0; j < key.length; j++) {
                            this.dom[i].addEventListener(key[j], name[key[j]], false);
                        }
                    }
                }
            } else if (fn instanceof Array) {
                //类似于解构赋值，第一个参数为string类型的事件名，
                // 第二个参数为响应方法数组（适用于调用者的实例下是dom数组），则按索引（下标）为dom元素绑定事件 
                // 数组中方法不足则对应的索引大于方法数组最大索引的dom无绑定事件，
                // 数组方法长度长于dom元素无影响
                var len = this.dom.length > fn.length ? fn.length : this.dom.length;
                for (let i = 0; i < len; i++) {
                    if (fn[i]) {
                        this.dom[i].addEventListener(name, fn[i], false);
                    }
                }
            }
            return this;
            // 大多数个方法结束后都返回本身，以继续进行自身方法的调用以实现链式操作
        },
        css: function (key, name) {
            // 设置css样式的方法
            // 原生dom操作需要
            // document.querySelector('').style.xx="xx"
            // 这里只需要 $('').css('xx','xx');
            if (!this.alldom) {
                if (key instanceof Object) {
                    // obj和上一处obj作用相同
                    var arr = Object.keys(key);
                    for (let i = 0, len = arr.length; i < len; i++) {
                        this.dom.style[arr[i]] = key[arr[i]];
                    }
                    // for (const zkey in key) {
                    //     this.dom.style[zkey]=key[zkey];
                    //     console.log("xiugaishux",this.dom.style[zkey],key[zkey],zkey);
                    // }
                    return this;
                } else if (this.dom instanceof HTMLElement) {
                    return name ? (this.dom.style[key] = name, this) : this.dom.style[key];
                    // 如果没有传name 则返回对应key的css样式值
                }
            } else {
                var f = this.dom.length;
                if (name instanceof Array) {
                    var len = f > name.length ? name.length : f;
                    for (let i = 0; i < len; i++) {
                        this.dom[i].style[key] = name[i] || this.dom[i].style[key];
                    }

                } else if (key instanceof Object) {
                    var arr = Object.keys(key);
                    for (let j = 0; j < f; j++) {
                        for (let i = 0, len = arr.length; i < len; i++) {
                            this.dom[j].style[arr[i]] = key[arr[i]];
                        }
                    }
                } else if (name) {
                    for (let i = 0; i < this.dom.length; i++) {
                        this.dom[i].style[key] = name;
                    }
                }
                return this;
            }
        },
        class: function (change) {
            if (!this.alldom) {
                if (change[0] == "+") {
                    // 例如$('').class("+i");则class属性中增加了 i
                    this.dom.classList.add(change.substring(1));
                } else if (change[0] == ".") {
                    // .为删除
                    this.dom.classList.remove(change.substring(1));
                } else {
                    this.dom.classList.toggle(change);
                    // 若有则删，若无则加
                }
            } else {
                //alldom
                for (let i = 0; i < this.dom.length; i++) {
                    if (change[0] == "+") {
                        this.dom[i].classList.add(change.substring(1));
                    } else if (change[0] == ".") {
                        this.dom[i].classList.remove(change.substring(1));
                    } else {
                        this.dom[i].classList.toggle(change);
                    }
                }
            }
            return this;
        },
        Sibling: function (doit, selector) {
            // 对兄弟节点（可进一步筛选）后进行操作
            var f;//储存dom节点
            if (typeof doit === "function") {
                f = selector ? this.dom.parentNode.querySelectorAll(selector) : this.dom.parentNode.children;
                for (let i = 0; i < f.length; i++) {
                    if (f[i] !== this.dom) {
                        doit(f[i], i);
                        // 执行操作时把对应实例和索引一同传入方便执行差异化操作
                    }
                }
                return this;
            } else {
                // 传入一个参数，只筛选不执行操作
                f = doit ? this.dom.parentNode.querySelectorAll(doit) : this.dom.parentNode.children;
                var t = new _$(f);
                var arr = [];
                for (let i = 0; i < f.length; i++) {
                    if (f[i] !== this.dom) {
                        arr.push(f[i]);
                    }
                }
                t.dom = arr;
                return t;
            }
        },
        eq: function (num) {
            return new _$(this.dom[num]);
            //获取当前实例中元素组中的第num个元素
        },
        all: function (doit) {
            // 与sibling类似但不进行筛选
            var f = this.dom;
            for (let i = 0; i < f.length; i++) {
                doit(f[i], i);
            }
            return this;
        },
        text: function (val) {
            // 与.css类似
            //暂时未实现修改value
            if (!val) {
                return this.dom.innerText || this.dom.value;
            } else if (val === true) {
                return this.dom.textContent;
            } else if (val) {
                this.dom.textContent = val;
                return this;
            }
        },
        root: function (num) {
            // 获取父辈祖辈元素
            // num如果为空或小于等于1则返回第一层父级，否则返回第num层父级
            var d = this.dom instanceof HTMLElement ? this.dom : this.dom[0];
            var f = d.parentNode;
            if (num) {
                while ((num-- > 1) && f.parentNode !== null) {
                    f = f.parentNode;
                }
            }
            return new _$(f);
        },
        display: function (vshow) {
            // 控制元素显现和消失
            if (!this.alldom) {
                if (vshow === false) {
                    this.dom.style.display = "none";
                } else {
                    this.dom.style.display = vshow;
                }
            } else {
                //alldom
                for (let i = 0; i < this.dom.length; i++) {
                    if (vshow === false) {
                        this.dom[i].style.display = "none";
                    } else {
                        this.dom[i].style.display = vshow;
                    }
                }
            }
            return this;
        },
        addTo: function (father, before) {
            // 只传father向父节点father中插入元素（调用者实例下面的dom元素）
            if (before === 'before') {
                // 传第二个参数为'before'则把该元素插入到传入的父节点前面
                father.dom.parentNode.insertBefore(this.dom, father.dom);
            } else {
                father.dom.appendChild(this.dom);
            }
            return this;
        },
        clear: function (item) {
            //占位
        },
        attr: function (attrname, newone) {
            // 修改或获取自定义属性名
            // 与.css类似
            if (this.alldom) {
                for (let i = 0; i < this.dom.length; i++) {
                    if (this.dom[i][attrname] !== undefined) {
                        this.dom[i][attrname] = newone;
                    } else {
                        this.dom[i].setAttribute(attrname, newone);
                    }
                }
                return this;
            } else if (typeof newone === "undefined") {
                if (this.dom[attrname] !== undefined) {
                    return this.dom[attrname];
                } else {
                    return this.dom.getAttribute(attrname);
                }
            } else {
                if (this.dom[attrname]) {
                    this.dom[old] = newone;
                } else {
                    this.dom.setAttribute(attrname, newone);
                }
                return this;
            }
        },
        easedo: function (distanceX, distanceY, callback) {
            // 缓动函数，常见使用场景 ‘返回顶部’
            distanceY ? "" : distanceY = 0;
            function isPoistive(num, targetnum) {
                return num > 0 ? targetnum : -targetnum;
            }
            clearInterval(t);
            var t = setInterval(() => {
                this.css("left", this.attr('offsetLeft') + isPoistive(distanceX, Math.ceil(Math.abs(distanceX / 10))) + "px");
                this.css("top", this.attr('offsetTop') + isPoistive(distanceY, Math.ceil(Math.abs(distanceY / 10))) + "px");
                if (distanceX == 0 && distanceY == 0) {
                    clearInterval(t);
                    if (callback) {
                        callback();
                    }
                }
                distanceX -= isPoistive(distanceX, Math.ceil(Math.abs(distanceX / 10)));
                distanceY -= isPoistive(distanceY, Math.ceil(Math.abs(distanceY / 10)));
            }, 15);
            return this;
        },
        $: function (selector, all) {
            // 链式调用关键
            return new _$(selector, all, this.dom);
        },
    }
})(window);
