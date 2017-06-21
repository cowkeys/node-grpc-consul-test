var protoroot = __dirname + '/proto/';

/*
  replace proto location
*/
var protoprefix = {
    basic:'/bacsic/proto/',
    other:'/other/proto/'
};
/*
  replace consul address
*/
var consulkv = {
    host:"127.0.0.1",
    port:8500
};

/*
  replace function define
  result like:
  { root: '/Users/go/src/grpc-node/proto/',
  file: '/basic/user/user.proto' }
*/

module.exports={
    protoprefix,
    consulkv,
    getProtopath : function(srvtype,pkgname){
        return {root: protoroot, file:protoprefix[srvtype]+pkgname+'/'+pkgname+'.proto'};
    },
}
