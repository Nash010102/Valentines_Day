let scene = 1;
let love = 0;
const music = document.getElementById("bgMusic");
const fireworksCanvas = document.getElementById("fireworks");

// --- Audio & Scene Handling ---
function start() {
    music.volume = 0.4;
    music.play().catch(() => console.log("User interaction needed for audio"));
    createFireflies(); 
    next(2);
}

function next(n) {
    const current = document.querySelector(".scene.active");
    if (current) {
        current.classList.remove("active");
        setTimeout(() => { current.style.display = "none"; }, 500);
    }
    const nextScene = document.getElementById("scene" + n);
    if (nextScene) {
        nextScene.style.display = "flex"; 
        setTimeout(() => { nextScene.classList.add("active"); }, 50);
    }
    scene = n;
    if (n === 8) { stopFireworks(); }
}

// --- Scene 2: Password ---
function checkPassword() {
    let val = document.getElementById("password").value.toLowerCase();
    if (val === "mochi" || val === "love" || val.includes("2024")) {
        document.getElementById("msg").innerText = "Access Granted, My Love 💖";
        setTimeout(() => next(3), 1000);
    } else {
        document.getElementById("msg").innerText = "Try 'mochi' 😉";
        document.getElementById("password").value = "";
    }
}

// --- Scene 3: Timeline Cards ---
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        document.getElementById("memoryReveal").innerText = card.dataset.message;
        card.style.background = "rgba(255, 78, 136, 0.4)";
    });
});

// --- Scene 4: Love Game ---
function addLove() {
    love += 20;
    document.getElementById("progress").style.width = love + "%";
    let btn = document.querySelector("#scene4 button");
    const phrases = ["Me (You) 😌", "Still Me 😌", "Always Me 😌", "Okay... Us! 💖"];
    if (love < 100) btn.innerText = phrases[Math.floor(love/25)];
    if (love >= 100) {
        spawnConfetti();
        setTimeout(() => next(5), 1500);
    }
}

document.getElementById("dodge").addEventListener("mouseover", function() {
    this.style.position = "absolute";
    this.style.left = Math.random() * 80 + "%";
    this.style.top = Math.random() * 80 + "%";
});

// --- Scene 5: Heart Heal ---
let heart = document.getElementById("heart");
let holdTimer;
heart.addEventListener("mousedown", startHeal);
heart.addEventListener("touchstart", startHeal);

function startHeal() {
    holdTimer = setInterval(() => {
        heart.style.transform = "scale(1.3) rotate(-45deg)";
        heart.style.filter = "drop-shadow(0 0 20px #ff0055)";
    }, 100);
    setTimeout(() => { clearInterval(holdTimer); next(6); }, 2000);
}

function stopHeal() {
    clearInterval(holdTimer);
    heart.style.transform = "rotate(-45deg)";
}
heart.addEventListener("mouseup", stopHeal);
heart.addEventListener("touchend", stopHeal);

// --- Scene 6 & 7: Final ---
function finalYes() {
    startFireworks();
    next(7);
    setTimeout(() => next(8), 5000); 
}

// --- Scene 8: Dinner Logic (Fixed) ---
function pourWine() {
    const wine = document.getElementById("wineLiquid");
    wine.style.height = "75%"; // Fills the glass
    setTimeout(() => {
        document.getElementById("ticketBtn").style.display = "inline-block";
        const pourBtn = document.querySelector(".posh-btn");
        pourBtn.style.display = "none";
    }, 2000);
}

function showTicket() {
    document.getElementById("dateTicket").style.display = "block";
    document.getElementById("ticketBtn").style.display = "none";
    document.querySelector(".dinner-title").innerText = "Our Date Awaits... 💖";
}

function downloadTicket() {
    alert("Ticket Saved! ❤️ Screenshot this for our real date night!");
}

// --- Visual Effects ---
function createFireflies() {
    const container = document.querySelector(".fireflies");
    for(let i=0; i<20; i++) {
        let f = document.createElement("div");
        f.style.cssText = `position: absolute; width: 4px; height: 4px; background: #fff; border-radius: 50%; top: ${Math.random()*100}%; left: ${Math.random()*100}%; animation: float ${5+Math.random()*10}s infinite linear; box-shadow: 0 0 10px white;`;
        container.appendChild(f);
    }
    const style = document.createElement("style");
    style.innerText = `@keyframes float { 0% {transform:translate(0,0); opacity:0;} 50% {opacity:1;} 100% {transform:translate(-20px, -100px); opacity:0;} }`;
    document.head.appendChild(style);
}

function spawnConfetti() {
    for(let i=0; i<50; i++) {
        let c = document.createElement("div");
        c.style.cssText = `position:fixed; width:10px; height:10px; background:${['#f00','#0f0','#00f','#ff0'][Math.floor(Math.random()*4)]}; top:-10px; left:${Math.random()*100}%; animation: fall 3s linear forwards;`;
        document.body.appendChild(c);
    }
}

// --- Fireworks Engine ---
const ctx = fireworksCanvas.getContext("2d");
let particles = [];
let fwInterval;

function startFireworks() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    fwInterval = setInterval(() => {
        let x = Math.random() * fireworksCanvas.width;
        let y = Math.random() * fireworksCanvas.height/2;
        for(let i=0; i<30; i++) {
            particles.push({
                x, y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5,
                life: 100, color: `hsl(${Math.random()*360}, 100%, 50%)`
            });
        }
    }, 500);
    animateFireworks();
}

function animateFireworks() {
    if(particles.length === 0 && !fwInterval) return;
    ctx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
        if(p.life <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animateFireworks);
}

function stopFireworks() {
    clearInterval(fwInterval);
    fwInterval = null;
    particles = [];
    ctx.clearRect(0,0,fireworksCanvas.width, fireworksCanvas.height);
}