import * as a1lib from "alt1";
import ChatboxReader from "alt1/chatbox";
import * as OCR from "alt1/ocr";
import { ImgRefData } from "alt1/base";

import "./index.html";
import "./appconfig.json";
import "./icon.png";
import "./css/style.css";

const appName = "ComponentCounter";
const appColor = a1lib.mixColor(0, 255, 0);
const chatSelector = document.querySelector(".chat");
const exportButton = document.querySelector(".export");
const clearButton = document.querySelector(".clear");
const actions = document.querySelector(".actions") as HTMLElement;
const timestampRegex = /\[\d{2}:\d{2}:\d{2}\]/g;
const reader = new ChatboxReader();

// Set Chat reader and settings.
reader.readargs = {
	colors: [
		a1lib.mixColor(255, 128, 0), //Uncommon Mats
		a1lib.mixColor(255, 165, 0), //Scavenging comps
		a1lib.mixColor(255, 0, 0), //Rare Mats
		a1lib.mixColor(67, 188, 188), //Ancient components
	],
};

// Work continues on this. forwardnudge to work past multi-spaces.  See images/test/multi_line.data.png
// reader.forwardnudges.push({
// 	match: /parts|components|Junk/,
// 	name: "multispace",
// 	fn: (ctx) => {
// 		let i = 0;
// 		let startx = ctx.rightx;
// 		let maybe_one = OCR.readChar(ctx.imgdata, ctx.font, [255, 128, 0], startx + ctx.font.spacewidth * 3, ctx.baseliney, false, true);
// 		console.log(maybe_one);
// 		if (maybe_one?.chr.match(/./)) {
// 			console.log("Found multispace");
// 			let maybe_x = OCR.readChar(ctx.imgdata, ctx.font, [255, 128, 0], startx + ctx.font.spacewidth * 3, ctx.baseliney, false, true);
// 			ctx.addfrag({ color: [255, 128, 0], index: -1, text: " ", xstart: startx, xend: startx + maybe_x.basechar.width + ctx.font.spacewidth });
// 			return true;
// 		}
// 	},
// });

// White colored Comma between two different colored texts.
reader.forwardnudges.push({
	match: /./,
	name: "comma",
	fn: (ctx) => {
		let startx = ctx.rightx;
		let maybe_one = OCR.readChar(ctx.imgdata, ctx.font, [255, 255, 255], startx, ctx.baseliney, false, true);
		if (maybe_one?.chr == ",") {
			let maybe_x = OCR.readChar(ctx.imgdata, ctx.font, [255, 255, 255], startx, ctx.baseliney, false, true);
			ctx.addfrag({ color: [255, 255, 255], index: -1, text: ", ", xstart: startx, xend: startx + maybe_x.basechar.width + ctx.font.spacewidth });
			return true;
		}
	},
});

// Check for "1" in different colors.  Potentially adds a second "x" to string, this is adjusted in the processChat function
reader.forwardnudges.push({
	match: /You receive|parts|components|Junk/,
	name: "uncommon_1",
	fn: (ctx) => {
		let startx = ctx.rightx;
		let maybe_one = OCR.readChar(ctx.imgdata, ctx.font, [255, 128, 0], startx + ctx.font.spacewidth, ctx.baseliney, false, true);
		if (maybe_one?.chr == "1") {
			let maybe_x = OCR.readChar(
				ctx.imgdata,
				ctx.font,
				[255, 128, 0],
				maybe_one.x + maybe_one.basechar.width + ctx.font.spacewidth,
				ctx.baseliney,
				false,
				true
			);
			if (maybe_x?.chr == "x") {
				ctx.addfrag({ color: [255, 128, 0], index: -1, text: " 1 x", xstart: startx, xend: startx + maybe_one.basechar.width + ctx.font.spacewidth });
			} else {
				ctx.addfrag({ color: [255, 128, 0], index: -1, text: " 1", xstart: startx, xend: startx + maybe_one.basechar.width + ctx.font.spacewidth });
			}
			return true;
		}
	},
});

