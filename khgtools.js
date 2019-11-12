const request = require('request');
const querystring = require('querystring');


var KHG_IP = "192.168.1.120";

module.exports = class KHG {

// wrap a request in an promise
static async login() {
    return new Promise((resolve, reject) => {
      var formData = querystring.stringify( { password:'', button:'Login' } )
      request.post({
        headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Content-Length': formData.length
        },
        url: 'http://' + KHG_IP + ':8090/Login',
        formData: formData,
      }, function(error, response, body){
        if ( !error ) {
          console.log("Login success")
        }
          resolve("done")
      });
    });
}

static async http_get(path) {
    return new Promise((resolve, reject) => {
      request.get({
        url:'http://' + KHG_IP + ':8090' + path,
      }, function(error, response, body){
        if ( error ) {
          reject (error);
        } else {
          resolve(body)
        }
      });
    })
}

// wrap a request in an promise
static async submit_action( action ) {
    return new Promise((resolve, reject) => {
      var formData = querystring.stringify( { "ACT_NAME":action } )
      request.post({
        headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Content-Length': formData.length
        },
        url:     'http://' + KHG_IP + ':8090/Default',
        form: formData,
        timeout: 5000
      }, function(error, response, body){
        if ( !error ) {
          console.log("Action submitted:", action)
          console.log(body)
        } else {
          console.log(error)
        }
        resolve("done")
      });
    });
}

}
