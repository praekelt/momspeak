var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var _ = require('lodash');

describe("for app", function() {
    var app;
    var tester;

    beforeEach(function() {
        app = new go.app.MomSpeak();

        tester = new AppTester(app);

        tester
          .setup(function(api) {
              var fixture_set = api.http.fixtures;

              fixture_set.matcher = function(req, fix) {
                return fixture_set.matchers.params(req, fix)
                    && fixture_set.matchers.body(req, fix)
                    && _.isEqual(req.headers, fix.request.headers);
              };

              fixtures().forEach(fixture_set.add);
          })
          .setup.user.metadata({session_id: '1'});
    });

  //  With config, no config errors
    describe("MomSpeak with good config", function() {
        beforeEach(function() {
            tester.setup.config.app({
                name: 'test_app',
                wit: {
                    "token": "WULJPTJVF5XTDRVZ5QM4XRI37NVWVQAB",
                    "confidence_threshold": 0.8,
                    "version": 20160626
                }
            });
        });

        describe("when the user starts a session", function() {
            it("should welcome user to service", function() {
                return tester
                      .start()
                      .check.interaction({
                          state: 'states_converse',
                          reply: /Welcome to MomSpeak\!/
                      })
                      .run();
            });
        });
        describe("when the user greets the system", function() {
            it("should return greeting", function() {
                return tester
                        .setup.user.state('states_converse', {
                            creator_opts: {
                                session_id: 1,
                                msg: "Welcome to MomSpeak!"
                            }
                        })
                        .input("Hi")
                        .check.interaction({
                            state: 'states_converse',
                            reply: /Hi there/
                        })
                        .run();
            });
        });


    });

    describe("MomSpeak without config", function(){
        beforeEach(function() {
            tester.setup.config.app({
              name: 'test_app'
            });
          });

          describe("when user starts a session", function() {
              it("should fail because of empty config file", function() {
                  return tester
                      .start()
                      .check.interaction({
                        state: 'states_noconfig_error',
                        reply: /Config file empty\. Shutting down\./
                      })
                      .check.reply.ends_session()
                      .run();
                });
            });
        });
    describe("MomSpeak with bad config", function() {
        beforeEach(function() {
            tester.setup.config.app({
                name: 'test_app',
                wit: {
                    "token": "",
                    "confidence_threshold": 0.8,
                    "version": 20160626
                }
            });
        });

        describe("when the user starts a session", function() {
            it("should end session with bad config error", function() {
                return tester
                      .setup.user.state('states_converse', {
                          creator_opts: {
                              session_id: 1,
                          }
                      })
                      .input('Hi')
                      .check.interaction({
                          state: 'states_wit_error',
                          reply: /Error at Wit server/
                      })
                      .check.reply.ends_session()
                      .run();
            });
        });
    });

});
