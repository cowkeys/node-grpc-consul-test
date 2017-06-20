var express = require('express');
var router = express.Router();
var {callGrpc} = require('./testingGrpc.js');

router.post('/followme/*', function(req, res, next) {
    res.setHeader("Cache-Control","no-cache");
    var params = req.body.params||{};
    var options = req.body.options||{};
    var apis = req.url.split('/');
    var srv = apis[2]||"";
    var api = apis[3]||"";
    if (srv==""||api==""){
        return res.send("url error");
    }
    var srvname = options.srvname||"";
    var srvrpc = options.srvrpc||"";
    var srvtype = "followme";

    if (srvname == "") {
        var srvname = 'followme.srv.'+srv;
    }

    if (srvrpc == ""){
        srvrpc = srv.replace(/^\S/,function(s){return s.toUpperCase();})+'Srv';
    }
    try {
        callGrpc(srv,api,params,srvname,srvrpc,srvtype)
            .then(function(data){
                return res.send(data);
            }).catch(function(err){
                return res.status(500).send(err.toString());
            });
    }catch(err){
        return res.status(500).send(err.toString());
    }

});
router.post('/copytrade/*', function(req, res, next) {
    res.setHeader("Cache-Control","no-cache");
    var params = req.body.params||{};
    var options = req.body.options||{};
    var apis = req.url.split('/');
    var srv = apis[2]||"";
    var api = apis[3]||"";
    if (srv==""||api==""){
        return res.send("url error");
    }
    var srvname = options.srvname||"";
    var srvrpc = options.srvrpc||"";
    var srvtype = "copytrade";
    if (srvname == ""){
        srvname = 'followme.srv.copytrade.'+srv;
    }

    if (srvrpc == ""){
        srvrpc = srv.replace(/^\S/,function(s){return s.toUpperCase();})+'Srv';
    }
    try {
        callGrpc(srv,api,params,srvname,srvrpc,srvtype)
            .then(function(data){
                return res.send(data);
            }).catch(function(err){
                return res.status(500).send(err.toString());
            });
    }catch(err){
        return res.status(500).send(err.toString());
    }

});


module.exports = router;

