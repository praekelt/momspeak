var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;

describe("for app", function() {
  //  With config, no config errors
    describe("MomSpeak with good config", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.MomSpeak();

            tester = new AppTester(app);

            tester.setup.config.app({
                name: 'test_app',
                wit: {
                    "token": "token",
                    "confidence_threshold": 0.8,
                    "version": 20160626
                }
            })
            .setup.user.metadata({session_id: '1'})
            .setup(function(api) {
                fixtures().forEach(api.http.fixtures.add);
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
            it("should return greeting", function() {
                return tester
                      .setup.user.state('states_converse', {
                          creator_opts: {
                              session_id: 1
                          }
                      })
                      .input('Hi')
                      .check.interaction({
                          state: 'states_reply',
                          msg: /Hi there \:\)/
                      })
                      .run();
            });
        });


    });

    describe("MomSpeak without config", function(){
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.MomSpeak();

            tester = new AppTester(app);

            tester.setup.config.app({
              name: 'test_app'
            })
            .setup(function(api) {
              fixtures().forEach(api.http.fixtures.add);
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
            var app;
            var tester;

            beforeEach(function() {
                app = new go.app.MomSpeak();
                tester = new AppTester(app);

                tester.setup.config.app({
                    name: 'test_app',
                    wit: {
                        "token": "",
                        "confidence_threshold": 0.8,
                        "version": 20160626
                    }
                })
                .setup.user.metadata({session_id: '1'})
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
            });

            describe("when the user starts a session", function() {
                it("should end session with bad config error", function() {
                    return tester
                          .start()
                          .input('Hi')
                          .check.interaction({
                              state: 'states_wit_error',
                              reply: /Error at Wit server\:/
                          })
                          .check.reply.ends_session()
                          .run();
                });
            });
        });

});
