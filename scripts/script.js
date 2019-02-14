var reader = new ChatBoxReader();
    reader.readargs = 
        {
            colors: [
                a1lib.mixcolor(255,255,255),//Common Mats
                a1lib.mixcolor(255, 128, 0), //Uncommon Mats
                a1lib.mixcolor(255, 165, 0), //Scavenging comps
                a1lib.mixcolor(255, 0, 0) //Rare Mats
            ],
            backwards: true
        };
    reader.find();

var chatCheck = reader.read();

var list = ["Ancient components", "Armadyl components", "Ascended components", "Avernic components", "Bandos components", "Brassican components", "Clockwork components", "Corporeal components", "Culinary components", "Cywir components", "Dragonfire components", "Explosive components", "Faceted components", "Fortunate components", "Fungal components", "Harnessed components", "Ilujankan components", "Knightly components", "Noxious components", "Oceanic components", "Pestiferous components", "Resilient components", "Rumbling components", "Saradomin components", "Seren components", "Shadow components", "Shifting components", "Silent components", "Undead components", "Zamorak components", "Zaros components", "Dextrous components", "Direct components", "Enhancing components", "Ethereal components", "Evasive components", "Healthy components", "Heavy components", "Imbued components", "Light components", "Living components", "Pious components", "Powerful components", "Precious components", "Precise components", "Protective components", "Refined components", "Sharp components", "Strong components", "Stunning components", "Subtle components", "Swift components", "Variable components", "Base parts", "Blade parts", "Clear parts", "Connector parts", "Cover parts", "Crafted parts", "Crystal parts", "Deflecting parts", "Delicate parts", "Flexible parts", "Head parts", "Magic parts", "Metallic parts", "Organic parts", "Padded parts", "Plated parts", "Simple parts", "Smooth parts", "Spiked parts", "Spiritual parts", "Stave parts", "Tensile parts", "Junk"]
    
var list2 = new Array();
        list2.length = list.length;
        list2.fill(0);

var count, mats, index;

function readChatbox() 
{
	var opts 		= reader.read() 		|| [];
    var chat = "";
    reader.find();
    
    for(a in opts)
    {
            chat += opts[a].text + " ";
    }
    
    
    var comps = chat.match(/\d+ x \w+( \w+)? |You receive \d+ \w+( \w+)?/g);
    for (var x in comps)
    {
        console.log(comps[x]);
        count = Number(comps[x].match(/\d+/)); //1
        mats = comps[x].match(/[^You receive \d]\w+( \w+)?/)[0]; //Junk
        if(mats.match(/parts|components|Junk/))
            console.log("is fine");
        else
        {
            mats += "s";
            console.log("Now "+mats);
        }
        if(list.indexOf(mats) > -1)
            index = list.indexOf(mats);//Get index of mat based off of list.
        else
            continue;
        list2[index] += Number(count); //add count to index of second list.
        tidyTable();
    }
}    

$("button.tracker").click(function()
{
    if($(this).html() == "Start")
    {
        console.log("Starting tracker");
        tracking = setInterval(function(){readChatbox();},600);
        $(this).html("Stop");
    }
    else
    {
        console.log("Stopping tracker");
        $(this).html("Start");
        clearInterval(tracking);
    }
});

$("button.clear").click(function()
{
    list2.fill(0);
    tidyTable();
});
    
function tidyTable()
{
    localStorage.mats = list2;
    $("table:contains('parts') tr:not(:first)").hide();
    $("tr:not(:first) > td:nth-child(2)").each(function(e)
    {
        $(this).text(list2[e]);//update all table rows.
    });
    
    for(x in list2)
    {
        if(list2[x] != 0)
        {
          $("table:contains('parts') tr:not(:first)").eq(x).show();
        }
    }
}


if(localStorage.mats.length)
{
    for(x in localStorage.mats.split(','))
    {
        list2[x] = Number(localStorage.mats.split(',')[x]);
    }
}
else
{
    list2.fill(0);
}
tidyTable();