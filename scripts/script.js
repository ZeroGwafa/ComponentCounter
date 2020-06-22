var reader = new ChatBoxReader();
reader.readargs = {
    colors: [
        a1lib.mixcolor(255, 255, 255), //Common Mats
        a1lib.mixcolor(255, 128, 0), //Uncommon Mats
        a1lib.mixcolor(255, 165, 0), //Scavenging comps
        a1lib.mixcolor(255, 0, 0) //Rare Mats
    ],
    backwards: true
};
reader.find();

//Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
try {
    var p = reader.pos;
    alt1.overLayRect(a1lib.mixcolor(255, 255, 255), p.mainbox.rect.x, p.mainbox.rect.y, p.mainbox.rect.width, p.mainbox.rect.height, 2000, 1);
} catch {}

var chatCheck = reader.read();

var count, mats, index;
var actions = 0;

function readChatbox() {
    var opts = reader.read() || [];
    var chat = "";
    reader.find();

    for (a in opts) {
        chat += opts[a].text + " ";
    }

    var comps = chat.match(/\d+ x \w+( \w+)?[^\d+:]|You receive \d+ \w+( \w+)?[^\d+:]/g);
    console.log(comps);
    if (comps != null && comps.length > -1)
        actions++;
    for (var x in comps) {
        console.log(comps[x]);
        count = Number(comps[x].match(/\d+/)); //1
        mats = comps[x].match(/[^You receive \d]\w+( \w+)?/)[0]; //Junk
        if (mats.match(/parts|components|Junk/))
            console.log("is fine");
        else {
            mats += "s";
            console.log("Now " + mats);
        }
        if (compsList[mats]) {
            compsList[mats].qty += count; //add count to index of second list.
            tidyTable(mats);
        } else {
            console.warn("Invalid component.  Ignoring.");
            continue;
        }
    }
}

function buildTable() {
    for (x in compsList) {
        if (compsList[x].type === "rare") {
            $(".rare").append(`<tr data-name="${x}"><td>${x.split(" ")[0]}</td><td class='qty'></td></tr>`);
        }
        if (compsList[x].type === "uncommon") {
            $(".uncommon").append(`<tr data-name="${x}"><td>${x.split(" ")[0]}</td><td class='qty'></td></tr>`);
        }
        if (compsList[x].type === "common") {
            $(".common").append(`<tr data-name="${x}"><td>${x.split(" ")[0]}</td><td class='qty'></td></tr>`);
        }
    }
}

function tidyTable(flashRow) {
    localStorage.mats = JSON.stringify(compsList);
    for (x in compsList) {
        $(`[data-name='${x}'] > .qty`).text(compsList[x].qty);
        if (compsList[x].qty === 0) {
            $(`[data-name='${x}']`).hide();
        } else {
            $(`[data-name='${x}']`).show();
        }
    }
    $(`[data-name='${mats}']`).css({ "background-color": "lime" }).animate({
        backgroundColor: $.Color("rgba(0, 0, 0, 0)")
    }, 500, function() { $(this).removeAttr("style") });

    $(".actions").text(actions);
}

buildTable();
tidyTable();

$(".edit").change(function() {
    if ($(this).is(':checked')) {
        if ($(".tracker").text() == "Stop") {
            $(".tracker").click();
        }
        $("tr:hidden").show();
        $(".qty").attr('contenteditable', 'true').focus(function() { document.execCommand('selectAll', false, null) });
    } else {
        $(".qty").removeAttr('contenteditable');
        for (x in compsList) {
            compsList[x].qty = parseInt($(`[data-name='${x}'] .qty`).text());
        }
        tidyTable();
    }
});

$("button.tracker").click(function() {
    if ($(this).html() == "Start") {
        console.log("Starting tracker");
        tracking = setInterval(function() { readChatbox(); }, 600);
        $(this).html("Stop");
    } else {
        console.log("Stopping tracker");
        $(this).html("Start");
        clearInterval(tracking);
    }
}).click();

$("button.clear").click(function() {
    localStorage.removeItem("mats");
    for (x in compsList) {
        compsList[x].qty = 0;
    }
    actions = 0;
    location.reload();
});

$(".toggleMenu").click(function() {
    $(".options").toggle();
});

$(".export").click(function() {
    var str = 'ComponentName,Quantity\n'; // column headers
    for (x in compsList) {
        str = str + x + "," + compsList[x].qty + "\n"
    }
    //return str;
    var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, "componentExport.csv");
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "componentExport.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
});