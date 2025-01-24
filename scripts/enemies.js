const enemies_container = document.getElementById("enemies-container");
const enemyHitPlayer = new Audio("resources/sfxs/player_got_hit.mp3");

var enemyGenerator;
var enemyTime = 2.75 * 1000;
var attackTimeouts = [];


const bossTypes = [
    {
        name: "gear",
        file: "resources/gear.jpg",
        health: 350,
        size: 600,
    },
    {
        name: "ultra Violence",
        file: "resources/ultra_violence.jpg",
        health: 400,
        size: 700,
    },
];

const enemyTypes = {
    "attacker": {
        file: "resources/mole_arrive_sequence/mole arrive-0.png",
        sequence: loadSequence("resources/mole_arrive_sequence", "mole arrive-", ".png", 0, 7),
        spawnPrecent: 1 / 1.25,
        attackTime: 3000,
        damage: 10,
        whenAttack: function () {

            playSound(enemyHitPlayer);

            var currentClasses = game.className;
            var currentBcImg = game.style.backgroundImage;
            game.removeAttribute("class");
            game.style.removeProperty("background-image");

            game.classList.add("attack_red");
            setTimeout(() => {
                game.className = currentClasses;
                game.style.backgroundImage = currentBcImg;
            }, parseFloat(getComputedStyle(game).animationDuration) * 1000);
            player.updateStats();
        },
        whenKilled: function () {
            player.score++;

            if (player.score >= player.scoreToNextLevel) {
                nextLevel();
            }
            player.updateStats();
        }
    },
    "health-kit": {
        file: "resources/first_aid_kit.png",
        spawnPrecent: 1 / 5,
        attackTime: 2000,
        damage: 0,
        whenAttack: function () {
            return;
        },
        whenKilled: function () {
            if (player.health + 10 <= 100) {
                player.health += 10;
            }
            player.updateStats();
        }
    }
}

function determineEnemy() {
    var values = Object.values(enemyTypes);
    var randomVal = Math.random() * values.reduce((sum, item) => sum + item.spawnPrecent, 0);
    values.sort((a, b) => Math.random() - 0.5);

    for (let enemy of values) {
        //var randomValue = Math.random() * weight;
        var precent = enemy.spawnPrecent;
        if (precent >= randomVal) {
            return enemy;
        } else {
            randomVal -= precent;
        }
    }

    //return enemyTypes.attacker; // values[Math.floor(Math.random() * values.length)]
}

// ideas:
// add multiple types of enemys.
// make a first aid kit enemy that restores the player 5 health points when shot. this is more rare than a regular enemy and will be in one in 5 regular enemies.
// add the player a time bar that when it over, the player attacks, and the player losses health points.
// every level at the end will have a small boss. when the level counter is divisible by 10, there will be big boss.

function timeBarConstructor(totalMilleseconds, func) {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    var barWidthPrecent = 0;
    const eachInterval = Math.abs(totalMilleseconds / 100);

    const barProgress = setInterval(() => {
        if (barWidthPrecent >= 100) {
            clearInterval(barProgress);
            func();
        } else {
            barWidthPrecent++;
            bar.style.width = `${barWidthPrecent}%`;
        }
    }, eachInterval); // 3 seconds in total because 30 milleseconds * 100 (precent) = 3000

    return { element: bar, intervalId: barProgress };
}

function generateEnemy() {
    const enemyType = determineEnemy();
    const enemyArea = document.createElement("div");
    enemyArea.setAttribute("id", "enemy");
    const enemy = document.createElement("img");
    enemy.src = enemyType.file;
    enemy.addEventListener("mousedown", killEnemy);

    var enemySize = Math.floor(Math.random() * 101) + 100;

    enemy.setAttribute("style",
        `width: ${enemySize}px;
        height: ${enemySize}px;`
    )

    var timebar = timeBarConstructor(enemyType.attackTime, attack);

    enemyArea.append(enemy, timebar.element)
    enemies_container.append(enemyArea);

    /*var maxWidth = width * 2;
    var maxHeight = height * 2; // the idea is to make the enemy bigger each time when he gets incresingly closer to attack the play.*/

    const totalWidthArea = enemySize;
    const totalHeightArea = enemyArea.offsetHeight;

    /*console.log(enemyArea);
    console.log(`total height: ${totalHeightArea}\nenemy height: ${enemySize}`);*/

    enemyArea.setAttribute("style",
        `position: absolute;
    left: ${Math.floor(Math.random() * (screen.availWidth - totalWidthArea))}px;
    top: ${Math.floor(Math.random() * (screen.availHeight - totalHeightArea))}px;
    z-index: 0;`
    )


    // add a text with a text how much until the enemy attack.
    // 30
    var totalTime = enemyType.attackTime; // milleseconds * 100; 
    var index = attackTimeouts.push(timebar.intervalId) - 1;

    if (enemyType.hasOwnProperty("sequence")) {
        runSequence(enemyType.sequence, enemy, totalTime / enemyType.sequence.length); // 3000 milleseconds / 8 frames in first type of enemy = 375 milleseconds
    }

    //var attackTime = setTimeout(attack, 4000);
    //var goingForward;

    function attack() {
        enemyArea.remove();
        player.health -= enemyType.damage;

        if (player.health <= 0) {
            endGame();
        }
        attackTimeouts.splice(index, 1);
        enemyType.whenAttack();
    }

    function killEnemy(e) {
        if (e.button == 0 && player.allowShoot) {
            clearInterval(timebar.intervalId);
            enemyArea.remove();
            attackTimeouts.splice(index, 1);
            enemyType.whenKilled();
        }
    }
}