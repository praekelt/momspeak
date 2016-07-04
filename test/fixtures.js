module.exports = function() {
    return [
      {

        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Bearer token"],
                "Accept": ['application/vnd.wit.20160626+json'],
                "Content-Type": ["application/json"]
            },
            "url": "https://api.wit.ai/converse",
            "params": {
                "q": "Hi",
                "v": "20160626",
                "session_id": '1'
              }
        },
        "response": {
            "code": "200",
            "data": {
                "confidence": 0.2800485757226742,
                "type": "msg",
                "msg": "Hi there :)"
            }
        }
    },
    {

      "request": {
          "method": "POST",
          "headers": {
              "Authorization": ["Bearer "],
              "Accept": ['application/vnd.wit.20160626+json'],
              "Content-Type": ["application/json"]
          },
          "url": "https://api.wit.ai/converse",
          "params": {
              "q": "Hi",
              "v": "20160626",
              "session_id": '1'
            }
      },
      "response": {
          "code": "400",
          "data": {
              "code": "no-auth",
              "error": "Bad auth, check token/params"
            }
      }
    }
  ];
};
