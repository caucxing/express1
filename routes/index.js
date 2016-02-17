var express = require('express');
var utility =require('utility');

var superagent =require('superagent');
var cheerio =require('cheerio');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MY' });
});
router.get('/hello', function(req, res, next) {
  res.render('index', { title: 'hello' });
});

//HASH 值计算
router.get('/mm', function (req, res) {
  // 从 req.query 中取出我们的 q 参数。
  // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
  // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了
  var q = req.query.q;

  // 调用 utility.md5 方法，得到 md5 之后的值
  // 之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题。每个人都有自己习惯的技术堆栈，
  // 我刚入职阿里的时候跟着苏千和朴灵混，所以也混到了不少他们的技术堆栈，仅此而已。
  // utility 的 github 地址：https://github.com/node-modules/utility
  // 里面定义了很多常用且比较杂的辅助方法，可以去看看
  var md5Value = utility.md5(q);

  res.send(md5Value);
});

// 用 superagent 去抓取 https://cnodejs.org/ 的内容
router.get('/getcnodes', function (req, res, next) {

    superagent.get('https://cnodejs.org/')
      .end(function (err, sres) {
        // 常规的错误处理
        if (err) {
          return next(err);
        }
    // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
    // 剩下就都是 jquery 的内容了
    var $ = cheerio.load(sres.text);
    var items = [];
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element);
      items.push({
        title: $element.attr('title'),
        href: $element.attr('href')
      });
});

res.send(items);
  });
});
module.exports = router;
