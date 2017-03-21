/**
 * Created by MonoKmm on 2017/3/9.
 */
(function ($) {
    $(document).ready(function () {
        var $cfshelf = $('#cf-shelf');
        var $cfcart = $('#cf-cart');
        var $cfcontrol = $('#cf-control');
        // ***************************************
        // DomInit
        // ***************************************
        var charArr = [];
        var createDom = function (data) {
            // console.log(data);
            charArr = data;
            var htmlShelf = '';
            var htmlCart = '';
            for (var i=0,len=data.length<36?36:data.length;i<len;i++){
                var htmlData = i<data.length ?
                    ('class="photo"><img src="'+ data[i]['src'] +'" data-num="'+ data[i]['id'] +'"') :
                    'class="photo-none"><img ';
                htmlShelf += '<div '+ htmlData +' alt=""><div class="details"></div></div>'
            }
            htmlCart = fnCreateHtml({'type':'photo-none'},10);
            $cfcart.data('empCache',htmlCart).html(htmlCart);
            $cfshelf.html(htmlShelf);
            fnSearch(["no0595","no0596"]);
        };
            // <img src="image/no0595.jpg">
            // <div class="photo"><img scr="image/no0595.jpg" alt=""></div>
            // <div class="photo-none"><img alt=""></div>
        var fnCreateHtml = function (opt,count) {
            var html = '';
            switch (opt.type){
                case 'photo-none':
                    for (var i=0,len=count;i<len;i++){
                        html += '<div class="photo-none"><img alt=""></div>'
                    }
                    return html;
                case 'photo':
                    for (var i=0,len=opt.arr.length;i<len;i++){
                        var num = opt.arr[i];
                        html += '<div class="photo"><img data-num="'+ num +'"src="image/char/'+ num +'.jpg" alt=""></div>'
                    }
                    // console.log(html);
                    return html;
                case 'img':
                    $.extend()
                    for (var i=0,len=opt.arr.length;i<len;i++){
                        html += '<img src="image/char/'+ opt.arr[i] +'.jpg">'
                    }
                    return html;
            }
        };

        var fnRemove = function () {
            $cfcart.data('prev',$cfcart.html());
            var cache = $cfcart.data('empCache');
            $cfcart.html(cache);
            cf.deleteItem(true);
        };
        var fnUndo =function () {
            var last = cf.undoItem();
            if (!!last){
                // console.log(last);
                switch (last['type']){
                    case 'add':
                        // console.log('撤销增加');
                        var cartnum = cf.getCart(true);
                        $cfcart.children().eq(cartnum).remove();
                        $cfcart.append(fnCreateHtml({'type':'photo-none'},1));
                        cf.deleteItem('target',null,false);
                        // console.log(cf.cartArr);
                        // console.log(cf.getCart());
                        break;
                    case 'del':
                        // console.log('撤销删除');
                        var $child = $cfcart.children();
                        var cartnum = cf.getCart(true);
                        // console.log(cartnum);
                        if(cartnum<9){
                            $child.eq(9).remove();
                            $child.eq(cartnum).after(fnCreateHtml({'type':'photo','arr':last.item},1));
                            cf.addItem(last.item[0],false);
                        }
                        // console.log(cf.cartArr);
                        break;
                    case 'emp':
                        // console.log('撤销清空');
                        cf.addItem(true,false);
                        $cfcart.html($cfcart.data('prev'));
                        break;
                    default:
                        break;
                }
            }
        };
        var fnSearch = function (boolearn,arr) {
            var tr = '',
                item;
            var reslut = cf.dataFilter(true,'script',arr instanceof Array ? arr : null);
            var reslutArr = reslut['arr'];

            for(let i=0,len=reslutArr.length;i<len;i++){
                let cArr=[];
                item = reslutArr[i];
                for (let p in item){
                    if (p != 'id' && p != 'length'){
                        for(let i=0,len=item[p];i<len;i++){
                            cArr.push(p);
                        }
                    }
                }
                tr += '<tr class="cf-tr-details"><td>'+item['id']+'</td>' +
                    '<td>'+ fnCreateHtml({type:'img',arr:cArr})+'</td>' +
                    '<td>在售</td></tr>'
            }
            var $tbody = $('#cf-list tbody');
            $tbody.empty().append(tr);
            //show thead
            $('#cf-list thead').show();
            console.log(reslut);
        };
        // ***************************************
        //  Event
        // ***************************************
        // cart animation event
        $('#cf-cart-toggle-btn').on('click', function (event) {
            event.preventDefault();
            $(this).toggleClass('cf-btn-rbtoggle').next().slideToggle();
        });

        $cfcontrol.on('click',function (event) {
            event.preventDefault();
            var $elem = $(event.target).closest('button');
            if ($elem.is('button')){
                switch ($elem.attr('id')){
                    case 'control-remove':
                        fnRemove();
                        break;
                    case 'control-undo':
                        // console.log('撤销');
                        fnUndo();
                        break;
                    case 'control-search':
                        var mOrp = '';
                        var $btn = $('#cf-cart-toggle-btn');
                        if ($btn.css('display') == 'block'){
                            $btn.trigger('click');
                            $("html,body").animate({scrollTop: $('#cf-text').offset().top +110}, 1000);
                        }else {
                            $("html,body").animate({scrollTop: $('#cf-control').offset().top }, 1000);
                        }
                        fnSearch();
                        break;
                    default:
                        return;
                }
            }
        });
        //add
        $cfshelf.on('click',function (event) {
            event.preventDefault();
            var $elem = $(event.target);
            if ($elem.is('img') && $elem.attr('data-num')){
                var itemNum = cf.getCart(false);
                if(-1<itemNum<9){
                    $('#cf-cart > div').eq(itemNum).replaceWith($elem.parent().clone());
                    cf.addItem($elem.attr('data-num'),true);
                }
            }
        });
        //del
        $cfcart.on('click',function (event) {
            event.preventDefault();
            var $elem = $(event.target);
            if ($elem.is('img') && !!$elem.attr('src')){
                var $parent = $elem.closest('div');
                var index = $parent.index();
                var charname = $elem.attr('data-num');
                cf.deleteItem(charname,index,true);
                $parent.remove();
                $cfcart.append(fnCreateHtml({'type':'photo-none'},1));

            }
        });
        // ***************************************
        // CharFilter
        // ***************************************
        var option = {
            url: 'data/charlist.json'
        };
        var cf = new CharFilter(option);
        var initData = function () {
            var dtd = new $.Deferred();
            //获取筛选json数组
            cf.getDataList("char_img",function (data) {
                dtd.resolve(data)
            });
            return dtd.promise();
        };
        initData().done(createDom);


    });

})(jQuery);
