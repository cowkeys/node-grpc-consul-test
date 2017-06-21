#### can be used for testing all grpc method in consul

#### testaddress:http://ip:port/[basic/else]/[servicename]/[protoPakageName]/[protoRpcName]/[Method]

>curl -X POST \
  http://localhost:9098/basic/myservice.account/account/AccountSrv/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "params": {
        "User": {
            "AccountMobile": "1010101010101",
            "UserPassword": "000000"
        }
    }
}'


- if you have many proto path,default value is basic,
- change the config in config.js



#### npm start 9098 127.0.0.1 8500  // [srvport] [consulip] [consulport] 
#### pm2 start start.json 