reader.forwardnudges.push({
	match: /You receive|parts|components|Junk/,
	name: "rare_1",
	fn: (ctx) => {
		let startx = ctx.rightx;
		let maybe_one = OCR.readChar(ctx.imgdata, ctx.font, [255, 0, 0], startx + ctx.font.spacewidth, ctx.baseliney, false, true);
		if (maybe_one?.chr == "1") {
			let maybe_x = OCR.readChar(
				ctx.imgdata,
				ctx.font,
				[255, 0, 0],
				maybe_one.x + maybe_one.basechar.width + ctx.font.spacewidth,
				ctx.baseliney,
				false,
				true
			);
			if (maybe_x?.chr == "x") {
				ctx.addfrag({ color: [255, 0, 0], index: -1, text: " 1", xstart: startx, xend: startx + maybe_one.basechar.width + ctx.font.spacewidth });
				return true;
			}
			ctx.addfrag({ color: [255, 0, 0], index: -1, text: " 1 x", xstart: startx, xend: startx + maybe_one.basechar.width + ctx.font.spacewidth });
			return true;
		}
	},
});

reader.forwardnudges.push({
	match: /You receive|parts|components|Junk/,
	name: "ancient_1",
	fn: (ctx) => {
		let startx = ctx.rightx;
		let maybe_one = OCR.readChar(ctx.imgdata, ctx.font, [67, 188, 188], startx + ctx.font.spacewidth, ctx.baseliney, false, true);
		if (maybe_one?.chr == "1") {
			let maybe_x = OCR.readChar(
				ctx.imgdata,
				ctx.font,
				[67, 188, 188],
				maybe_one.x + maybe_one.basechar.width + ctx.font.spacewidth,
				ctx.baseliney,
				false,
				true
			);
			if (maybe_x?.chr == "x") {
				ctx.addfrag({ color: [67, 188, 188], index: -1, text: " 1", xstart: startx, xend: startx + maybe_one.basechar.width + ctx.font.spacewidth });
				return true;
			}
			ctx.addfrag({ color: [67, 188, 188], index: -1, text: " 1 x", xstart: startx, xend: startx + maybe_one.basechar.width + ctx.font.spacewidth });
			return true;
		}
	},
});

if (window.alt1) {
	alt1.identifyAppUrl("./appconfig.json");
} else {
	let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
	document.querySelector("body").innerHTML = `Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1`;
}

window.setTimeout(function () {
	//Find all visible chatboxes on screen
	reader.find();
	let findChat = setInterval(async function () {
		if (reader.pos === null) reader.find();
		else {
			clearInterval(findChat);
			reader.pos.boxes.map((box, i) => {
				chatSelector.insertAdjacentHTML("beforeend", `<option value=${i}>Chat ${i}</option>`);
			});

			// Add logic to switch chatboxes
			chatSelector.addEventListener("change", function () {
				reader.pos.mainbox = reader.pos.boxes[this.value];
				showSelectedChat(reader.pos);
				updateSaveData({ chat: this.value });
				this.value = "";
			});

			if (getSaveData("chat")) {
				reader.pos.mainbox = reader.pos.boxes[getSaveData("chat")];
			} else {
				//If multiple boxes are found, this will select the first, which should be the top-most chat box on the screen.
				reader.pos.mainbox = reader.pos.boxes[0];
				updateSaveData({ chat: "0" });
			}

			showSelectedChat(reader.pos);
			await checkWikiForNewMaterials();
			buildTable();
			setInterval(function () {
				readChatbox();
			}, 600);
		}
	}, 1000);
}, 50);

function readChatbox() {
	var opts = reader.read() || [];

	const chatArr = processChat(opts);

	for (let line in chatArr) {
		let chatLine = chatArr[line].trim();
		if (isInHistory(chatLine)) {
			console.log(`Found in history: ${chatLine}, skipping.`);
			continue;
		}
		updateChatHistory(chatLine);
		if (chatLine.match(/part|component|Junk/)) {
			processMaterials(chatLine);
		}
	}
}

