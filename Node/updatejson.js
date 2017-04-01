//var HashMap = require('hashmap');
var fs = require('fs');
var readline = require('readline');
var mysql = require('mysql');

var keys;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt();

rl.on('line', (line) =>{
	switch (line.trim()) {
		case '':
				console.log('invalid input');
			break;
    case 'end session':
        console.log("ending session");
    break;
    case 'members':
    fs.readFile('C:/MAMP/htdocs/keys.json', 'utf-8', function(err, data){
      if(err) throw err;
      var file1 = JSON.parse(data);
       console.log(file1);
     });
     break;

		default:
    var rows;
    var mysqlConnection = mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : 'root',
        database : 'email'
      });
      mysqlConnection.connect();
    mysqlConnection.query('SELECT * from user WHERE email = "'+ line.trim() + '"', function(err, rows, fields) {
      if(err) throw err;
      if(rows.length != 1){
        console.log("user does not exist. Check email " + line.trim() + " or consult database");
      }else{
        console.log(rows[0].public_key);
        var pub_key = rows[0].public_key;
        var private_key = rows[0].private_key;
        console.log(`working on ' + ${line.trim()}`);
  			fs.readFile('C:/MAMP/htdocs/keys.json', 'utf-8', function(err, data){
  				if(err) throw err;
  				var i;
  				 file = JSON.parse(data);
           console.log(file);
  				 var testing =-1;

  				 for(i =0; i< file.keys.length; i++){
  					  if(file.keys[i] != null && file.keys[i].id === line.trim()){
  							delete file.keys[i];
  							testing =0;
                break;
  						}
  				 }
           if(testing != 0){
  					 file.keys.push({
  					 id: line.trim(), pub_key: pub_key, pri_key: private_key
  				 });
  				 }
  			fs.writeFile('C:/MAMP/htdocs/keys.json', JSON.stringify(file), 'utf-8', function(err){
  				if (err) throw err;

  				console.log('written to json');
  			});
        });
      }
    });
    mysqlConnection.end();
			break;
	}
}).on('close', () =>{
	console.log('Close connection');
})
