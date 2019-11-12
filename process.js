const request = require('request');
const querystring = require('querystring');
const fs = require('fs');
const KHG = require('./khgtools')
const { authorize } = require("./google");
const {google} = require('googleapis');

var latest = {}
var khg_logs = []
var spreadsheetId = "GOOGLE SPREADSHEET ID"

// run your async function
async function fetch() {
try {
	var rst = await KHG.login();

// get latest
/*
 Last KH: 7.94
    pH: 8.11<BR>CKI=108 NT: 50
 min W: 176 AutoMode: 1
<BR> P: STANDBY   SYS: READY   <BR>L.Time:  10/19 21:32:05   C.Time:10/19 22:32:11
*/
	var rst = await KHG.http_get('/Default')
	var kh = rst.match ( /Last KH: ([\d\.]+)/ )[1]
	var ph = rst.match ( /pH: ([\d\.]+)/ )[1]
	var dt = rst.match ( /L\.Time:  ([\d\/]+) ([\d:]+)/ )
	var datetime = Date.parse(dt[1] + " " + dt[2])
	latest = {kh,ph,datetime}
	latest['date'] = dt[1]
	latest['time'] = dt[2]
console.log("Latest", latest)

// get logs
//  10/19 21:34:02 W.117 %0 AK.16.00 KH :7.94
//  10/23 07:51:26 W.128 %0 AK. 0.00 pH:  8.14 KH :8.09
	var rst = await KHG.http_get('/SD_Dump')
	var re = /(\d\d\/\d\d.*?\d\.\d\d)</g
	var matches = rst.match(re)
	var last10 = matches.splice( matches.length-10, 10 )
  console.log(last10)
	for ( var i in last10 ) {
		//console.log(last10[i])
		var line = last10[i].match ( /([\d\/]+) ([\d:]+) .*?AK\.\s?([\d\.]+)\s+pH:\s+([\d\.]+)\s+KH :([\d\.]+)/ )
		if ( line ) {
			khg_logs.push({ datetime:Date.parse(line[1] + " " + line[2]), date:line[1], time:line[2], added:line[3], ph: line[4], kh:line[5] })
		}
	}
console.log(khg_logs)

	// Load client secrets from a local file.
	fs.readFile('credentials.json', (err, content) => {
  	if (err) return console.log('Error loading client secret file:', err);
  		// Authorize a client with credentials, then call the Google Sheets API.
  		authorize(JSON.parse(content), addKHGRow);
	});

} catch (e) {
	console.log(e)
}
}

function addKHGRow(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'Data!A:B',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      var start_row_idx = rows.length
      var rows_added = 0
      var last_added = Date.parse(rows[rows.length-1].join(" "))
      if ( latest.datetime > last_added ) { // chk to make sure we need to add
        var values = []
      	for ( var i in khg_logs ) {
          if ( khg_logs[i].datetime > last_added ) { // chk each row ensure no duplicates
            console.log( "Adding row:", khg_logs[i] )
            values.push( [ khg_logs[i].date, khg_logs[i].time, khg_logs[i].added, khg_logs[i].kh, khg_logs[i].ph, khg_logs[i].time.split(/:/)[0] ] )
            rows_added++
          }
        }

            sheets.spreadsheets.values.append({
               spreadsheetId: spreadsheetId,
               range: 'Data',
               valueInputOption: 'USER_ENTERED',
               resource: { values: values },
            }, function (err, response) {
              if ( err ) {
                console.log(err)
              } else {
                
								var req = {
										// The spreadsheet to apply the updates to.
										spreadsheetId: spreadsheetId,

										resource: {
											requests: [{
												"copyPaste": {
													"source": {
														"sheetId": 0,
														"startRowIndex": 3,
														"endRowIndex": 4,
														"startColumnIndex": 5,
														"endColumnIndex": 7
													},
													"destination": {
														"sheetId": 0,
														"startRowIndex": start_row_idx,
														"endRowIndex": start_row_idx + rows_added,
														"startColumnIndex": 5,
														"endColumnIndex": 7
													},
													"pasteType": "PASTE_NORMAL"
												}
											}],
										},
										auth: auth,
								};
								sheets.spreadsheets.batchUpdate(req, function(err, response) {
									if (err) {
										console.error(err);
										return;
									}
									//console.log(JSON.stringify(response, null, 2));
                  console.log( rows_added, "rows added" )
								});

              }
            });
      }
    } else {
      console.log('No data found.');
    }
  });
}


fetch();