function processChat(opts) {
	let chatStr = "",
		chatArr;
	if (opts.length != 0) {
		for (let line in opts) {
			//Filter out the first chat[line], if it has no timestamp.  This is probably from a screen reload.
			//Check if no timestamp exists, and it's the first line in the chatreader.
			if (!opts[line].text.match(timestampRegex) && line == "0") {
				continue;
			}
			// Beginning of chat line
			if (opts[line].text.match(timestampRegex)) {
				if (Number(line) > 0) {
					chatStr += "\n";
				}
				chatStr += opts[line].text + " ";
				continue;
			}
			chatStr += opts[line].text;
		}
	}
	if (chatStr.trim() != "") {
		// Catch any extra "x" entries.
		chatStr = chatStr.replace(/(\d) x x/g, "$1 x");
		chatArr = chatStr.trim().split("\n");
	}

	return chatArr;
}

function processMaterials(chatLine) {
	actions.innerText = String(Number(actions.innerText) + 1);
	const regex1 = /(\d+) x (\w+)/g;
	const regex2 = /You receive (\d+) (\w+)/g;
	let matches;
	let useRegex = regex1;

	if (chatLine.includes("Materials gained") || chatLine.includes("Scavenging perk")) {
		matches = chatLine.match(regex1);
	} else {
		matches = chatLine.match(regex2);
		useRegex = regex2;
	}

	for (let match of matches) {
		match = match.match(useRegex.source);
		const quantity = match[1];
		const name = match[2];

		const material = {
			quantity: quantity,
			name: name,
		};

		updateSaveData({ materials: material });
		updateRow(material.name);
	}
}

function updateRow(matName) {
	const mats = getSaveData("materials");

	const row = document.querySelector(`#${matName}`) as HTMLElement;
	const qty = document.querySelector(`#${matName} .quantity`) as HTMLElement;

	qty.innerText = mats[matName].qty;

	if (row.classList.contains("hide")) {
		row.classList.remove("hide");
	}

	row.classList.add("new");
	row.addEventListener("animationend", () => {
		row.classList.remove("new");
	});

}

function buildTable() {
	const mats = getSaveData("materials");
	if (!mats) {
		checkWikiForNewMaterials();
		return;
	}
	document.querySelectorAll(`.mats`).forEach((el) => (el.innerHTML = ""));

	const matNames = Object.keys(mats).sort();
	for (let mat of matNames) {
		document
			.querySelector(`.${mats[mat]["type"]} > .col`)
			.insertAdjacentHTML(
				"beforeend",
				`<div id="${mat}" class='mats row ${mats[mat]["qty"] == 0 ? "hide" : ""}'><div class='mats col'>${mat}</div><div class='col quantity'>${
					mats[mat]["qty"]
				}</div></div>`
			);
	}
}

function showSelectedChat(chat) {
	//Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
	try {
		alt1.overLayRect(appColor, chat.mainbox.rect.x, chat.mainbox.rect.y, chat.mainbox.rect.width, chat.mainbox.rect.height, 2000, 5);
	} catch {}
}

function updateChatHistory(chatLine) {
	if (!sessionStorage.getItem(`${appName}chatHistory`)) {
		sessionStorage.setItem(`${appName}chatHistory`, `${chatLine}\n`);
		return;
	}
	var history = sessionStorage.getItem(`${appName}chatHistory`).split("\n");
	while (history.length > 100) {
		history.splice(0, 1);
	}
	history.push(chatLine.trim());
	sessionStorage.setItem(`${appName}chatHistory`, history.join("\n"));
}

function isInHistory(chatLine) {
	if (sessionStorage.getItem(`${appName}chatHistory`)) {
		for (let historyLine of sessionStorage.getItem(`${appName}chatHistory`).split("\n")) {
			if (historyLine.trim() == chatLine) {
				return true;
			}
		}
	}
	return false;
}

exportButton.addEventListener("click", function () {
	const mats = getSaveData("materials");
	var str = "ComponentName,Quantity\n"; // column headers
	for (let mat of Object.keys(mats)) {
		str = str + mat + "," + mats[mat]["qty"] + "\n";
	}
	//return str;
	var blob = new Blob([str], { type: "text/csv;charset=utf-8;" });
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
});

