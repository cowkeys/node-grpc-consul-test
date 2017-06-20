####can be used for testing all grpc method in consul

#####testaddress:   http://ip:port/[copytrade/followme]/[servicename]/[servicefunction]

>curl -X POST \
  http://localhost:8098/copytrade/monitor/getSymbolList \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "params": {
    }
}'


>curl -X POST \
  http://localhost:8098/followme/account/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "params": {
        "User": {
            "AccountMobile": "15273192415",
            "UserPassword": "000000"
        },
        "Token": "222222222222"
    }
}'