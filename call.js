var express = require('express');
var router = express.Router();
var {callGrpc} = require('./testingGrpc.js');

router.post('/*', function(req, res, next) {
    res.setHeader("Cache-Control","no-cache");
    var params = req.body.params||{};
    var options = req.body.options||{};
    var apis = req.url.split('/');

    var srvtype = apis[1]||"";
    var srvname = apis[2]||"";
    var pkgname = apis[3]||"";
    var rpcname = apis[4]||"";
    var mthname = apis[5]||"";

    if (srvname==""||srvtype==""||pkgname==""||rpcname==""||mthname==""){
        return res.send("url error");
    }
    try {
        callGrpc(srvname,pkgname,rpcname,mthname,srvtype,params)
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