// Factory Reset logic
clearButton.addEventListener("click", function () {
	localStorage.removeItem(appName);
	sessionStorage.removeItem(`${appName}chatHistory`)
	location.reload();
});

async function updateSaveData(...dataset) {
	const lsData = JSON.parse(localStorage.getItem(appName)) || {};
	for (let data of dataset) {
		const name = Object.keys(data)[0];
		const value = Object.values(data)[0];
		// materials property exists
		if (name == "materials" && lsData[name]) {
			// Update Quantity of existing Material
			if (Object.keys(value).length == 2) {
				console.log(value);
				lsData[name][value["name"]].qty += Number(value["quantity"]);
				localStorage.setItem(appName, JSON.stringify(lsData));
				continue;
			}
		}
		lsData[name] = value;
		localStorage.setItem(appName, JSON.stringify(lsData));
	}
}

function getSaveData(name) {
	if (localStorage.getItem(appName)) {
		const lsData = JSON.parse(localStorage.getItem(appName));
		return lsData[name];
	} else {
		return false;
	}
}

async function getMaterialsFromWiki() {
	const response = await fetch("https://runescape.wiki/api.php?action=parse&format=json&page=Materials&prop=text&onlypst=1&formatversion=2");
	const data = await response.json();
	const htmlContent = data.parse.text;
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, "text/html");
	const compsList = {};
	const tables = doc.querySelectorAll(".wikitable.sortable");
	const rarities = ["common", "uncommon", "rare", "ancient"];
	// Reverse order, to order full list as Ancient, Rare, Uncommon, Common.  May need to change in future.
	for (let i = 3; i >= 0; i--) {
		let rarity = rarities[i];
		let table = tables[i];
		const rows = table.querySelectorAll("tr:not(:has(th))");
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const cells = row.querySelectorAll("td");
			const name = cells[1].innerText.split(" ")[0];
			compsList[name] = {
				type: rarity,
				qty: 0,
			};
		}
	}
	compsList["Junk"] = {
		type: "common",
		qty: 0,
	};
	return compsList;
}

// Get Invention material data from wiki.  Add new materials if they do not exist in localStorage
async function checkWikiForNewMaterials() {
	const wikiMats = await getMaterialsFromWiki();
	if (!getSaveData("materials")) {
		updateSaveData({ materials: wikiMats });
	}

	const localMats = getSaveData("materials");
	for (let mat of Object.keys(wikiMats)) {
		// console.log(mat, localMats[mat])
		if (localMats[mat] == null) {
			console.log(`Adding ${mat}`);
			localMats[mat] = wikiMats[mat];
		}
	}
	updateSaveData({ materials: localMats });
}

export async function runTests() {
	let tests = a1lib.webpackImages({
		multi_line: require("./images/tests/multi_line.data.png"),
		multi_uncommon: require("./images/tests/multiuncommon.data.png"),
		uncommon: require("./images/tests/uncommon.data.png"),
		uncommon_eol: require("./images/tests/uncommon_eol.data.png"),
		uncommon_rare: require("./images/tests/uncommon_rare.data.png"),
		auto_diss: require("./images/tests/auto_diss.data.png"),
		uncommon_ancient: require("./images/tests/uncommon_ancient.data.png"),
	});
	await tests.promise;
	for (let testid in tests.raw) {
		console.log(`==== ${testid} ====`);
		let img = new ImgRefData(tests[testid]);
		let pos = reader.find(img);

		if (!pos) {
			console.log(`couldn't find pos: ${testid}`);
			return;
		}
		let opts = reader.read(img);
		const chatArr = processChat(opts);

		console.log(chatArr);

		for (let line in chatArr) {
			let chatLine = chatArr[line].trim();
			if (isInHistory(chatLine)) {
				console.log(`Found in history: ${chatLine}, skipping.`);
				continue;
			}
			updateChatHistory(chatLine);
			if (chatLine.match(/part|component|Junk/)) {
				processMaterials(chatLine);
			}
		}
	}
}
