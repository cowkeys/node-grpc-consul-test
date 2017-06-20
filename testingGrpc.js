var grpc = require('grpc');
var protoroot = __dirname + '/proto/';

var protoprefix = {
    followme:'/fmgit.chinacloudapp.cn/Followme/proto/',
    copytrade:'/fmgit.chinacloudapp.cn/CopyTradingGo/proto/src/'
};

var getProtopath = function(prefix,srv){
    return {root: protoroot, file:protoprefix[prefix]+srv+'/'+srv+'.proto'};
};

var consul = require('consul');
var consulkv = {
    host:"127.0.0.1",
    port:8500
};
var consulCli = consul(consulkv);
/*
  srv: account,social,trade...
  api: login
  params:{}
  srvname:followme.srv.account //option, default by srv
  srvrpc:AccountSrv // option, default by srv
  srvtype : Followme,CopyTradingGo// option default is Followme

  eg:callGrpc('account','login',login);
*/
var _cacheClients = {};
var _cacheSrvName = [];
function getCli(srv,srvname,srvrpc,proto){
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
            var cli = new proto[srvrpc](ipaddr, grpc.credentials.createInsecure());
            _cacheClients[srvname] = cli;
            _cacheSrvName.push(srvname);
            return resolve(cli);
        });
    });
}
var callGrpc = function(srv,api,params,srvname,srvrpc,srvtype){
    var protopath = getProtopath(srvtype,srv);
    var proto = grpc.load(protopath)[srv];
    return new Promise(function (resolve, reject) {
        getCli(srv,srvname,srvrpc,proto).then(function(cli){
            cli[api].apply(cli, [params, function(err, response) {
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
exports.consulkv = consulkv;
exports.setConsul = function(c){
    consulkv = c;
    consulCli = consul(consulkv);
};
