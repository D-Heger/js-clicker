window.onload = function () {
  createUpgradeElements();
  addUpgradeEventListeners();
  createReseachElements();
  addResearchEventListeners();
  displayUpgrades();
  displayResearches();
  if (localStorage.getItem("save data")) {
    load();
  }
}

// Initialize variables
let score = 0;
let totalScore = 0;
let incrementPower = 1;
let incrementPerSec = 0;
let costReduction = 0;
const gameVersion = "0.1.3";

// Get elements
const scoreElement = document.getElementById("score");
const totalScoreElement = document.getElementById("totalScore");
const incrementScoreElement = document.getElementById("incrementScore");
const incrementPerSecScoreElement = document.getElementById("incrementPerSecScore");
const gameVersionElement = document.getElementById("gameVersion");
gameVersionElement.innerHTML = gameVersion;




/**
 * Upgrade System
 */
class Upgrade {
  constructor(name, cost, power, count, type, tier) {
    this.name = name;
    this.cost = cost;
    this.power = power;
    this.count = count;
    this.type = type;
    this.tier = tier;
  }
}

let upgrades = [
  new Upgrade("Baby Steps", 10, 1, 0, "C", 1),
  new Upgrade("Bigger Steps", 100, 5, 0, "C", 1),
  new Upgrade("Why Steps?", 1000, 10, 0, "C", 1),
  new Upgrade("Mighty Steps", 2500, 20, 0, "C", 1),
  new Upgrade("Isn't it supposed to be clicks?", 10000, 50, 0, "C", 1),
  new Upgrade("No, i mean really?", 50000, 100, 0, "C", 1),
  new Upgrade("Whats the point?", 99999, 900, 0, "C", 1),
  new Upgrade("My hand hurts", 1000000, 1337, 0, "C", 1),
  new Upgrade("What is this?", 1050505, 5987, 0, "C", 1),
  new Upgrade("Upgrade 10", 100000000, 10001, 0, "C", 1),
  new Upgrade("Automation", 100, 1, 0, "A", "1"),
  new Upgrade("Slightly better automation", 500, 2, 0, "A", "1"),
  new Upgrade("Even better automation", 1000, 5, 0, "A", "1"),
  new Upgrade("This is almost as good as any other incremental game", 5000, 9, 0, "A", "1"),
  new Upgrade("Wow the button over me really made this game worse!", 10000, 14, 0, "A", "1"),
  new Upgrade("Does this guy think he is funny?", 50000, 20, 0, "A", "1"),
  new Upgrade("Play Factorio", 100000, 100, 0, "A", "1"),
  new Upgrade("Why isnt this more effective?", 500000, 555, 0, "A", "1"),
  new Upgrade("Wow funny hacker number", 100000, 1337, 0, "A", "1"),
  new Upgrade("Its over 900!q", 5000000, 9999, 0, "A", "1"),
];

function purchaseUpgrade(upgradeName) {
  for (let upgrade of upgrades) {
    if (upgrade.name === upgradeName) {
      if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.count += 1;
        upgrade.cost = upgradeCost(upgrade.cost, 10, upgrade.count, costReduction);
        if (upgrade.type.includes("C")) {
          incrementPower += upgrade.power;
        } else if (upgrade.type.includes("A")) {
          incrementPerSec += upgrade.power;
        }
        break;
      }
    }
  }
}

function displayUpgrades() {
  for (let upgrade of upgrades) {
    let element = document.getElementById(upgrade.name);
    let costElement = document.getElementById(`${upgrade.name}Cost`);
    let countElement = document.getElementById(`${upgrade.name}Count`);
    let powerElement = document.getElementById(`${upgrade.name}Power`);
    costElement.innerHTML = "Cost: " + upgrade.cost;
    countElement.innerHTML = "Owned: " + upgrade.count;
    powerElement.innerHTML = "Power: " + upgrade.power;
    if (score >= upgrade.cost) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  }
}

function createUpgradeElement(upgrade) {
  let li = document.createElement("li");

  let button = document.createElement("button");
  button.innerHTML = upgrade.name;
  button.id = upgrade.name;
  li.appendChild(button);

  let cost = document.createElement("div");
  cost.innerHTML = "Cost: " + upgrade.cost;
  cost.className = "upgradeText";
  cost.id = `${upgrade.name}Cost`;
  li.appendChild(cost);

  let count = document.createElement("div");
  count.innerHTML = "Owned: " + upgrade.count;
  count.className = "upgradeText";
  count.id = `${upgrade.name}Count`;
  li.appendChild(count);

  let power = document.createElement("div");
  power.innerHTML = "Power: " + upgrade.power;
  power.className = "upgradeText";
  power.id = `${upgrade.name}Power`;
  li.appendChild(power);

  return li;
}

function createUpgradeElements() {
  let cUpgradeList = document.getElementById("clickUpgradeList");
  let aUpgradeList = document.getElementById("autoUpgradeList");
  for (let upgrade of upgrades) {
    let upgradeElement = createUpgradeElement(upgrade);
    if (upgrade.type.includes("C")) {
      cUpgradeList.appendChild(upgradeElement);
    } else if (upgrade.type.includes("A")) {
      aUpgradeList.appendChild(upgradeElement);
    }

  }
}

function addUpgradeEventListeners() {
  for (let upgrade of upgrades) {
    let element = document.getElementById(upgrade.name);
    element.addEventListener("click", function () {
      purchaseUpgrade(upgrade.name);
      displayUpgrades();
    });
  }
}

/**
 * Research System
 */
