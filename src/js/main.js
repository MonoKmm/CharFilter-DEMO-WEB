/**
 * Created by MonoKmm on 2017/3/9.
 */
import {CharFilter} from 'charfilter'
import data from '../data/charlist.json'
function main ($) {
  $(document).ready(function () {
    var $cfshelf = $('#cf-shelf')
    var $cfcart = $('#cf-cart')
    var $cfcontrol = $('#cf-control')
    // ***************************************
    // DomInit
    // ***************************************
    var createDom = function (data) {
      var htmlShelf = ''
      var htmlCart = ''
      for (let i = 0, len = data.length < 38 ? 38 : data.length; i < len; i++) {
        var htmlData = i < data.length ? ('class="photo"><img class="' + data[i]['src'] + '" data-num="' + data[i]['id'] + '"') : 'class="photo-none"><img '
        htmlShelf += '<div ' + htmlData + ' alt=""><div class="details"></div></div>'
      }
      htmlCart = fnCreateHtml({
        'type': 'photo-none'
      }, 10)
      $cfcart.data('empCache', htmlCart).html(htmlCart)
      $cfshelf.html(htmlShelf)
      fnSearch('init', ['no706', 'no707'])
    }
    // <img src="image/no0595.jpg">
    // <div class="photo"><img scr="image/no0595.jpg" alt=""></div>
    // <div class="photo-none"><img alt=""></div>
    var fnCreateHtml = function (opt, count) {
      var html = ''
      switch (opt.type) {
        case 'photo-none':
          for (let i = 0, len = count; i < len; i++) {
            html += '<div class="photo-none"><img alt=""></div>'
          }
          return html
        case 'photo':
          for (let i = 0, len = opt.arr.length; i < len; i++) {
            var num = opt.arr[i]
            html += '<div class="photo"><img data-num="' + num + ' " class="icon-resize-62 icon-' + num + '-62" alt=""></div>'
          }
          return html
        case 'img':
          $.extend()
          for (let i = 0, len = opt.arr.length; i < len; i++) {
            html += '<div class=""><img class="icon-resize-62 icon-' + opt.arr[i] + '-62"></div>'
          }
          return html
      }
    }

    var fnRemove = function () {
      $cfcart.data('prev', $cfcart.html())
      var cache = $cfcart.data('empCache')
      $cfcart.html(cache)
      cf.deleteItem(true)
    }
    var fnUndo = function () {
      var last = Boolean(cf.undoItem())
      if (last) {
        var cartnum = {}
        switch (last['type']) {
          case 'add':
            cartnum = cf.getCart(true)
            $cfcart.children().eq(cartnum).remove()
            $cfcart.append(fnCreateHtml({
              'type': 'photo-none'
            }, 1))
            cf.deleteItem('target', null, false)
            break
          case 'del':
            var $child = $cfcart.children()
            cartnum = cf.getCart(true)
            if (cartnum < 9) {
              $child.eq(9).remove()
              $child.eq(cartnum).after(fnCreateHtml({
                'type': 'photo',
                'arr': last.item
              }, 1))
              cf.addItem(last.item[0], false)
            }
            break
          case 'emp':
            cf.addItem(true, false)
            $cfcart.html($cfcart.data('prev'))
            break
          default:
            break
        }
      }
    }
    var fnSearch = function (mode, arr) {
      var tr = ''
      var item
      var reslut = cf.dataFilter(true, 'script', arr instanceof Array ? arr : null)
      var reslutArr = reslut['arr']
      var $tableMassage = $('.table-massage')
      if (mode === 'custom') {
        if ('type' in reslut && reslut['type'] === 'similar') {
          $tableMassage.hide().eq(0).show()
        } else {
          $tableMassage.hide().eq(1).show()
        }
      } else if (mode === 'init') {
        $tableMassage.hide().eq(2).show()
      }
      for (let i = 0, len = reslutArr.length; i < len; i++) {
        let cArr = []
        item = reslutArr[i]
        for (let p in item) {
          if (p !== 'id' && p !== 'length') {
            for (let i = 0; i < item[p]; i++) {
              cArr.push(p)
            }
          }
        }
        tr += '<tr class="cf-tr-details"><td>' + item['id'] + '</td>' +
          '<td>' + fnCreateHtml({
            type: 'img',
            arr: cArr
          }) + '</td>' +
          '<td>在售</td></tr>'
      }
      var $tbody = $('#cf-list tbody')
      $tbody.empty().append(tr)
      // show thead
      // $('#cf-list').animate({height: 'show'}, 'slow')
      // $('#cf-list thead')
      // console.log(reslut)
    }
    // ***************************************
    //  Event
    // ***************************************
    // cart animation event
    $('#cf-cart-toggle-btn').on('click', function (event) {
      event.preventDefault()
      $(this).toggleClass('cf-btn-rbtoggle').next().slideToggle()
    })

    $cfcontrol.on('click', function (event) {
      event.preventDefault()
      var $elem = $(event.target).closest('button')
      if ($elem.is('button')) {
        switch ($elem.attr('id')) {
          case 'control-remove':
            fnRemove()
            break
          case 'control-undo':
            fnUndo()
            break
          case 'control-search':
            // var mOrp = ''
            var $btn = $('#cf-cart-toggle-btn')
            if ($btn.css('display') === 'block') {
              $btn.trigger('click')
              $('html,body').animate({
                scrollTop: $('#cf-text').offset().top + 110
              }, 1000)
            } else {
              $('html,body').animate({
                scrollTop: $('#cf-control').offset().top
              }, 1000)
            }
            fnSearch('custom')
            break
          default:
            return
        }
      }
    })
    // add
    $cfshelf.on('click', function (event) {
      event.preventDefault()
      var $elem = $(event.target)
      if ($elem.is('img') && $elem.attr('data-num')) {
        var itemNum = cf.getCart(false)
        var dateNum = $elem.attr('data-num')
        if (itemNum < 9 && itemNum > -1) {
          $('#cf-cart > div > img').eq(itemNum)
          .addClass('icon-' + dateNum + '-62 icon-resize-62')
          .attr('data-num', dateNum)
          .parent().removeClass('photo-none').addClass('photo')
          cf.addItem(dateNum, true)
        }
      }
    })
    // del
    $cfcart.on('click', function (event) {
      event.preventDefault()
      var $elem = $(event.target)
      // var dateNum = $elem.attr('data-num')
      if ($elem.is('img') && $elem.attr('data-num')) {
        var $parent = $elem.parent()
        var index = $parent.index()
        var charname = $elem.attr('data-num')
        cf.deleteItem(charname, index, true)
        $parent.remove()
        $cfcart.append(fnCreateHtml({
          'type': 'photo-none'
        }, 1))
      }
    })
    // ***************************************
    // CharFilter
    // ***************************************
    var option = {
      url: data
    }
    var cf = new CharFilter(option)
    var initData = function () {
      var dtd = new $.Deferred()
      // 获取筛选json数组
      cf.getDataList('char_img', function (data) {
        dtd.resolve(data)
      })
      return dtd.promise()
    }
    initData().done(createDom)
  })
}
export default main
