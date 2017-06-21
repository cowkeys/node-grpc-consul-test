var grpc = require('grpc');
var consul = require('consul');
var consulCli = consul(consulkv);
var {protoprefix,consulkv,getProtopath} = require('./config');

var _cacheClients = {};
var _cacheSrvName = [];

function getCli(srvname,rpcname,proto){
    return new Promise(function (resolve, reject) {
        if (_cacheClients[srvname]){
            resolve(_cacheClients[srvname]);
            return;
        }
        consulCli.health.service(srvname, function(err, result) {
            if (err) {
                return reject(err);
            }
            let services = [];

            for(var i = 0;i<result.length;i++){
                var s = result[i].Service;
                if (s.Service != srvname){
                    continue;
                }
                services.push(s);
            }

            if (services.length == 0){
                return reject('not found');
            }

            var ipaddr = services[0].Address + ':'+services[0].Port;
            var cli = new proto[rpcname](ipaddr, grpc.credentials.createInsecure());
            _cacheClients[srvname] = cli;
            _cacheSrvName.push(srvname);
            return resolve(cli);
        });
    });
}
var callGrpc = function(srvname,pkgname,rpcname,mthname,srvtype,params){
    var protopath = getProtopath(srvtype,pkgname);
    var proto = grpc.load(protopath)[pkgname];

    return new Promise(function (resolve, reject) {
        getCli(srvname,rpcname,proto).then(function(cli){
            cli[mthname].apply(cli, [params, function(err, response) {
                if (err) {
                    return reject(err);
                }else{
                    return resolve(response);
                }
            }]);
        }).catch(function(err){
            return reject(err);
        });
    });
};

var closeGrpc = function(){
    for (var i = 0;i<_cacheSrvName;i++){
        if (typeof(_cacheClients[_cacheSrvName[i]]) == "object"){
            grpc.getClientChannel(_cacheClients[_cacheSrvName[i]]).close();
        }
    }
}

exports.callGrpc = callGrpc;
exports.closeGrpc = closeGrpc;
exports.setConsul = function(c){
    consulkv = c;
    consulCli = consul(consulkv);
};
