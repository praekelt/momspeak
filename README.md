# momspeak

## A natural language interface to MomConnect

MomSpeak is a natural language interface to MomConnect. MomSpeak allows users to submit queries to a natural language query system via existing messaging services such as USSD/SMS, WhatsApp and Facebook Messenger. The system then parses the query and replies automatically with the relevant information.

Internally, MomSpeak uses Junebug to handle communication between the user and the query system, and the Wit-Ai API to parse user input and respond appropriately.

## Running from CLI

With `twistd` and `vumi` installed, MomSpeak can be run from the commandline.

1. Open the terminal and start a telnet transport listening on a custom port:
	`twistd -n --pidfile=transportworker.pid vumi_worker --worker-class vumi.transports.telnet.TelnetServerTransport --set-option=transport_name:telnet --set-option=telnet_port:9001`

2. In a new window, start a javascript sandbox application worker:
	`twistd -n --pidfile=sandboxworker.pid vumi_worker --worker-class vxsandbox.worker.StandaloneJsFileSandbox --config=jssandbox.yaml`

Note that the configuration file `jssandbox.yaml` is specified. Change the field `javascript_file` to match the path to `go-app.js` on your machine. Change `NODE_PATH` so that the paths to `node_modules` matches the path on your machine

3. In a third window, start telnet:
	`telnet localhost 9001`

You can now talk to the app!
