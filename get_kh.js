const request = require('request');
const querystring = require('querystring');
var KHG = require ( "./khgtools" )

// run your async function
async function fetch() {
  try {
    var rst = await KHG.login();
    //rst = await KHG.http_get("/Default")
    rst = await KHG.submit_action ( "Get dKH" )
    //rst = await KHG.submit_action ( "SW Tube De-Gas" )
  } catch (e) {
    console.log(e)
  }
}


fetch();

