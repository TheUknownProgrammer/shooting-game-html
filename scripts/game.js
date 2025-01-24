
const game = document.getElementById("shooting_game");
const menu_screen = document.getElementById("menu_screen");

var increase = 10;

const bossMusics = [
    new Audio("resources/musics/boss musics/EnVHeaven Rd 2 Ng mix.mp3"),
    new Audio("resources/musics/boss musics/Glitch Hop or 110BPM  Tristam  Till Its Over Monstercat Release.mp3")
]; bossMusics.forEach((item) => item.loop = true);

var bossMusic;

function nextLevel() {
    if(parseInt(player.level)+1 < maxLevel) {
    if(typeof player.level === "string") player.level = parseInt(player.level);
    clearInterval(enemyGenerator);
    enemyGenerator = setInterval(generateEnemy, Math.max(enemyTime-25,1500));
    player.level++;
    increase = player.level % 5 == 0 ? increase + 5 : increase;
    player.scoreToNextLevel += increase;

        if(player.level % 10 == 0) {
            bossMusic = bossMusics[Math.floor(Math.random() * bossMusics.length)];
            bossMusic.play();
            game.classList.add("boss_level");
            game.style.removeProperty("background-image");
            clearInterval(enemyGenerator);
            enemyGenerator = setInterval(generateEnemy, 950);
            player.scoreToNextLevel = "defeat the boss.";
            player.level += " boss level.";
        } else if((player.level - 1) % 10 == 0) {
            bossMusic.pause();
            game.removeAttribute("class");
        } else { 
            randomColorBackground(game);
        }
    } else {
        player.scoreToNextLevel = Infinity;
        player.level = 100 + " max level";
    }

    player.updateStats();
}

function startGame() {
    playSound(new Audio("resources/sfxs/gun-handle.mp3"))
    player.initStats();
    player.updateStats();
    menu_screen.style.display = "none";
    game.style.visibility = "visible";
    enableWeapon();
    randomColorBackground(game);
    generateEnemy();
    enemyGenerator = setInterval(generateEnemy, enemyTime);
}

function endGame() {
    disableWeapon();
    clearInterval(enemyGenerator);
    alert("Game Over.");
    game.style.visibility = "hidden";
    menu_screen.style.display = "block";
    enemies_container.innerHTML = "";
    attackTimeouts.forEach(element => clearInterval(element));
    attackTimeouts = [];
}

function credits() {
    alert("By Tomer Agosin.");
}

