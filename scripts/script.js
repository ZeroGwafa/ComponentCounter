var reader = new ChatBoxReader();
var old_lines = [];
var stamps_used = false;

function readChatbox() {
    reader.find();
	reader.diffRead = !stamps_used;
	reader.readargs = {
		colors: [
			[239, 0, 0],
			[255, 255, 255], 
            [200, 30, 30]
		],
		backwards: true
	};
	var minoverlap 	= 50;
	var new_lines 	= [];
	var opts 		= reader.read() || [];

	// Filter old readings
	if (stamps_used) {
		//console.log('stamps found!');
		for (var a = 0; a < opts.length; a++) {
			//console.log("unfiltered: " + opts[a].text);
			var match = false;
			for (var i = 0; i < old_lines.length; i++) {
				if (reader.matchLines(opts[a].text, old_lines[i].text)) {
					match = true;
					break;
				}
			}
			if (!match) {
				old_lines.push(opts[a]);
				new_lines.push(opts[a]);
			}
		}
		if (old_lines.length > minoverlap) old_lines.splice(0, old_lines.length - minoverlap); 
		opts = new_lines;
	}
	for (a = 0; a < opts.length; a++) {
		// Get the timestamp of the line
		//console.log(opts[a].text);
		var stamp = opts[a].text.match(/(\d\d:\d\d:\d\d)/);
		if (stamp) stamps_used = true;
		// Instance made
		if (opts[a].text.indexOf("Zero Gwafa") !== -1) {
			$(".curestate").html($(".curestate").html() + opts[a].text +"<br>");
		}
		
	}
}

    $(function(){
        setTimeout(function(){$(".test").click(function(){readChatBox();});
    },2000);
    });

function start()
{
    setTimeout(function(){
        setInterval(function(){
        readChatBox();
    }, 2000);
    }, 5000);
}