class Research {
  constructor(name, cost, power, count, type) {
    this.name = name;
    this.cost = cost;
    this.power = power;
    this.count = count;
    this.type = type;
  }
}

let researches = [
  new Research("Increment Click Power ", 1000, 2, 0, "mul"),
  new Research("Increment Auto Power", 10000, 2, 0, "mul"),
  new Research("Cost Reduction", 10000, 10, 0, "red"),
];

function purchaseResearch(researchName) {
  for (let research of researches) {
    if (research.name === researchName) {
      if (totalScore >= research.cost) {
        research.count += 1;
        research.cost = researchCost(research.cost);
        if (research.type === "mul") {
          if (research.name.includes("Click")) {
            incrementPower *= research.power;
          } else if (research.name.includes("Auto")) {
            incrementPerSec *= research.power;
          }
        } else if (research.type === "red") {
          costReduction *= (1 - research.power);
        }

        break;
      }
    }
  }
}

function displayResearches() {
  for (let research of researches) {
    let element = document.getElementById(research.name);
    let costElement = document.getElementById(`${research.name}Cost`);
    let countElement = document.getElementById(`${research.name}Count`);
    let powerElement = document.getElementById(`${research.name}Power`);
    costElement.innerHTML = "Cost: " + research.cost;
    countElement.innerHTML = "Owned: " + research.count;
    powerElement.innerHTML = "Power: " + research.power;
    if (totalScore >= research.cost) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  }
}

function createResearchElement(research) {
  let li = document.createElement("li");

  let button = document.createElement("button");
  button.innerHTML = research.name;
  button.id = research.name;
  li.appendChild(button);

  let cost = document.createElement("div");
  cost.innerHTML = "Cost: " + research.cost;
  cost.className = "upgradeText";
  cost.id = `${research.name}Cost`;
  li.appendChild(cost);

  let count = document.createElement("div");
  count.innerHTML = "Owned: " + research.count;
  count.className = "upgradeText";
  count.id = `${research.name}Count`;
  li.appendChild(count);

  let power = document.createElement("div");
  power.innerHTML = "Power: " + research.power;
  power.className = "upgradeText";
  power.id = `${research.name}Power`;
  li.appendChild(power);

  return li;
}

function createReseachElements() {
  let researchList = document.getElementById("researchList");
  for (let research of researches) {
    let researchElement = createResearchElement(research);
    researchList.appendChild(researchElement);
  }
}

function addResearchEventListeners() {
  for (let research of researches) {
    let element = document.getElementById(research.name);
    element.addEventListener("click", function () {
      purchaseResearch(research.name);
      displayResearches();
    });
  }
}

function updateScore() {
  scoreElement.innerHTML = "Score: " + score;
  totalScoreElement.innerHTML = "Total Score: " + totalScore;
  incrementScoreElement.innerHTML = "Points per Increment: " + incrementPower;
  incrementPerSecScoreElement.innerHTML = "Increment Per Secound: " + incrementPerSec;
}

const reloadUI = setInterval(function () {
  updateScore();
  displayUpgrades();
  displayResearches();
}, 100);

/**
 * Saving
 */
function save() {
  let saveGame = [
    score,
    totalScore,
    incrementPower,
    incrementPerSec,
    costReduction,
    upgrades,
    researches,
    gameVersion,
  ];
  localStorage.setItem("save data", JSON.stringify(saveGame));
  console.log("Game saved!");
}

/**
 * Automatically saves the game every 10 secounds
 */
const autoSave = setInterval(save, 10000);

// Clear save
function deleteSave() {
  localStorage.removeItem("save data");
  console.log("Save removed!");
}

/**
 * Loading
 */
function load() {
  let saveData = JSON.parse(localStorage.getItem("save data"));
  if (saveData[7] === gameVersion) {
    score = parseInt(saveData[0]);
    totalScore = parseInt(saveData[1]);
    incrementPower = parseInt(saveData[2]);
    incrementPerSec = parseInt(saveData[3]);
    costReduction = parseInt(saveData[4])
    let loadedUpgrades = [];
    for (let upgradeData of saveData[5]) {
      let upgrade = new Upgrade(upgradeData.name, upgradeData.cost, upgradeData.power, upgradeData.count);
      loadedUpgrades.push(upgrade);
    }
    upgrades = loadedUpgrades;

    let loadedResearches = [];
    for (let researchData of saveData[6]) {
      let research = new Research(researchData.name, researchData.cost, researchData.power, researchData.count, researchData.type);
      loadedResearches.push(research);
    }
    researches = loadedResearches;
    console.log("Game loaded!");
  } else if (saveData) {
    alert("Save was found, but not loaded because of a game update. Check the git to see what changed.")
  } else {
    console.log("No save data found.");
  }
}


// Simple upgradeCost calculation
function upgradeCost(cost, div, count, costReduction) {
  return Math.ceil((cost + (cost*2)/div)+(costReduction/count));
}

// Simple researchCost calculation
function researchCost(cost) {
  return cost *= 5;
}

/**
 * Automatically increase the score every secound by the increment per sec factor
 */
const increment = setInterval(autoIncrement, 1000);

function autoIncrement() {
  score += incrementPerSec;
  totalScore += incrementPerSec;
}

/**
 * Site Buttons
 */
const incrementButton = document.getElementById("increment");
incrementButton.addEventListener("click", function () {
  score += incrementPower;
  totalScore += incrementPower;
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  save();
});

const deleteSaveButton = document.getElementById("deleteSave");
deleteSaveButton.addEventListener("click", function () {
  deleteSave();
  document.location.reload();
});