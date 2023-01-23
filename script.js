window.onload = function () {
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

// Get elements
const scoreElement = document.getElementById("score");
const totalScoreElement = document.getElementById("totalScore");
const incrementScoreElement = document.getElementById("incrementScore");
const incrementPerSecScoreElement = document.getElementById("incrementPerSecScore");


/**
 * Upgrade System
 */
class Upgrade {
  constructor(name, cost, power, count) {
    this.name = name;
    this.cost = cost;
    this.power = power;
    this.count = count;
  }
}

let upgrades = [
  new Upgrade("Click Upgrade 1", 10, 1, 0),
  new Upgrade("Auto Upgrade 1", 100, 1, 0)
];

function purchaseUpgrade(upgradeName) {
  for (let upgrade of upgrades) {
    if (upgrade.name === upgradeName) {
      if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.count += 1;
        upgrade.cost = upgradeCost(upgrade.cost, 10, upgrade.count);
        if (upgrade.name.includes("Click")) {
          incrementPower += upgrade.power;
        } else if (upgrade.name.includes("Auto")) {
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
    element.innerHTML = upgrade.name;
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
  new Research("Increment Power 1", 1000, 2, 0, "mul"),
  new Research("Increment Cost 1", 10000, 10, 0, "red"),
];

function purchaseResearch(researchName, upgradeName) {
  for (let research of researches) {
    if (research.name === researchName) {
      if (totalScore >= research.cost) {
        research.count += 1;
        research.cost = researchCost(research.cost);
        for (let upgrade of upgrades) {
          if (upgrade.name === upgradeName) {
            if (research.type === "mul") {
              upgrade.power *= research.power;
            } else if (research.type === "red") {
              upgrade.cost *= (1 - research.power);
            }
            break;
          }
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
    let typeElement = document.getElementById(`${research.name}Type`);
    element.innerHTML = research.name;
    costElement.innerHTML = "Cost: " + research.cost;
    countElement.innerHTML = "Owned: " + research.count;
    powerElement.innerHTML = "Power: " + research.power;
    typeElement.innerHTML = "Type: " + research.type;
    if (totalScore >= research.cost) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  }
}







const reloadUI = setInterval(function () {
  updateUI();
}, 100);

function updateUI() {
  scoreElement.innerHTML = "Score: " + score;
  totalScoreElement.innerHTML = "Total Score: " + totalScore;
  incrementScoreElement.innerHTML = "Points per Increment: " + incrementPower;
  incrementPerSecScoreElement.innerHTML = "Increment Per Secound: " + incrementPerSec;
}

/**
 * Saving
 */
function save() {
  let saveGame = [
    score,
    totalScore,
    incrementPower,
    incrementPerSec,
    upgrades,
    researches,
  ];
  localStorage.setItem("save data", JSON.stringify(saveGame));
  console.log("Game saved!")
}

/**
 * Loading
 */
function load() {
  let saveData = JSON.parse(localStorage.getItem("save data"));
  if (saveData) {
    score = parseInt(saveData[0]);
    totalScore = parseInt(saveData[1]);
    incrementPower = parseInt(saveData[2]);
    incrementPerSec = parseInt(saveData[3]);
    let loadedUpgrades = [];
    for (let upgradeData of saveData[4]) {
      let upgrade = new Upgrade(upgradeData.name, upgradeData.cost, upgradeData.power, upgradeData.count);
      loadedUpgrades.push(upgrade);
    }
    upgrades = loadedUpgrades;

    let loadedResearches = [];
    for (let researchData of saveData[5]) {
      let research = new Research(researchData.name, researchData.cost, researchData.power, researchData.count, researchData.type);
      loadedResearches.push(research);
    }
    researches = loadedResearches;
    console.log("Game loaded!");
  } else {
    console.log("No save data found.");
  }
}

// Simple upgradeCost calculation
function upgradeCost(cost, div, count) {
  return Math.ceil(cost + ((cost / div) + count) * (count * 1.025));
}

// Simple researchCost calculation
function researchCost(cost) {
  cost *= 5;
}

/**
 * Automatically increase the score every secound by the increment per sec factor
 */
const increment = setInterval(autoIncrement, 1000);

function autoIncrement() {
  score += incrementPerSec;
  totalScore += incrementPerSec;
  console.log("incre ps");
}

/**
 * Site Buttons
 */
const incrementButton = document.getElementById("increment");
incrementButton.addEventListener("click", function () {
  score += incrementPower;
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  save();
});

/**
 * Click Upgrades
 */
const c1 = document.getElementById("Click Upgrade 1");
c1.addEventListener("click", function () {
  purchaseUpgrade("Click Upgrade 1");
  displayUpgrades();
});

/**
 * Auto Upgrades
 */
const a1 = document.getElementById("Auto Upgrade 1");
a1.addEventListener("click", function () {
  purchaseUpgrade("Auto Upgrade 1");
  displayUpgrades();
});

/**
 * Research
 */
const r1 = document.getElementById("Increment Power 1");
r1.addEventListener("click", function () {
  purchaseResearch("Increment Power", "Click Upgrade 1");
  displayResearches();
});

const r2 = document.getElementById("Increment Cost 1");
r2.addEventListener("click", function () {
  purchaseResearch("Increment Cost", "Click Upgrade 1");
  displayResearches();
});