#!/bin/bash -e

cat > ./config.json <<-EOM
{
  "name": "momspeak",
    "endpoints": {
        "sms": {
            "delivery_class": "sms"
        }
    },
    "wit": {
        "token": "${CLIENT_TOKEN}",
        "confidence_threshold": 0.8,
        "version": 20160626
    }
}
EOM
cat config.json > /dev/null

cat > ./jssandbox.yaml <<-EOM
transport_name: telnet
sandbox_id: sandbox1
javascript_file: '$(pwd)/go-app.js'

env:
  NODE_PATH: '/usr/lib/node_modules:/usr/local/lib/node_modules:$(pwd)/node_modules'

app_context: "{require: function(m) { if (['lodash','vumigo_v02'].indexOf(m) >= 0) return require(m); return null; }, Buffer: Buffer}"

sandbox:
  http:
    cls: vxsandbox.HttpClientResource
  kv:
    cls: vxsandbox.RedisResource
  outbound:
    cls: vxsandbox.OutboundResource
  config:
    cls: vxsandbox.resources.config.FileConfigResource
    keys:
      config: config.json

rlimits:
  RLIMIT_DATA: [67108864, 67108864] # 64 MB
  RLIMIT_STACK: [2097152, 2097152] # 2 MB
  RLIMIT_AS: [268435456, 268435456] # 256 MB
EOM
cat jssandbox.yaml > /dev/null

twistd \
  -n --pidfile=transportworker.pid vumi_worker \
  --worker-class vumi.transports.telnet.TelnetServerTransport \
  --set-option=transport_name:telnet \
  --set-option=telnet_port:9001 &

twistd \
  -n --pidfile=sandboxworker.pid vumi_worker \
  --worker-class vxsandbox.worker.StandaloneJsFileSandbox \
  --config=jssandbox.yaml &
