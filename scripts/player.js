const player_container = document.getElementById("player");
const weapon = document.getElementById("weapon");
var weaponY = weapon.getBoundingClientRect().y;
const maxLevel = 100;


const reloadSound = new Audio("resources/sfxs/reload_sfx.mp3");

const shootSounds = [
    new Audio("resources/sfxs/player_shoots/shoot_0.mp3"),
    new Audio("resources/sfxs/player_shoots/shoot_1.mp3"),
    new Audio("resources/sfxs/player_shoots/shoot_2.mp3"),
];

Object.freeze(shootSounds);

const player = {
    health: 100,
    score: 0,
    level: 1,
    scoreToNextLevel: 10,
    ammo: 30,
    allowShoot: true,
    updateStats: function() {
        document.getElementById("health-points").textContent = this.health;
        document.getElementById("score-points").textContent = this.score;
        document.getElementById("current-level").textContent =  this.level;
        document.getElementById("score-to-next-level").textContent = this.scoreToNextLevel;
        document.getElementById("current-ammo").textContent = this.ammo;
    },
    initStats: function() {
        this.health = 100;
        this.score = 0;
        this.level = 0;
        this.scoreToNextLevel = 10;
        this.ammo = 30;
    }
}

function moveWeapon(e) {
    switch(true) {
        case e.x + weapon.clientWidth > window.innerWidth:
        weapon.style.left = (window.innerWidth - weapon.clientWidth) + "px";
        break;
        case e.x < 0: 
        weapon.style.left = "0px";
        break;
        default: 
        weapon.style.left = e.x + "px";
        break;
    }

    switch(true) {
        case e.y < weaponY: 
        weapon.style.top = weaponY + "px"; 
        break;
        default:
        weapon.style.top = e.y + "px";
        break;
    }
}

function bullet(e) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    player_container.append(bullet);
    bullet.setAttribute("style", 
        `left: ${e.x-parseFloat(getComputedStyle(bullet).width)/2}px;
        top: ${e.y-parseFloat(getComputedStyle(bullet).height)/2}px;
        `
    );

    fadeAway(bullet);
}

function weaponShoot(e) {
    if(e.button === 0 && player.allowShoot) {
        if(player.ammo > 0) {
        playSound(shootSounds[Math.floor(Math.random() * shootSounds.length)]);
        bullet(e);
        weapon.style.backgroundImage = "url(resources/sniper-shoot.png)";
        player.ammo--;
        player.updateStats();
        } else {
            reloadWeapon()
        }
    }
}

function weaponRelease() {
    weapon.style.backgroundImage = "url(resources/sniper.png)";
}

function fixedPosition() {
    weapon.style.bottom = "0";
    var weaponY = weapon.getBoundingClientRect().y;
    console.log(weaponY);
}

function enableWeapon() {
window.addEventListener("mousemove", moveWeapon);
window.addEventListener("mousedown", weaponShoot);
window.addEventListener("mouseup",weaponRelease);
window.addEventListener("resize", fixedPosition);
window.addEventListener("keydown", reloadPressR);
}

function disableWeapon() {
window.removeEventListener("mousemove", moveWeapon);
window.removeEventListener("mousedown", weaponShoot);
window.removeEventListener("mouseup",weaponRelease);
window.removeEventListener("resize", fixedPosition);
window.removeEventListener("keydown", reloadPressR);
}

function reloadWeapon() {
        player.allowShoot = false;
        playSound(reloadSound);
        setTimeout(() => {
            player.allowShoot = true;
            player.ammo = 30;
            player.updateStats();
        }, Math.ceil(reloadSound.duration * 1000));
}

function reloadPressR(e) {
    if(e.code == "KeyR" && player.allowShoot && player.ammo < 30) {
        reloadWeapon();
    }
}