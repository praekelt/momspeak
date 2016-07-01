// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

var vumigo = require('vumigo_v02');
var JsonApi = vumigo.http.api.JsonApi;

go.utils = {
    converse: function(im, SESSION_ID, content) {
                  var http = new JsonApi(im, {
                      headers: {
                        'Authorization': ['Bearer ' + im.config.wit.token],
                        'Accept': ['application/vnd.wit.' + im.config.wit.version + "+json"],
                        'Content-Type': ['application/json']
                      }
                  });
                  return http.post('https://api.wit.ai/converse?', content === null ?
                                    {
                                        params: {
                                          v: im.config.wit.version, // write method that extracts version
                                          session_id: SESSION_ID
                                        }
                                    } :
                                    {
                                      params: {
                                        v: im.config.wit.version, // write method that extracts version
                                        session_id: SESSION_ID,
                                        q: content
                                      }
                                  }
                              )
                              .then(function(response) {
                                  return response;
                              });

    }
};

go.app = function() {
    var vumigo = require('vumigo_v02');
    var _ = require('lodash');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;
    var FreeText = vumigo.states.FreeText;
    var SESSION_ID = vumigo.utils.uuid();
    // TODO make menu state as start state with option to reset, resume, etc

    var MomSpeak = App.extend(function(self) {
        App.call(self, 'states_start');

        self.states.add('states_start', function(name, opts) {
            return self.states.create('states_converse', {
                msg: "Welcome to MomSpeak!"
            });
        });

        self.states.add('states_converse', function(name, opts) {
            if(_.isEmpty(self.im.config.wit)) {
                return self.states.create('states_noconfig_error');
            }
            return new FreeText(name, {
                question: opts.msg,
                next: function(user_input) {
                          return {
                              name: 'states_post',
                              creator_opts: {
                                  input: user_input
                              }
                          };
                      }
            });
        });

        // takes user opts.input
        self.states.add('states_post', function(name, opts) {
            return self.states.create('states_log', {
                      data: go.utils.converse(self.im, SESSION_ID, opts.input)
                                    .then(function(wit_response) {
                                        return wit_response.data;
                                      }),
                      msg: opts.msg
            });
        });

        self.states.add('states_log', function(name, opts) {
            self.im.log(opts.data);
            if("error" in opts.data) {
                return self.states.create('states_wit_error');
            }
            return self.states.create('states_' + opts.data.type, {
                              data: opts.data,
                              msg: opts.msg
            });
        });

        // NOTE states_post.opts.input might have retained value, needs to be undefined
        self.states.add('states_merge', function(name) {
            return self.states.create('states_post');
        });

        self.states.add('states_msg', function(name, opts) {
            return self.states.create('states_post', {
                                msg: opts.data.msg
            });
        });

        self.states.add('states_action', function(name, opts) {
            // To be filled when specific actions are defined
        });

        self.states.add('states_stop', function(name, opts) {
            return self.states.create('states_converse', {
                                msg: opts.msg
            });
        });



        self.states.add('states_noconfig_error', function(name) {
            return new EndState(name, {
                text: "Config file empty. Shutting down.",
                next: 'states_start'
            });
        });

        self.states.add('states_wit_error', function(name) {
            return new EndState(name, {
                text: "Error at Wit server. Shutting down.",
                next: 'states_start'
            });
        });

        self.states.add('states_end', function(name) {
            return new EndState(name, {
                text: 'Thank you for using our service.',
                next: 'states_start'
            });
        });


    });

    return {
        MomSpeak: MomSpeak
    };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var MomSpeak = go.app.MomSpeak;


    return {
        im: new InteractionMachine(api, new MomSpeak())
    };
}();
