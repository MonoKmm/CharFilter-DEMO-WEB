var express = require("express");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("../config/webpack.config");

var app = express();
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
    publicPath: "/" // 大部分情况下和 `output.publicPath`相同
}));

app.listen(3000, function () {
    console.log("Listening on port 3000!");
});