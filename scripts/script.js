//Enable "Add App" button for Alt1 Browser.
a1lib.identifyUrl("appconfig.json");

var reader = new ChatBoxReader();
reader.readargs = {
  colors: [
    a1lib.mixcolor(255, 255, 255), //Common Mats
    a1lib.mixcolor(255, 128, 0), //Uncommon Mats
    a1lib.mixcolor(255, 165, 0), //Scavenging comps
    a1lib.mixcolor(255, 0, 0), //Rare Mats
    a1lib.mixcolor(67, 188, 188), //Ancient components
  ],
  backwards: true,
};

reader.find();

let findChat = setInterval(function () {
  if (reader.pos === null) {
    reader.find();
  } else {
    clearInterval(findChat);
    reader.pos.boxes.map((box, i) => {
      $(".chat").append(`<option value=${i}>Chat ${i}</option>`);
    });

    if (localStorage.chat) {
      reader.pos.mainbox = reader.pos.boxes[localStorage.chat];
    } else {
      //If multiple boxes are found, this will select the first, which should be the top-most chat box on the screen.
      reader.pos.mainbox = reader.pos.boxes[0];
      localStorage.chat = 0;
    }
    showSelectedChat(reader.pos);
  }
}, 1000);

function showSelectedChat(chat) {
  //Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
  try {
    alt1.overLayRect(
      a1lib.mixcolor(0, 255, 255),
      chat.mainbox.rect.x,
      chat.mainbox.rect.y,
      chat.mainbox.rect.width,
      chat.mainbox.rect.height,
      2000,
      1
    );
  } catch {}
}

var count, mats, index;
var actions = localStorage.actions ? Number(localStorage.actions) : 0;

function readChatbox() {
  var opts = reader.read() || [];
  var chat = "";

  for (a in opts) {
    chat += opts[a].text + " ";
  }

  var comps = chat.match(
    /\d+ x \w+( \w+)?[^\d+:]|You receive \d+ \w+( \w+)?[^\d+:]/g
  );
  if (comps != null && comps.length > 0) {
    actions++;
    localStorage.actions = actions;
    $(".actions").text(actions);
  }
  for (var x in comps) {
    count = Number(comps[x].match(/\d+/)); //1
    mats = comps[x].match(/[^You receive \d]\w+( \w+)?/)[0]; //Junk
    if (!mats.match(/parts|components|Junk/)) {
      mats += "s";
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
  $(".actions").text(actions);
  for (x in compsList) {
    if (compsList[x].type === "rare") {
      $(".rare").append(
        `<tr data-name="${x}"><td>
        ${x.split(" ")[0]}
        </td><td class='qty'></td></tr>`
      );
    }
    if (compsList[x].type === "uncommon") {
      $(".uncommon").append(
        `<tr data-name="${x}"><td>
        ${x.split(" ")[0]}
        </td><td class='qty'></td></tr>`
      );
    }
    if (compsList[x].type === "common") {
      $(".common").append(
        `<tr data-name="${x}"><td>
        ${x.split(" ")[0]}
        </td><td class='qty'></td></tr>`
      );
    }
    if (compsList[x].type === "ancient") {
      $(".ancient").append(
        `<tr data-name="${x}"><td>
        ${x.split(" ")[0]}
        </td><td class='qty'></td></tr>`
      );
    }
  }
}

function tidyTable(mats) {
  localStorage.mats = JSON.stringify(compsList);
  for (x in compsList) {
    $(`[data-name='${x}'] > .qty`).text(compsList[x].qty);
    if (compsList[x].qty === 0) {
      $(`[data-name='${x}']`).hide();
    } else {
      $(`[data-name='${x}']`).show();
    }
  }
  $(`[data-name='${mats}']`)
    .css({ "background-color": "lime" })
    .animate(
      {
        backgroundColor: $.Color("rgba(0, 0, 0, 0)"),
      },
      500,
      function () {
        $(this).removeAttr("style");
      }
    );
}

buildTable();
tidyTable();

$(function () {
  let tracking;

  $(".edit").change(function () {
    if ($(this).is(":checked")) {
      if ($(".tracker").text() == "Stop") {
        $(".tracker").click();
      }
      $("tr:hidden").show();
      $(".qty")
        .attr("contenteditable", "true")
        .focus(function () {
          document.execCommand("selectAll", false, null);
        });
    } else {
      $(".qty").removeAttr("contenteditable");
      for (x in compsList) {
        compsList[x].qty = parseInt($(`[data-name='${x}'] .qty`).text());
      }
      tidyTable();
    }
  });

  $("button.tracker")
    .click(function () {
      if ($(this).html() === "Start") {
        console.log("Starting tracker");
        tracking = setInterval(function () {
          readChatbox();
        }, 600);
        $(this).html("Stop");
      } else {
        console.log("Stopping tracker");
        $(this).html("Start");
        console.log(tracking);
        clearInterval(tracking);
      }
    })
    .click();

  $("button.clear").click(function () {
    localStorage.removeItem("mats");
    localStorage.removeItem("actions");
    location.reload();
  });

  $(".toggleMenu").click(function () {
    $(".options").toggle();
  });

  $(".export").click(function () {
    var str = "ComponentName,Quantity\n"; // column headers
    for (x in compsList) {
      str = str + x + "," + compsList[x].qty + "\n";
    }
    //return str;
    var blob = new Blob([str], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, "componentExport.csv");
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "componentExport.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  });

  $(".chat").change(function () {
    reader.pos.mainbox = reader.pos.boxes[$(this).val()];
    showSelectedChat(reader.pos);
    localStorage.setItem("chat", $(this).val());
    $(this).val("");
  });
});
