var compsList = {
    "Ancient components": {
        type: "rare",
        qty: 0
    },
    "Armadyl components": {
        type: "rare",
        qty: 0
    },
    "Ascended components": {
        type: "rare",
        qty: 0
    },
    "Avernic components": {
        type: "rare",
        qty: 0
    },
    "Bandos components": {
        type: "rare",
        qty: 0
    },
    "Brassican components": {
        type: "rare",
        qty: 0
    },
    "Clockwork components": {
        type: "rare",
        qty: 0
    },
    "Corporeal components": {
        type: "rare",
        qty: 0
    },
    "Culinary components": {
        type: "rare",
        qty: 0
    },
    "Cywir components": {
        type: "rare",
        qty: 0
    },
    "Dragonfire components": {
        type: "rare",
        qty: 0
    },
    "Explosive components": {
        type: "rare",
        qty: 0
    },
    "Faceted components": {
        type: "rare",
        qty: 0
    },
    "Fortunate components": {
        type: "rare",
        qty: 0
    },
    "Fungal components": {
        type: "rare",
        qty: 0
    },
    "Harnessed components": {
        type: "rare",
        qty: 0
    },
    "Ilujankan components": {
        type: "rare",
        qty: 0
    },
    "Knightly components": {
        type: "rare",
        qty: 0
    },
    "Noxious components": {
        type: "rare",
        qty: 0
    },
    "Oceanic components": {
        type: "rare",
        qty: 0
    },
    "Pestiferous components": {
        type: "rare",
        qty: 0
    },
    "Resilient components": {
        type: "rare",
        qty: 0
    },
    "Rumbling components": {
        type: "rare",
        qty: 0
    },
    "Saradomin components": {
        type: "rare",
        qty: 0
    },
    "Seren components": {
        type: "rare",
        qty: 0
    },
    "Shadow components": {
        type: "rare",
        qty: 0
    },
    "Shifting components": {
        type: "rare",
        qty: 0
    },
    "Silent components": {
        type: "rare",
        qty: 0
    },
    "Undead components": {
        type: "rare",
        qty: 0
    },
    "Zamorak components": {
        type: "rare",
        qty: 0
    },
    "Zaros components": {
        type: "rare",
        qty: 0
    },
    "Dextrous components": {
        type: "uncommon",
        qty: 0
    },
    "Direct components": {
        type: "uncommon",
        qty: 0
    },
    "Enhancing components": {
        type: "uncommon",
        qty: 0
    },
    "Ethereal components": {
        type: "uncommon",
        qty: 0
    },
    "Evasive components": {
        type: "uncommon",
        qty: 0
    },
    "Healthy components": {
        type: "uncommon",
        qty: 0
    },
    "Heavy components": {
        type: "uncommon",
        qty: 0
    },
    "Imbued components": {
        type: "uncommon",
        qty: 0
    },
    "Light components": {
        type: "uncommon",
        qty: 0
    },
    "Living components": {
        type: "uncommon",
        qty: 0
    },
    "Pious components": {
        type: "uncommon",
        qty: 0
    },
    "Powerful components": {
        type: "uncommon",
        qty: 0
    },
    "Precious components": {
        type: "uncommon",
        qty: 0
    },
    "Precise components": {
        type: "uncommon",
        qty: 0
    },
    "Protective components": {
        type: "uncommon",
        qty: 0
    },
    "Refined components": {
        type: "uncommon",
        qty: 0
    },
    "Sharp components": {
        type: "uncommon",
        qty: 0
    },
    "Strong components": {
        type: "uncommon",
        qty: 0
    },
    "Stunning components": {
        type: "uncommon",
        qty: 0
    },
    "Subtle components": {
        type: "uncommon",
        qty: 0
    },
    "Swift components": {
        type: "uncommon",
        qty: 0
    },
    "Variable components": {
        type: "uncommon",
        qty: 0
    },
    "Base parts": {
        type: "common",
        qty: 0
    },
    "Blade parts": {
        type: "common",
        qty: 0
    },
    "Clear parts": {
        type: "common",
        qty: 0
    },
    "Connector parts": {
        type: "common",
        qty: 0
    },
    "Cover parts": {
        type: "common",
        qty: 0
    },
    "Crafted parts": {
        type: "common",
        qty: 0
    },
    "Crystal parts": {
        type: "common",
        qty: 0
    },
    "Deflecting parts": {
        type: "common",
        qty: 0
    },
    "Delicate parts": {
        type: "common",
        qty: 0
    },
    "Flexible parts": {
        type: "common",
        qty: 0
    },
    "Head parts": {
        type: "common",
        qty: 0
    },
    "Magic parts": {
        type: "common",
        qty: 0
    },
    "Metallic parts": {
        type: "common",
        qty: 0
    },
    "Organic parts": {
        type: "common",
        qty: 0
    },
    "Padded parts": {
        type: "common",
        qty: 0
    },
    "Plated parts": {
        type: "common",
        qty: 0
    },
    "Simple parts": {
        type: "common",
        qty: 0
    },
    "Smooth parts": {
        type: "common",
        qty: 0
    },
    "Spiked parts": {
        type: "common",
        qty: 0
    },
    "Spiritual parts": {
        type: "common",
        qty: 0
    },
    "Stave parts": {
        type: "common",
        qty: 0
    },
    "Tensile parts": {
        type: "common",
        qty: 0
    },
    "Junk": {
        type: "common",
        qty: 0
    }
}

if (localStorage.getItem("mats") != null) {
    tempList = JSON.parse(localStorage.mats);
    for (x in tempList) {
        if (!tempList[x] || !compsList[x]) {
            continue;
        } else {
            compsList[x].qty = tempList[x].qty;
        }
    }
}