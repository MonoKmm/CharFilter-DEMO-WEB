(function (window) {
    function inheritPrototype(subType, superType) {
        var prototype = Object(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    }
    //supertype
    function EventTarget() {
        this.handlers = {};
    }

    EventTarget.prototype.addHandler = function (type, handler) {
        if (typeof this.handlers[type] == "undefined") {
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    };
    EventTarget.prototype.fire = function (event) {
        if (!event.target) {
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i](event.message);
            }
            this.handlers = {};
        }
    };
    //subtype
    function CharFilter(option, fn) {
        this.cartArr = [];
        this.cartArrHis = [];
        this.data = {};
        this.option = {};
        EventTarget.call(this);
        this.fnInit(option, fn);
    };
    //inherit
    inheritPrototype(CharFilter,EventTarget);
    //enhance subtype
    var sub_prop = {
        constructor: CharFilter,
        fnInit: function (option) {
            var oDefault = {
                url: '' //ajax请求的url
            };
            //初始化参数
            var _option = option;
            for (var p in oDefault) {
                this.option[p] = _option[p] || oDefault[p]
            }
        },
        getCart: function (swich) {
            var result = this.cartArr.slice();
            result = result.length;
            return swich ? result?result-1:0:result;
        },

        addItem: function (target,his) {
            if (typeof target == 'string' && this.cartArr.length<11) {
                var cartArr = this.cartArr;
                cartArr.push(target);
                if(!!his){
                    var cartArrHis = this.cartArrHis;
                    cartArrHis.push({item:[target],type:'add'});
                    if(cartArrHis.length>10){
                        cartArrHis.splice(0,1);
                    }
                }
            }else if (target === true){
                var cartArr = this.cartArr;
                var cartArrHis =this.cartArrHis;
                var last = cartArrHis.pop();
                if(last.type == 'emp'){

                }
            }
            return this.cartArr.length;
        },
        deleteItem: function (target,pos,his) {
            if (typeof target == 'string') {
                var cartArr = this.cartArr;
                if (!!his){
                    this.cartArrHis.push({item:[target],type:'del'});
                    if(this.cartArrHis.length>10){
                        this.cartArrHis.splice(0,1);
                    }
                }
                cartArr.splice(pos,1);

            }else if (target === true){
                this.cartArrHis.push({
                    item:this.cartArr.splice(0),
                    type:'emp'
                });
                if(this.cartArrHis.length>5){
                    this.cartArrHis.splice(0,1);
                }
            }

        },
        undoItem: function () {
            var cartArrHis = this.cartArrHis;
            if (cartArrHis.length>0){
                return cartArrHis.pop();
            }
        },
        dataFilter: function (rest,mode,arr) {
            var list = this.data.list;
            var cartArr = arr instanceof Array ? arr : this.cartArr;
            var cache,
                fliter1=[],
                fliter2=[],
                result = {},
                count = 0,
                caught = 0;
            var unique = this.util.unique(cartArr);
            var uniqueObj = unique[0];
            var uniqueArr = unique[1];
            // 生成引索列表
            for (let i=0,len=list.length;i<len;i++){
                fliter1[i] = i;
            }
            //按去重数组uniqueArr 依次枚举
            for (let p = 0, len = uniqueArr.length; p < len; p++) {
                cache = uniqueArr[p];
                count = uniqueObj[cache];

                //按去重数组fliter1 依次枚举
                for(let i = 0; i < fliter1.length; i++){
                    if ( (mode == 'script') ?
                            ((cache in list[fliter1[i]] ) && ( list[fliter1[i]][cache] >= count )) :
                            ( cache in list[fliter1[i]] ) )
                    {
                        fliter2.push(fliter1[i]);
                    }
                }
                //检测购物车中只有复数同角色情况
                if( (fliter2.length==0) && ((uniqueArr.length == 1) && (count > 1))){
                    result.type = 'similar';//预定义返回类型similar
                    uniqueObj[uniqueArr[0]] -= 1;
                    p -= 1;
                }else {
                    if(rest && fliter2.length==0){
                        if ( !('type' in result) ){
                            result.type = 'similar';
                        }
                        result.arr=[];
                        for (let i = 0,len=fliter1.length; i < len; i++){
                            if(i>10){
                                break;
                            }
                            result.arr.push(list[fliter1[i]]);
                        }
                        return result;
                    }
                    else {
                        fliter1 = fliter2.splice(0);
                    }
                }

            }
            if ( !('type' in result) ){
                result.type = 'matched';
            }
            result.arr=[];
            for (let i = 0,len=fliter1.length; i < len; i++){
                result.arr.push(list[fliter1[i]]);
            }
            return result;
        },
        //获取筛选json数组
        getDataList: function (atr,fn) {
                this.addHandler("loaded", function (data) {
                    var subobj = data[atr];
                    return fn(subobj);
                });
                this.getData(null,true);
        },
        getStatus: function () {

        },
        getData: function (fn, fire) {
            var that = this;
            if (!!that.data.length){
                setTimeout(function () {
                    that.fire({type: "loaded",message:that.data});
                },0)
            }else {
                this.util.fnGet(this.option.url, function (data) {
                    var dataObj = eval(data)[0];
                    that.data = dataObj;
                    if (fire) {
                        that.fire({type: "loaded",message:dataObj});
                    }
                    if (typeof fn == 'function') {
                        fn(dataObj);
                    }
                }, 500);
            }

        },
        util: {//公共接口方法
            unique: function (narr) {

                if ( narr instanceof Array) {
                    var arr = narr.slice(0);
                    var robj = {}, rarr = [];
                    for (var i = 0, len = arr.length; i < len; i++) {
                        if ( arr[i] in robj ) {
                            robj[arr[i]] += 1
                        }else {
                            rarr.push(arr[i]);
                            robj[arr[i]] = 1;
                        }
                    }

                    return [robj,rarr];
                }
            },
            fnGet: function (url, fn, timeout) {
                var xhr = null;
                try {
                    if (window.XMLHttpRequest) {
                        xhr = new XMLHttpRequest();
                    } else if (Window.ActiveXObject) {

                        xhr = new ActiveXObject("Msxml2.Xmlhttp");
                    }
                } catch (e) {
                    //TODO handle the exception
                    xhr = new ActiveXObject('Microsoft.Xmlhttp');
                }
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        fn.call(this, this.responseText);
                    } else {
                        setTimeout(function () {
                            xhr.abort();
                        }, timeout);
                    }
                };
                xhr.open('get', url, true);
                xhr.send();
            }
        }
    };
    for (var key in sub_prop) {
        if (!length){
            CharFilter.prototype[key] = sub_prop[key];
        }
    }
    sub_prop = null;
    this.EventTarget = EventTarget;
    this.CharFilter = CharFilter;
}(window));