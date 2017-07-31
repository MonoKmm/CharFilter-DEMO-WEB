/**
 * Created by MonoKmm on 2017/3/31.
 */
function c_ajax(params) {
    params = params || {};
    params.data = params.data || {};
    var json = params.jsonp ? jsonp(params) : json(params);

    function json(params) {
        params.type = (params.type || 'GET').toUpperCase();
        params.data = formatParams(params.data);
        var xhr = null;
        if (window.XMLHttpRequest){
            xhr = new XMLHttpRequest()
        }else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        
        xhr.onreadystatechange = function () {
            
        }
    }
}

c_ajax({
    url: 'test.php',  // 请求地址
    type: 'POST',  // 请求类型，默认"GET"，还可以是"POST"
    data: {'b': '异步请求'},  // 传输数据
    success: function(res){  // 请求成功的回调函数
        console.log(JSON.parse(res));
    },
    error: function(error) {}  // 请求失败的回调函数
});

function formatParams(data) {
    var arr = [];
    for(var name in data){
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    arr.push('v=' + random())
    return arr.join('&');
}
function random() {
    return Math.floor(Math.random() * 10000 + 500)
}
