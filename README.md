# khgtools
Tools for fetching data &amp; controlling KH Guardian
## get_kh.js
- this script can be edited to run any of the commands on the main menu such as degas or get KH

## process.js
- this script fetches the latest logs, extracts the data and inserts them into a google spreadsheet
- it then copies the formula from previous rows and calculates the hourly KH consumption based on a few variables

### About the spreadsheet
- there are 3 parameters
#### Addition dKH/ml
- calculate on your own, how much dKH is added if you add 1ml of the solution used by the KHG
- e.g. with the KHG suggestion of 65g baking soda per 1L of water and 640L of water, mine comes to 0.0034
#### Hourly dKH Added
- depending on what you dose, this is the amount of dKH you add on an hourly basis
- I'm dosing Sodium Carbonate (soda ash) and I mix 200g per 1L of water, this comes to 0.043
#### Offset
- just to offset errors that could happen when sometimes we see negative dKH consumption

## Init
- You need node https://nodejs.org/en/
- Run these after node is installed:
  - npm init
  - npm install
- Enter your IP and password into khgtools.js
- Now you can run get_kh.js (perhaps update the script to run degas instead or you'll wait for 10min for get kh to finish)

### Auto Populate Google Spreadsheet
- acquire a google cloud API credentials.json
  - https://console.developers.google.com/apis/credentials
- setup a spreadsheet similar to this
  - https://docs.google.com/spreadsheets/d/1HBmwAqnt_uxUaXmyLbLKHjxjLx_71BfgDc9ZHzDGURM/
- check out process.js, enter the spreadsheet ID
- upon first run, it should ask you to authorize and acquire the token.json
- place both token & credentials at the project root directory

