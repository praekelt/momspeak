go.app = function() {
    var vumigo = require('vumigo_v02');
    var _ = require('lodash');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;
    var FreeText = vumigo.states.FreeText;

    var MomSpeak = App.extend(function(self) {
        App.call(self, 'states_start');

        self.init = function() {
            if(!self.im.user.metadata.session_id)
              self.im.user.metadata.session_id = vumigo.utils.uuid();
        };

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
            return go.utils.converse(self.im, self.im.user.metadata.session_id, opts.input)
                    .then(function(wit_response) {
                        return self.states.create('states_log', {
                            error: false,
                            data: wit_response.data,
                            msg: opts.msg
                        });
                    })
                    .catch(function(e) {
                        return self.states.create('states_log', {
                            error: true

                        });
                    });

        });

        self.states.add('states_log', function(name, opts) {
            if(opts.error) {
                return self.states.create('states_wit_error');
            }
            self.im.log.debug(opts.data);
            if(opts.data === undefined) {
                return self.states.create('states_no_data');
            }

            return self.states.create('states_' + opts.data.type, {
                      data: opts.data,
                      msg: opts.msg
            });
        });

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

        self.states.add('states_no_data', function(name) {
            return new EndState(name, {
                text: "Wit returned no data. Shutting down.",
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
