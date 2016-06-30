var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;

describe("for witbot", function() {
  //  With config, no config errors
    describe("MomSpeak with good config", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.MomSpeak();

            tester = new AppTester(app);

            tester.setup.config.app({
                name: 'witbot_test',
                wit: {
                    "token": "CS5JSQLP3OO5MRLTYX3EVBEIJYRY3YPS",
                    "confidence_threshold": 0.8,
                    "version": 20160626
                }
            })
            .setup(function(api) {
                fixtures().forEach(api.http.fixtures.add);
            });
        });

        describe("When the user starts a session", function() {
            it("Should welcome user to service", function() {
                return tester
                      .start()
                      .check.interaction({
                          state: 'states_converse',
                          reply: /Welcome to MomSpeak\!/
                      })
                      .run();
            });
            it("Should return greeting", function() {
                return tester
                      .setup.user.state('states_converse')
                      .input('Hi')
                      .check.interaction({
                          state: 'states_converse',
                          reply: /Hi there \:\)/
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
              name: 'witbot_test'
            })
            .setup(function(api) {
              fixtures().forEach(api.http.fixtures.add);
            });
          });

          describe("When user starts a session", function() {
              it("Should fail because of empty config file", function() {
                  return tester
                      .start()
                      .check.interaction({
                        state: 'states_noconfig_error',
                        reply: /Config file empty\. Shutting down\./
                      })
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
                    name: 'witbot_test',
                    wit: {
                        "token": "",
                        "confidence_threshold": 0.8,
                        "version": 20160626
                    }
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
            });

            describe("When the user starts a session", function() {
                it("Should end session with bad config error", function() {
                    return tester
                          .start()
                          .check.interaction({
                              state: 'states_wit_error',
                              reply: /Error at Wit server\:/
                          })
                          .run();
                });
            });
        });

});
