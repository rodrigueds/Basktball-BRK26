/* =========================================================
   BRK26 — O FUTURO DAS QUADRAS
   GAME ENGINE
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       SAVE
    ====================================================== */

    const SAVE_KEY = "BRK26_SAVE_V2";


    const defaultSave = {

        level: 1,

        xp: 0,

        credits: 500,

        selectedPlayer: "rodrigues",

        ownedPlayers: [
            "rodrigues"
        ],

        ownedItems: [],

        careerStage: 1,

        stats: {

            games: 0,

            wins: 0,

            points: 0,

            threes: 0,

            dunks: 0,

            greens: 0,

            bestCombo: 0

        }

    };


    function loadSave() {

        try {

            const raw = localStorage.getItem(SAVE_KEY);

            if (!raw) {
                return structuredClone(defaultSave);
            }

            const parsed = JSON.parse(raw);

            return {

                ...structuredClone(defaultSave),

                ...parsed,

                stats: {
                    ...defaultSave.stats,
                    ...(parsed.stats || {})
                }

            };

        } catch {

            return structuredClone(defaultSave);

        }

    }


    let save = loadSave();


    function saveGame() {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(save)
        );

    }


    /* =====================================================
       DATA
    ====================================================== */

    const players = [

        {
            id: "rodrigues",
            name: "RODRIGUES",
            ability: "GREEN MACHINE",
            description: "Janela de green release ampliada.",
            power: 80,
            price: 0,
            speed: 5.2,
            accuracy: 0.82,
            dunk: 0.72
        },

        {
            id: "flash",
            name: "FLASH",
            ability: "QUICK STEP",
            description: "Movimento extremamente rápido.",
            power: 74,
            price: 800,
            speed: 6.8,
            accuracy: 0.72,
            dunk: 0.55
        },

        {
            id: "sniper",
            name: "SNIPER",
            ability: "DEEP RANGE",
            description: "Especialista em arremessos longos.",
            power: 91,
            price: 1200,
            speed: 4.7,
            accuracy: 0.91,
            dunk: 0.45
        },

        {
            id: "titan",
            name: "TITAN",
            ability: "POWER DUNK",
            description: "Enterradas mais fortes e fáceis.",
            power: 95,
            price: 1500,
            speed: 4.5,
            accuracy: 0.68,
            dunk: 0.96
        },

        {
            id: "rookie",
            name: "ROOKIE",
            ability: "NO ABILITY",
            description: "Sem habilidade especial.",
            power: 60,
            price: 0,
            speed: 4.8,
            accuracy: 0.62,
            dunk: 0.45
        },

        {
            id: "phantom",
            name: "PHANTOM",
            ability: "TIME BREAK",
            description: "Reduz a velocidade dos adversários.",
            power: 88,
            price: 2200,
            speed: 5.5,
            accuracy: 0.82,
            dunk: 0.67
        }

    ];


    const shopItems = [

        {
            id: "orange-core",
            name: "ORANGE CORE",
            type: "EFFECT",
            description: "Efeito energético para pontuações.",
            price: 700
        },

        {
            id: "neon-trail",
            name: "NEON TRAIL",
            type: "EFFECT",
            description: "Rastro luminoso durante movimentos.",
            price: 700
        },

        {
            id: "brk-runner",
            name: "BRK RUNNER",
            type: "SHOES",
            description: "Tênis oficial BRK26.",
            price: 900
        },

        {
            id: "digital-visor",
            name: "DIGITAL VISOR",
            type: "GEAR",
            description: "Visor tecnológico para o jogador.",
            price: 1000
        },

        {
            id: "neon-court",
            name: "NEON COURT",
            type: "ARENA",
            description: "Arena especial BRK26.",
            price: 1300
        },

        {
            id: "gold-effect",
            name: "GOLD EFFECT",
            type: "EFFECT",
            description: "Pontuações recebem efeito premium.",
            price: 1600
        },

        {
            id: "brk-legend",
            name: "BRK LEGEND",
            type: "GEAR",
            description: "Item reservado para jogadores lendários.",
            price: 1800
        },

        {
            id: "mvp-chain",
            name: "MVP CHAIN",
            type: "GEAR",
            description: "Cosmético exclusivo.",
            price: 1900
        }

    ];


    /* =====================================================
       DOM
    ====================================================== */

    const $ = id =>
        document.getElementById(id);


    const screens =
        document.querySelectorAll(".screen");


    /* =====================================================
       NAVIGATION
    ====================================================== */

    function showScreen(id) {

        screens.forEach(screen => {

            screen.classList.remove("active");

        });


        const target = $(id);

        if (target) {

            target.classList.add("active");

        }


        if (id === "menuScreen") {

            updateHome();

        }


        if (id === "statsScreen") {

            renderStats();

        }


        if (id === "characterScreen") {

            renderPlayers();

        }


        if (id === "shopScreen") {

            renderShop();

        }


        if (id === "careerScreen") {

            renderCareer();

        }

    }


    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest("[data-screen]");

            if (!target) return;

            const screen =
                target.dataset.screen;

            showScreen(screen);

        }
    );


    /* =====================================================
       HOME
    ====================================================== */

    function updateHome() {

        $("levelValue").textContent =
            save.level;

        $("xpValue").textContent =
            save.xp;

        $("creditsValue").textContent =
            save.credits;

        $("winsValue").textContent =
            save.stats.wins;

        $("headerLevel").textContent =
            save.level;

        document
            .querySelectorAll(".credits-text")
            .forEach(el => {

                el.textContent =
                    save.credits;

            });

    }


    /* =====================================================
       PLAY BUTTON
    ====================================================== */

    $("playBtn").addEventListener(
        "click",
        () => {

            startGame();

        }
    );


    /* =====================================================
       PLAYERS
    ====================================================== */

    function renderPlayers() {

        const container =
            $("playerList");

        container.innerHTML = "";


        players.forEach(player => {

            const owned =
                save.ownedPlayers.includes(player.id);

            const selected =
                save.selectedPlayer === player.id;


            const card =
                document.createElement("article");

            card.className =
                "player-card" +
                (selected ? " selected" : "");


            card.innerHTML = `

                <div class="player-number">
                    #${String(
                        players.indexOf(player) + 1
                    ).padStart(2,"0")}
                </div>

                <div class="player-avatar">
                    ${player.name.charAt(0)}
                </div>

                <h3>
                    ${player.name}
                </h3>

                <div class="player-ability">
                    ${player.ability}
                </div>

                <div class="player-power">

                    <div class="player-power-head">
                        <span>POWER</span>
                        <span>${player.power}</span>
                    </div>

                    <div class="power-bar">
                        <div
                            class="power-fill"
                            style="width:${player.power}%"
                        ></div>
                    </div>

                </div>

                <button
                    class="player-select ${
                        owned ? "" : "locked"
                    }"
                    ${owned ? "" : "disabled"}
                    data-player="${player.id}"
                >
                    ${
                        selected
                            ? "SELECTED"
                            : owned
                                ? "SELECT"
                                : `${player.price} CR`
                    }
                </button>

            `;


            const button =
                card.querySelector(
                    ".player-select"
                );


            if (owned) {

                button.addEventListener(
                    "click",
                    () => {

                        save.selectedPlayer =
                            player.id;

                        saveGame();

                        renderPlayers();

                    }
                );

            }


            container.appendChild(card);

        });

    }


    /* =====================================================
       SHOP
    ====================================================== */

    function renderShop() {

        const container =
            $("shopList");

        container.innerHTML = "";


        shopItems.forEach(item => {

            const owned =
                save.ownedItems.includes(item.id);


            const card =
                document.createElement("article");

            card.className =
                "shop-card";


            card.innerHTML = `

                <div class="shop-icon">
                    ${item.type === "SHOES" ? "01" :
                      item.type === "GEAR" ? "02" :
                      item.type === "ARENA" ? "03" : "04"}
                </div>

                <small>
                    BRK MARKET // ${item.type}
                </small>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.description}
                </p>

                <button
                    class="shop-buy ${
                        owned ? "owned" : ""
                    }"
                    ${owned ? "disabled" : ""}
                    data-item="${item.id}"
                >
                    ${
                        owned
                            ? "ADQUIRIDO"
                            : `${item.price} CR`
                    }
                </button>

            `;


            const button =
                card.querySelector(
                    ".shop-buy"
                );


            if (!owned) {

                button.addEventListener(
                    "click",
                    () => {

                        buyItem(item);

                    }
                );

            }


            container.appendChild(card);

        });

    }


    function buyItem(item) {

        if (save.credits < item.price) {

            showMessage(
                "CRÉDITOS INSUFICIENTES"
            );

            return;

        }


        save.credits -= item.price;

        save.ownedItems.push(item.id);

        saveGame();

        renderShop();

        updateHome();

    }


    /* =====================================================
       CAREER
    ====================================================== */

    function renderCareer() {

        const nodes =
            document.querySelectorAll(
                ".career-node"
            );


        nodes.forEach(node => {

            const match =
                Number(node.dataset.match);


            if (match <= save.careerStage) {

                node.classList.add("unlocked");

            } else {

                node.classList.remove("unlocked");

            }

        });

    }


    /* =====================================================
       STATS
    ====================================================== */

    function renderStats() {

        $("statGames").textContent =
            save.stats.games;

        $("statWins").textContent =
            save.stats.wins;

        $("statPoints").textContent =
            save.stats.points;

        $("statThrees").textContent =
            save.stats.threes;

        $("statDunks").textContent =
            save.stats.dunks;

        $("statGreens").textContent =
            save.stats.greens;

        $("statCombo").textContent =
            save.stats.bestCombo;

    }


    /* =====================================================
       GAME STATE
    ====================================================== */

    const canvas =
        $("gameCanvas");

    const ctx =
        canvas.getContext("2d");


    let rafId = null;

    let running = false;

    let paused = false;

    let finished = false;

    let lastTime = 0;


    let gameTime = 60;

    let score = 0;

    let enemyScore = 0;

    let combo = 0;

    let stamina = 100;

    let special = 0;


    let keys = {};


    const player = {

        x: 0,

        y: 0,

        radius: 25,

        vx: 0,

        vy: 0,

        speed: 5

    };


    const enemy = {

        x: 0,

        y: 0,

        radius: 25,

        speed: 3.1,

        contest: 0,

        scoreTimer: 5

    };


    const ball = {

        x: 0,

        y: 0,

        startX: 0,

        startY: 0,

        targetX: 0,

        targetY: 0,

        progress: 0,

        active: false,

        made: false,

        type: "shot",

        radius: 10,

        arc: 100

    };


    const rim = {

        x: 0,

        y: 0,

        radius: 25

    };


    let shotCharge = 0;

    let charging = false;

    let shotDirection = 1;


    /* =====================================================
       CANVAS
    ====================================================== */

    function resizeCanvas() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            window.innerWidth * dpr;

        canvas.height =
            window.innerHeight * dpr;


        canvas.style.width =
            window.innerWidth + "px";

        canvas.style.height =
            window.innerHeight + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        positionCourt();

    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    function positionCourt() {

        const w =
            window.innerWidth;

        const h =
            window.innerHeight;


        player.x =
            Math.min(
                Math.max(
                    player.x || w * .5,
                    w * .18
                ),
                w * .82
            );

        player.y =
            Math.min(
                Math.max(
                    player.y || h * .70,
                    h * .38
                ),
                h * .83
            );


        enemy.x =
            enemy.x || w * .52;

        enemy.y =
            enemy.y || h * .42;


        rim.x =
            w * .5;

        rim.y =
            h * .20;

    }


    resizeCanvas();


    /* =====================================================
       GAME START
    ====================================================== */

    function startGame() {

        cancelAnimationFrame(
            rafId
        );


        running = true;

        paused = false;

        finished = false;

        lastTime = performance.now();


        gameTime = 60;

        score = 0;

        enemyScore = 0;

        combo = 0;

        stamina = 100;

        special = 0;


        charging = false;

        shotCharge = 0;


        const w =
            window.innerWidth;

        const h =
            window.innerHeight;


        player.x = w * .5;

        player.y = h * .72;

        player.vx = 0;

        player.vy = 0;


        enemy.x = w * .5;

        enemy.y = h * .43;

        enemy.scoreTimer = 5;


        ball.active = false;


        $("scoreValue").textContent = "0";

        $("enemyScoreValue").textContent = "0";

        $("timeValue").textContent = "60";

        $("comboValue").textContent = "x0";


        $("pauseOverlay")
            .classList.add("hidden");

        $("resultOverlay")
            .classList.add("hidden");


        showScreen("gameScreen");


        requestAnimationFrame(
            gameLoop
        );

    }


    /* =====================================================
       GAME LOOP
    ====================================================== */

    function gameLoop(timestamp) {

        if (!running) {
            return;
        }


        rafId =
            requestAnimationFrame(
                gameLoop
            );


        if (paused) {

            lastTime = timestamp;

            drawGame();

            return;

        }


        let dt =
            (timestamp - lastTime) / 1000;


        lastTime = timestamp;


        dt =
            Math.min(
                dt,
                .035
            );


        updateGame(dt);

        drawGame();

    }


    /* =====================================================
       GAME UPDATE
    ====================================================== */

    function updateGame(dt) {

        gameTime -= dt;


        if (gameTime <= 0) {

            gameTime = 0;

            finishGame();

            return;

        }


        updatePlayer(dt);

        updateEnemy(dt);

        updateBall(dt);

        updateShotMeter();

        updateEnemyScore(dt);

        stamina =
            Math.min(
                100,
                stamina + dt * 5
            );


        special =
            Math.min(
                100,
                special + dt * 1.8
            );


        updateHUD();

    }


    /* =====================================================
       PLAYER
    ====================================================== */

    function updatePlayer() {

        if (ball.active) {
            return;
        }


        let dx = 0;

        let dy = 0;


        if (keys["w"] || keys["arrowup"]) {
            dy -= 1;
        }

        if (keys["s"] || keys["arrowdown"]) {
            dy += 1;
        }

        if (keys["a"] || keys["arrowleft"]) {
            dx -= 1;
        }

        if (keys["d"] || keys["arrowright"]) {
            dx += 1;
        }


        const length =
            Math.hypot(dx,dy);


        if (length > 0) {

            dx /= length;

            dy /= length;


            const selected =
                players.find(
                    p =>
                        p.id ===
                        save.selectedPlayer
                ) || players[0];


            player.speed =
                selected.speed;


            player.x +=
                dx *
                player.speed *
                60 *
                (stamina > 5 ? 1 : .45);

            player.y +=
                dy *
                player.speed *
                60 *
                (stamina > 5 ? 1 : .45);


            stamina -=
                .18;

        }


        const w =
            window.innerWidth;

        const h =
            window.innerHeight;


        player.x =
            Math.max(
                w * .12,
                Math.min(
                    w * .88,
                    player.x
                )
            );


        player.y =
            Math.max(
                h * .30,
                Math.min(
                    h * .84,
                    player.y
                )
            );

    }


    /* =====================================================
       ENEMY AI
    ====================================================== */

    function updateEnemy(dt) {

        if (ball.active) {
            return;
        }


        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;

        const distance =
            Math.hypot(dx,dy);


        if (distance > 75) {

            enemy.x +=
                dx /
                distance *
                enemy.speed *
                60 *
                dt;

            enemy.y +=
                dy /
                distance *
                enemy.speed *
                60 *
                dt;

        }


        enemy.contest =
            Math.max(
                0,
                1 -
                distance / 170
            );

    }


    /* =====================================================
       ENEMY SCORE
    ====================================================== */

    function updateEnemyScore(dt) {

        enemy.scoreTimer -= dt;


        if (
            enemy.scoreTimer <= 0 &&
            !ball.active
        ) {

            const chance =
                Math.random();


            if (chance < .6) {

                enemyScore +=
                    Math.random() < .25
                        ? 3
                        : 2;

                combo = 0;

                showMessage(
                    "DEFESA CONCEDEU PONTOS"
                );

            }


            enemy.scoreTimer =
                4 +
                Math.random() * 5;

        }

    }


    /* =====================================================
       SHOOTING
    ====================================================== */

    function beginCharge() {

        if (
            !running ||
            paused ||
            ball.active ||
            charging
        ) {
            return;
        }


        charging = true;

        shotCharge = 0;

        shotDirection = 1;

    }


    function releaseShot() {

        if (!charging) {
            return;
        }


        charging = false;


        const selected =
            players.find(
                p =>
                    p.id ===
                    save.selectedPlayer
            ) || players[0];


        const meter =
            shotCharge;


        const greenCenter = .5;


        const greenWindow =
            selected.id === "rodrigues"
                ? .14
                : .09;


        const distanceFromGreen =
            Math.abs(
                meter -
                greenCenter
            );


        const green =
            distanceFromGreen <=
            greenWindow;


        const distance =
            Math.hypot(
                player.x - rim.x,
                player.y - rim.y
            );


        const baseChance =
            selected.accuracy;


        const distancePenalty =
            Math.max(
                0,
                distance - 250
            ) / 700;


        const contestPenalty =
            enemy.contest *
            .20;


        let chance =
            baseChance -
            distancePenalty -
            contestPenalty;


        if (green) {

            chance =
                Math.min(
                    .99,
                    chance + .25
                );

        }


        const made =
            green ||
            Math.random() < chance;


        launchBall(
            made,
            green,
            false
        );

    }


    /* =====================================================
       DUNK
    ====================================================== */

    function attemptDunk() {

        if (
            !running ||
            paused ||
            ball.active
        ) {
            return;
        }


        const selected =
            players.find(
                p =>
                    p.id ===
                    save.selectedPlayer
            ) || players[0];


        const distance =
            Math.hypot(
                player.x - rim.x,
                player.y - rim.y
            );


        if (distance > 260) {

            showMessage(
                "CHEGUE MAIS PERTO DA CESTA"
            );

            return;

        }


        if (stamina < 25) {

            showMessage(
                "SEM STAMINA"
            );

            return;

        }


        stamina -= 25;


        const made =
            Math.random() <
            selected.dunk;


        launchBall(
            made,
            true,
            true
        );

    }


    /* =====================================================
       SPECIAL
    ====================================================== */

    function activateSpecial() {

        if (
            special < 100 ||
            !running ||
            paused
        ) {
            return;
        }


        special = 0;


        const selected =
            players.find(
                p =>
                    p.id ===
                    save.selectedPlayer
            ) || players[0];


        if (
            selected.id ===
            "phantom"
        ) {

            enemy.speed *= .35;

            setTimeout(
                () => {
                    enemy.speed = 3.1;
                },
                5000
            );

        }


        if (
            selected.id ===
            "flash"
        ) {

            player.speed += 2;

            setTimeout(
                () => {
                    player.speed -= 2;
                },
                5000
            );

        }


        if (
            selected.id ===
            "sniper"
        ) {

            showMessage(
                "DEEP RANGE"
            );

        }


        if (
            selected.id ===
            "titan"
        ) {

            showMessage(
                "POWER DUNK"
            );

        }


        if (
            selected.id ===
            "rodrigues"
        ) {

            showMessage(
                "GREEN MACHINE"
            );

        }

    }


    /* =====================================================
       BALL
    ====================================================== */

    function launchBall(
        made,
        green,
        dunk
    ) {

        ball.active = true;

        ball.made = made;

        ball.progress = 0;

        ball.startX =
            player.x;

        ball.startY =
            player.y - 30;

        ball.targetX =
            rim.x;

        ball.targetY =
            rim.y;

        ball.type =
            dunk
                ? "dunk"
                : "shot";

        ball.arc =
            dunk
                ? 45
                : 110;


        ball.green =
            green;

    }


    function updateBall(dt) {

        if (!ball.active) {
            return;
        }


        ball.progress +=
            dt *
            (
                ball.type === "dunk"
                    ? 2.4
                    : 1.65
            );


        const t =
            Math.min(
                ball.progress,
                1
            );


        ball.x =
            ball.startX +
            (
                ball.targetX -
                ball.startX
            ) *
            t;


        const baseY =
            ball.startY +
            (
                ball.targetY -
                ball.startY
            ) *
            t;


        ball.y =
            baseY -
            Math.sin(
                t * Math.PI
            ) *
            ball.arc;


        if (t >= 1) {

            resolveShot();

        }

    }


    function resolveShot() {

        ball.active = false;


        if (ball.made) {

            const points =
                ball.type === "dunk"
                    ? 2
                    : isThreePointShot()
                        ? 3
                        : 2;


            score += points;


            combo += 1;


            special =
                Math.min(
                    100,
                    special +
                    15 +
                    combo * 2
                );


            if (ball.green) {

                save.stats.greens += 1;

                showMessage(
                    "GREEN!"
                );

            } else if (
                ball.type === "dunk"
            ) {

                save.stats.dunks += 1;

                showMessage(
                    "DUNK!"
                );

            } else {

                showMessage(
                    `+${points}`
                );

            }


            save.stats.points +=
                points;


            if (points === 3) {
                save.stats.threes += 1;
            }


            save.stats.bestCombo =
                Math.max(
                    save.stats.bestCombo,
                    combo
                );


            ball.x =
                player.x;

            ball.y =
                player.y;

        } else {

            combo = 0;

            showMessage(
                "MISS"
            );

        }


        updateHUD();

    }


    function isThreePointShot() {

        const distance =
            Math.hypot(
                player.x - rim.x,
                player.y - rim.y
            );

        return distance > 300;

    }


    /* =====================================================
       SHOT METER
    ====================================================== */

    function updateShotMeter() {

        if (!charging) {
            return;
        }


        shotCharge +=
            .025 *
            shotDirection;


        if (
            shotCharge >= 1
        ) {

            shotCharge = 1;

            shotDirection = -1;

        }


        if (
            shotCharge <= 0
        ) {

            shotCharge = 0;

            shotDirection = 1;

        }


        $("meterPointer")
            .style.left =
                `${shotCharge * 100}%`;

    }


    /* =====================================================
       HUD
    ====================================================== */

    function updateHUD() {

        $("scoreValue").textContent =
            score;

        $("enemyScoreValue").textContent =
            enemyScore;

        $("timeValue").textContent =
            Math.ceil(gameTime);

        $("comboValue").textContent =
            `x${combo}`;

        $("staminaFill").style.width =
            `${stamina}%`;

        $("specialFill").style.width =
            `${special}%`;

    }


    /* =====================================================
       DRAW
    ====================================================== */

    function drawGame() {

        const w =
            window.innerWidth;

        const h =
            window.innerHeight;


        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        drawBackground(
            w,
            h
        );

        drawCourt(
            w,
            h
        );

        drawHoop();

        drawEnemy();

        drawPlayer();

        if (ball.active) {

            drawBall();

        } else {

            drawHeldBall();

        }

    }


    /* =====================================================
       BACKGROUND
    ====================================================== */

    function drawBackground(w,h) {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                w,
                h
            );

        gradient.addColorStop(
            0,
            "#090c0a"
        );

        gradient.addColorStop(
            .5,
            "#07100b"
        );

        gradient.addColorStop(
            1,
            "#160c06"
        );


        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.025)";

        ctx.lineWidth = 1;


        const grid = 50;


        for (
            let x = 0;
            x < w;
            x += grid
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                h
            );

            ctx.stroke();

        }


        for (
            let y = 0;
            y < h;
            y += grid
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                w,
                y
            );

            ctx.stroke();

        }

    }


    /* =====================================================
       COURT
    ====================================================== */

    function drawCourt(w,h) {

        const courtTop =
            h * .13;

        const courtBottom =
            h * .91;

        const courtLeft =
            w * .10;

        const courtRight =
            w * .90;


        const gradient =
            ctx.createLinearGradient(
                0,
                courtTop,
                0,
                courtBottom
            );

        gradient.addColorStop(
            0,
            "#17211a"
        );

        gradient.addColorStop(
            1,
            "#0b100d"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();

        ctx.moveTo(
            courtLeft,
            courtTop
        );

        ctx.lineTo(
            courtRight,
            courtTop
        );

        ctx.lineTo(
            courtRight,
            courtBottom
        );

        ctx.lineTo(
            courtLeft,
            courtBottom
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle =
            "rgba(255,101,0,.35)";

        ctx.lineWidth = 2;

        ctx.stroke();


        /* CENTER */

        ctx.beginPath();

        ctx.arc(
            w * .5,
            h * .52,
            Math.min(w,h) * .11,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        /* THREE POINT ARC */

        ctx.beginPath();

        ctx.arc(
            w * .5,
            rim.y + 20,
            Math.min(w,h) * .31,
            0,
            Math.PI
        );

        ctx.stroke();


        /* PAINT */

        ctx.strokeRect(
            w * .36,
            courtTop,
            w * .28,
            h * .28
        );


        /* FLOOR LIGHT */

        const glow =
            ctx.createRadialGradient(
                w * .5,
                h * .55,
                20,
                w * .5,
                h * .55,
                w * .55
            );

        glow.addColorStop(
            0,
            "rgba(255,101,0,.07)"
        );

        glow.addColorStop(
            1,
            "transparent"
        );


        ctx.fillStyle =
            glow;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

    }


    /* =====================================================
       HOOP
    ====================================================== */

    function drawHoop() {

        const backboardW =
            150;

        const backboardH =
            75;


        const bx =
            rim.x -
            backboardW / 2;

        const by =
            rim.y -
            50;


        /* BACKBOARD */

        ctx.fillStyle =
            "rgba(210,230,220,.08)";

        ctx.fillRect(
            bx,
            by,
            backboardW,
            backboardH
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.65)";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            bx,
            by,
            backboardW,
            backboardH
        );


        /* BACKBOARD TARGET */

        ctx.strokeStyle =
            "rgba(255,101,0,.75)";

        ctx.strokeRect(
            rim.x - 30,
            by + 16,
            60,
            40
        );


        /* POLE */

        ctx.strokeStyle =
            "#252b27";

        ctx.lineWidth = 12;

        ctx.beginPath();

        ctx.moveTo(
            rim.x,
            by
        );

        ctx.lineTo(
            rim.x,
            rim.y - 5
        );

        ctx.stroke();


        /* RIM */

        ctx.strokeStyle =
            "#ff6500";

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.ellipse(
            rim.x,
            rim.y,
            rim.radius,
            9,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        /* NET */

        ctx.strokeStyle =
            "rgba(230,230,230,.45)";

        ctx.lineWidth = 1;


        for (
            let i = -3;
            i <= 3;
            i++
        ) {

            ctx.beginPath();

            ctx.moveTo(
                rim.x + i * 6,
                rim.y + 5
            );

            ctx.lineTo(
                rim.x + i * 4,
                rim.y + 35
            );

            ctx.stroke();

        }


        ctx.beginPath();

        ctx.moveTo(
            rim.x - 24,
            rim.y + 7
        );

        ctx.lineTo(
            rim.x - 15,
            rim.y + 35
        );

        ctx.moveTo(
            rim.x + 24,
            rim.y + 7
        );

        ctx.lineTo(
            rim.x + 15,
            rim.y + 35
        );

        ctx.stroke();

    }


    /* =====================================================
       PLAYER
    ====================================================== */

    function drawPlayer() {

        const x =
            player.x;

        const y =
            player.y;


        /* SHADOW */

        ctx.fillStyle =
            "rgba(0,0,0,.4)";

        ctx.beginPath();

        ctx.ellipse(
            x,
            y + 25,
            40,
            12,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* LEGS */

        ctx.strokeStyle =
            "#101613";

        ctx.lineWidth = 18;

        ctx.lineCap =
            "round";


        ctx.beginPath();

        ctx.moveTo(
            x - 9,
            y + 8
        );

        ctx.lineTo(
            x - 13,
            y + 38
        );

        ctx.moveTo(
            x + 9,
            y + 8
        );

        ctx.lineTo(
            x + 13,
            y + 38
        );

        ctx.stroke();


        /* BODY */

        ctx.fillStyle =
            "#ff6500";

        ctx.beginPath();

        ctx.moveTo(
            x - 21,
            y - 35
        );

        ctx.lineTo(
            x + 21,
            y - 35
        );

        ctx.lineTo(
            x + 17,
            y + 10
        );

        ctx.lineTo(
            x - 17,
            y + 10
        );

        ctx.closePath();

        ctx.fill();


        /* JERSEY NUMBER */

        ctx.fillStyle =
            "#fff";

        ctx.font =
            "bold 18px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "26",
            x,
            y - 3
        );


        /* HEAD */

        const headGradient =
            ctx.createRadialGradient(
                x - 5,
                y - 52,
                2,
                x,
                y - 50,
                17
            );

        headGradient.addColorStop(
            0,
            "#ffd09d"
        );

        headGradient.addColorStop(
            1,
            "#a95125"
        );

        ctx.fillStyle =
            headGradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y - 52,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* ARMS */

        ctx.strokeStyle =
            "#b75a29";

        ctx.lineWidth = 13;

        ctx.lineCap =
            "round";


        ctx.beginPath();

        ctx.moveTo(
            x - 18,
            y - 27
        );

        ctx.lineTo(
            x - 43,
            y - 2
        );

        ctx.moveTo(
            x + 18,
            y - 27
        );

        ctx.lineTo(
            x + 38,
            y - 7
        );

        ctx.stroke();

    }


    /* =====================================================
       ENEMY
    ====================================================== */

    function drawEnemy() {

        const x =
            enemy.x;

        const y =
            enemy.y;


        ctx.fillStyle =
            "rgba(0,0,0,.4)";

        ctx.beginPath();

        ctx.ellipse(
            x,
            y + 24,
            38,
            10,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#121817";

        ctx.lineWidth = 17;

        ctx.lineCap =
            "round";


        ctx.beginPath();

        ctx.moveTo(
            x - 9,
            y + 5
        );

        ctx.lineTo(
            x - 12,
            y + 34
        );

        ctx.moveTo(
            x + 9,
            y + 5
        );

        ctx.lineTo(
            x + 12,
            y + 34
        );

        ctx.stroke();


        ctx.fillStyle =
            "#1c2420";

        ctx.beginPath();

        ctx.moveTo(
            x - 20,
            y - 32
        );

        ctx.lineTo(
            x + 20,
            y - 32
        );

        ctx.lineTo(
            x + 16,
            y + 9
        );

        ctx.lineTo(
            x - 16,
            y + 9
        );

        ctx.closePath();

        ctx.fill();


        ctx.fillStyle =
            "#65ff19";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 48,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#333";

        ctx.lineWidth = 11;


        ctx.beginPath();

        ctx.moveTo(
            x - 17,
            y - 24
        );

        ctx.lineTo(
            x - 35,
            y - 2
        );

        ctx.moveTo(
            x + 17,
            y - 24
        );

        ctx.lineTo(
            x + 35,
            y - 2
        );

        ctx.stroke();

    }


    /* =====================================================
       BALL
    ====================================================== */

    function drawBall() {

        drawBasketball(
            ball.x,
            ball.y,
            ball.radius
        );

    }


    function drawHeldBall() {

        drawBasketball(
            player.x + 31,
            player.y - 7,
            10
        );

    }


    function drawBasketball(
        x,
        y,
        radius
    ) {

        const gradient =
            ctx.createRadialGradient(
                x - radius * .35,
                y - radius * .35,
                1,
                x,
                y,
                radius
            );

        gradient.addColorStop(
            0,
            "#ffb66d"
        );

        gradient.addColorStop(
            .55,
            "#ff7116"
        );

        gradient.addColorStop(
            1,
            "#9d2e00"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "rgba(30,15,5,.85)";

        ctx.lineWidth = 1.3;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius * .72,
            -.8,
            1.9
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius * .72,
            2.2,
            5.0
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            x - radius,
            y
        );

        ctx.quadraticCurveTo(
            x,
            y + radius * .25,
            x + radius,
            y
        );

        ctx.stroke();

    }


    /* =====================================================
       MESSAGE
    ====================================================== */

    let messageTimeout = null;


    function showMessage(text) {

        const element =
            $("gameMessage");


        element.textContent =
            text;


        element.classList.add(
            "show"
        );


        clearTimeout(
            messageTimeout
        );


        messageTimeout =
            setTimeout(
                () => {

                    element.classList.remove(
                        "show"
                    );

                },
                800
            );

    }


    /* =====================================================
       PAUSE
    ====================================================== */

    function togglePause() {

        if (
            !running ||
            finished
        ) {
            return;
        }


        paused =
            !paused;


        if (paused) {

            $("pauseOverlay")
                .classList.remove(
                    "hidden"
                );

        } else {

            $("pauseOverlay")
                .classList.add(
                    "hidden"
                );

            lastTime =
                performance.now();

        }

    }


    $("pauseBtn").addEventListener(
        "click",
        togglePause
    );


    $("resumeBtn").addEventListener(
        "click",
        togglePause
    );


    $("quitBtn").addEventListener(
        "click",
        () => {

            running = false;

            cancelAnimationFrame(
                rafId
            );

            $("pauseOverlay")
                .classList.add(
                    "hidden"
                );

            showScreen(
                "menuScreen"
            );

        }
    );


    /* =====================================================
       FINISH
    ====================================================== */

    function finishGame() {

        if (finished) {
            return;
        }


        finished = true;

        running = false;


        cancelAnimationFrame(
            rafId
        );


        const won =
            score > enemyScore;


        const xpGain =
            won
                ? 150 + score * 5
                : 50 + score * 2;


        const creditGain =
            won
                ? 150
                : 50;


        save.stats.games += 1;


        if (won) {

            save.stats.wins += 1;

            save.careerStage =
                Math.min(
                    4,
                    Math.max(
                        save.careerStage,
                        save.stats.wins + 1
                    )
                );

        }


        save.xp += xpGain;

        save.credits += creditGain;


        while (
            save.xp >=
            save.level * 500
        ) {

            save.xp -=
                save.level * 500;

            save.level += 1;

        }


        saveGame();


        $("resultTitle").textContent =
            won
                ? "VICTORY"
                : score === enemyScore
                    ? "DRAW"
                    : "DEFEAT";


        $("resultTag").textContent =
            won
                ? "MATCH COMPLETE // WIN"
                : "MATCH COMPLETE";


        $("resultPlayerScore").textContent =
            score;

        $("resultEnemyScore").textContent =
            enemyScore;

        $("resultXp").textContent =
            `+${xpGain}`;

        $("resultCredits").textContent =
            `+${creditGain}`;


        $("resultOverlay")
            .classList.remove(
                "hidden"
            );

    }


    $("resultContinue").addEventListener(
        "click",
        () => {

            $("resultOverlay")
                .classList.add(
                    "hidden"
                );

            showScreen(
                "menuScreen"
            );

        }
    );


    /* =====================================================
       KEYBOARD
    ====================================================== */

    window.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                [
                    " ",
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright"
                ].includes(key)
            ) {

                event.preventDefault();

            }


            keys[key] = true;


            if (
                key === "p" ||
                key === "escape"
            ) {

                togglePause();

                return;

            }


            if (
                key === "f" &&
                !event.repeat
            ) {

                activateSpecial();

                return;

            }


            if (
                key === "e" &&
                keys["shift"] &&
                !event.repeat
            ) {

                attemptDunk();

                return;

            }


            if (
                key === " " &&
                !event.repeat
            ) {

                beginCharge();

            }

        }
    );


    window.addEventListener(
        "keyup",
        event => {

            const key =
                event.key.toLowerCase();


            keys[key] = false;


            if (
                key === " "
            ) {

                releaseShot();

            }

        }
    );


    /* =====================================================
       VISIBILITY
    ====================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                running &&
                !paused
            ) {

                togglePause();

            }

        }
    );


    /* =====================================================
       INIT
    ====================================================== */

    updateHome();

    renderPlayers();

    renderShop();

    renderCareer();

    renderStats();


})();