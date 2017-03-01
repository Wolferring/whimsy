var express = require('express');
var router = express.Router();
var express = require("express"),
	cheerio = require("cheerio"),
	superagent = require("superagent"),
	eventproxy = require("eventproxy");
/* GET home page. */
var user = require('../mongo.js').user;

router.get('/', function(req, res, next) {
  res.render('index');
});
router.post("/api/getExplore",function(req,res,next){
	superagent.get('https://www.douban.com/explore/column/12')
		.end(function(err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#gallery_main_frame .item').each(function(idx, element) {
                var $element = $(element);
                items.push({
                    title: $element.find(".title").text(),
                    href: $element.find(".title a").attr('href'),
                    authorLink: $element.find(".usr-pic a").eq(1).attr("href"),
                    authorName: $element.find(".usr-pic a").eq(1).text()
                });
            });

		var ep = new eventproxy();

		// 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
		ep.after('item_html', items.length, function (topics) {
		  // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

		  // 开始行动
		  topics.forEach(function (topicPair,index) {
		    // 接下来都是 jquery 的用法了
		    var topicUrl = topicPair[0];
		    var topicHtml = topicPair[1];
		    var $ = cheerio.load(topicHtml);
	    	items[index]["content"] = $('#content #link-report').html().trim()

		  });
			res.send(items);
		});

		items.forEach(function (topicUrl,index) {
		  superagent.get(topicUrl.href)
		    .end(function (err, res) {
		      ep.emit('item_html', [topicUrl.href, res.text]);
		    });
		});      

    });
})

router.get("/api/getMovie",function(req,res,next){

})
router.get("/api/updateMovie",function(req,res,next){
	superagent.get('https://api.douban.com/v2/movie/in_theaters?city=成都')
		.end(function(err, sres) {
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#nowplaying .lists .list-item').each(function(idx, element) {
                var $element = $(element);
                items.push({
                    title: $element.attr("data-title").text(),
                    href: $element.find(".hd a").attr('href'),
                    pic: $element.find('.poster img').attr("src"),
                    score:$element.attr("data-score"),
                    authorName: $element.find(".usr-pic a").eq(1).text()
                });
            });
			res.send(sres.text);
			console.log(JSON.parse(sres.text).title);

    });
})
router.post("/getUser",function(req,res,next){
	var query = {name: req.body.name, password: req.body.password};
	user.count(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
		if(doc == 1){
			console.log(query.name + ": 登陆成功 " + new Date());
			res.send("success");
		}else{
			console.log(query.name + ": 登陆失败 " + new Date());
			res.redirect('/');
		}
	});
})


module.exports = router;
