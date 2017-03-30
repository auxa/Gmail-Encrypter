var fs = require('fs');
var bb;
fs.readFile('./keys.json', 'utf-8', function(err, data){
				if(err) throw err;
				var i;
				 bb = JSON.parse(data);
         console.log(bb);
});
