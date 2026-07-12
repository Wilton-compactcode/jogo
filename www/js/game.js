// Configurações Globais do Motor de Combate
window.CombatConfig = {
    gravity: 1200,
    playerSpeed: 300,
    jumpForce: 550,
    kaelenRange: 65,
    valeriDamage: 25,
    showBoxes: true,
    cpuBehavior: 'blocker',
    gameMode: 'training', // 'training' (laboratório) ou 'versus' (tela cheia)
    selectedCharacter: 'kaelen' // 'kaelen' ou 'valeri'
};

// CENA 1: BOOT & CARREGAMENTO DE SPRITES
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }
    preload() {
        // Gerar as spritesheets de pixel art procedimentais na memória
        window.SpriteGenerator.createSpritesheet(this, 'kaelen_sprites', 'kaelen');
        window.SpriteGenerator.createSpritesheet(this, 'valeri_sprites', 'valeri');
        window.SpriteGenerator.createProjectileSpritesheet(this);
    }
    create() {
        // Criar animações globais uma única vez no boot
        this.createAnims('kaelen');
        this.createAnims('valeri');

        this.anims.create({
            key: 'projectile_anim',
            frames: this.anims.generateFrameNumbers('projectile_sprites', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Ir direto para o Menu Principal
        this.scene.start('MainMenuScene');
    }

    createAnims(charType) {
        this.anims.create({
            key: `${charType}_idle`,
            frames: this.anims.generateFrameNumbers(`${charType}_sprites`, { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: `${charType}_walk`,
            frames: this.anims.generateFrameNumbers(`${charType}_sprites`, { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: `${charType}_light_attack`,
            frames: [{ key: `${charType}_sprites`, frame: 8 }],
            frameRate: 1
        });
        this.anims.create({
            key: `${charType}_heavy_attack`,
            frames: [{ key: `${charType}_sprites`, frame: 9 }],
            frameRate: 1
        });
        this.anims.create({
            key: `${charType}_block`,
            frames: [{ key: `${charType}_sprites`, frame: 10 }],
            frameRate: 1
        });
        this.anims.create({
            key: `${charType}_dodge`,
            frames: [{ key: `${charType}_sprites`, frame: 11 }],
            frameRate: 1
        });
        this.anims.create({
            key: `${charType}_hitstun`,
            frames: [{ key: `${charType}_sprites`, frame: 12 }],
            frameRate: 1
        });
        this.anims.create({
            key: `${charType}_special`,
            frames: [{ key: `${charType}_sprites`, frame: 13 }],
            frameRate: 1
        });
    }
}

// CENA 2: MENU PRINCIPAL (ESTILO CYBERPUNK)
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }
    create() {
        // Garantir que a interface do laboratório esteja escondida inicialmente
        document.getElementById('control-panel').style.display = 'none';
        document.getElementById('combat-log-section').style.display = 'none';
        document.getElementById('main-layout').style.gap = '0px';

        const width = this.scale.width;
        const height = this.scale.height;

        // Fundo com linhas de grade suaves
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x1f2430, 0.5);
        for (let x = 0; x < width; x += 32) grid.lineBetween(x, 0, x, height);
        for (let y = 0; y < height; y += 32) grid.lineBetween(0, y, width, y);

        // Título Neon
        const title = this.add.text(width / 2, height / 2 - 60, 'SLASH & PIXEL', {
            fontFamily: 'Orbitron',
            fontSize: '38px',
            fontWeight: '900',
            fill: '#ffffff',
            letterSpacing: 4
        }).setOrigin(0.5);
        
        // Efeito de brilho neon no título
        title.setShadow(0, 0, '#00f0ff', 12, true, true);

        // Subtítulo
        this.add.text(width / 2, height / 2 - 20, '2D WEAPON FIGHTING ENGINE', {
            fontFamily: 'Orbitron',
            fontSize: '10px',
            fill: '#00f0ff',
            letterSpacing: 6
        }).setOrigin(0.5);

        // Botões do Menu
        const createMenuButton = (y, text, callback) => {
            const btn = this.add.text(width / 2, y, text, {
                fontFamily: 'Orbitron',
                fontSize: '14px',
                fontWeight: '700',
                fill: '#8c9ba5',
                letterSpacing: 2
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => {
                btn.setFill('#00f0ff');
                btn.setShadow(0, 0, 'rgba(0, 240, 255, 0.6)', 6, true, true);
                btn.setScale(1.1);
                window.GameAudio.playSlash();
            });

            btn.on('pointerout', () => {
                btn.setFill('#8c9ba5');
                btn.setShadow(0, 0, null, 0);
                btn.setScale(1.0);
            });

            btn.on('pointerdown', () => {
                window.GameAudio.playParry();
                callback();
            });
        };

        createMenuButton(height / 2 + 30, 'MODO VERSUS (TELA CHEIA)', () => {
            window.CombatConfig.gameMode = 'versus';
            this.scene.start('CharSelectScene');
        });

        createMenuButton(height / 2 + 75, 'LABORATÓRIO DE FISICA', () => {
            window.CombatConfig.gameMode = 'training';
            window.CombatConfig.selectedCharacter = 'kaelen'; // Padrão
            this.scene.start('GameScene');
        });

        // Rodapé créditos
        this.add.text(width / 2, height - 20, 'GEMINI CODING ASSISTANT // DEEPMIND TEAM 2026', {
            fontFamily: 'monospace',
            fontSize: '8px',
            fill: '#546570'
        }).setOrigin(0.5);
    }
}

// CENA 3: SELEÇÃO DE PERSONAGENS
class CharSelectScene extends Phaser.Scene {
    constructor() {
        super('CharSelectScene');
    }
    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.text(width / 2, 40, 'SELECIONE SEU GUERREIRO', {
            fontFamily: 'Orbitron',
            fontSize: '18px',
            fill: '#ffffff',
            letterSpacing: 3
        }).setOrigin(0.5).setShadow(0, 0, '#00f0ff', 6, true, true);

        // Cartão 1: KAELEN
        const cardKaelen = this.add.rectangle(160, height / 2 + 10, 160, 210, 0x161922).setStrokeStyle(2, 0x2a3142);
        const sprKaelen = this.add.sprite(160, height / 2 - 30, 'kaelen_sprites', 0).setScale(1.2);
        sprKaelen.play('kaelen_idle');
        
        this.add.text(160, height / 2 + 25, 'KAELEN', {
            fontFamily: 'Orbitron',
            fontSize: '13px',
            fill: '#00f0ff',
            fontWeight: '700'
        }).setOrigin(0.5);

        this.add.text(160, height / 2 + 50, 'AGILIDADE: 9\nFORÇA: 5\nALCANCE: 7', {
            fontFamily: 'monospace',
            fontSize: '9px',
            fill: '#8c9ba5',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Cartão 2: VALERI
        const cardValeri = this.add.rectangle(340, height / 2 + 10, 160, 210, 0x161922).setStrokeStyle(2, 0x2a3142);
        const sprValeri = this.add.sprite(340, height / 2 - 30, 'valeri_sprites', 0).setScale(1.2);
        sprValeri.play('valeri_idle');

        this.add.text(340, height / 2 + 25, 'VALERI', {
            fontFamily: 'Orbitron',
            fontSize: '13px',
            fill: '#ff0055',
            fontWeight: '700'
        }).setOrigin(0.5);

        this.add.text(340, height / 2 + 50, 'AGILIDADE: 3\nFORÇA: 9\nALCANCE: 8', {
            fontFamily: 'monospace',
            fontSize: '9px',
            fill: '#8c9ba5',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Interação de Seleção
        cardKaelen.setInteractive({ useHandCursor: true });
        cardKaelen.on('pointerover', () => {
            cardKaelen.setStrokeStyle(3, 0x00f0ff);
            window.GameAudio.playSlash();
        });
        cardKaelen.on('pointerout', () => cardKaelen.setStrokeStyle(2, 0x2a3142));
        cardKaelen.on('pointerdown', () => {
            window.GameAudio.playHit();
            window.CombatConfig.selectedCharacter = 'kaelen';
            this.scene.start('GameScene');
        });

        cardValeri.setInteractive({ useHandCursor: true });
        cardValeri.on('pointerover', () => {
            cardValeri.setStrokeStyle(3, 0xff0055);
            window.GameAudio.playSlash();
        });
        cardValeri.on('pointerout', () => cardValeri.setStrokeStyle(2, 0x2a3142));
        cardValeri.on('pointerdown', () => {
            window.GameAudio.playHit();
            window.CombatConfig.selectedCharacter = 'valeri';
            this.scene.start('GameScene');
        });

        // Cartão 3: RIN (BLOQUEADO)
        const cardRin = this.add.rectangle(510, height / 2 + 10, 110, 210, 0x0d0e12).setStrokeStyle(1, 0x2a3142).setAlpha(0.5);
        this.add.text(510, height / 2 - 20, '🔒', { fontSize: '24px' }).setOrigin(0.5);
        this.add.text(510, height / 2 + 15, 'RIN\n[BLOQUEADO]', {
            fontFamily: 'Orbitron',
            fontSize: '10px',
            fill: '#546570',
            align: 'center'
        }).setOrigin(0.5);

        // Botão voltar
        const backBtn = this.add.text(width / 2, height - 30, 'VOLTAR AO MENU', {
            fontFamily: 'Orbitron',
            fontSize: '11px',
            fill: '#8c9ba5',
            letterSpacing: 1
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setFill('#ffdd00'));
        backBtn.on('pointerout', () => backBtn.setFill('#8c9ba5'));
        backBtn.on('pointerdown', () => {
            window.GameAudio.playBlock();
            this.scene.start('MainMenuScene');
        });
    }
}

// CENA 4: GAMEPLAY DE COMBATE
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const scene = this;
        activeProjectiles = this.physics.add.group();

        const isVersus = window.CombatConfig.gameMode === 'versus';
        
        // Ajustar Layout do Documento HTML
        if (isVersus) {
            // Esconde tudo exceto o canvas para imersão total
            document.getElementById('control-panel').style.display = 'none';
            document.getElementById('combat-log-section').style.display = 'none';
            document.getElementById('main-layout').style.gap = '0px';
            document.querySelector('header').style.display = 'none';
            document.getElementById('app-wrapper').style.padding = '0';
            document.getElementById('app-wrapper').style.gap = '0';
            const tooltip = document.querySelector('.help-tooltip');
            if (tooltip) tooltip.style.display = 'none';
            // CPU sempre é agressivo no versus
            window.CombatConfig.cpuBehavior = 'aggressor';
        } else {
            // Mostra o laboratório completo
            document.getElementById('control-panel').style.display = 'flex';
            document.getElementById('combat-log-section').style.display = 'flex';
            document.getElementById('main-layout').style.gap = '12px';
        }

        // Redimensionar tela para caber (após layout processar)
        const container = document.getElementById('game-container');
        if (container) {
            scene.scale.resize(container.clientWidth, container.clientHeight);
        }

        // Obter dimensões reais do canvas após o resize
        const W = this.scale.width;
        const H = this.scale.height;
        const GROUND_Y = Math.round(H * 0.89); // 89% da altura = linha do chão

        // Atualizar limites do mundo de física para o novo tamanho do canvas
        this.physics.world.setBounds(0, 0, W, H + 200);

        // Chão de Arena Estilizado (física) — responsivo ao tamanho real
        platforms = this.physics.add.staticGroup();
        const ground = this.add.rectangle(W / 2, GROUND_Y + 20, W * 3, 40, 0x000000, 0);
        this.physics.add.existing(ground, true);
        platforms.add(ground);

        // Desenhar cenário cyberpunk elegante (usa GROUND_Y)
        drawScenery(this, W, H, GROUND_Y);

        // Instanciar Jogadores baseado na escolha
        const p1Char = window.CombatConfig.selectedCharacter;
        const p2Char = p1Char === 'kaelen' ? 'valeri' : 'kaelen';

        player = new Fighter(this, W * 0.27, GROUND_Y - 40, true, p1Char);
        cpu = new Fighter(this, W * 0.73, GROUND_Y - 40, false, p2Char);

        // Colisores
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(cpu, platforms);
        this.physics.add.collider(player, cpu);

        // Contador de Combos
        p1ComboText = this.add.text(50, 70, '', {
            fontFamily: 'Orbitron',
            fontSize: '22px',
            fontWeight: '900',
            fill: '#00f0ff',
            stroke: '#002b3d',
            strokeThickness: 3
        }).setAlpha(0);

        p2ComboText = this.add.text(420, 70, '', {
            fontFamily: 'Orbitron',
            fontSize: '22px',
            fontWeight: '900',
            fill: '#ff0055',
            stroke: '#3a0013',
            strokeThickness: 3
        }).setAlpha(0);

        // Partículas
        particles = this.add.graphics();
        debugGraphics = this.add.graphics();

        // Registrar escutas de UI caso o painel esteja visível (modo treino)
        setupUIListeners(this);

        // Se for versus, botão de voltar ao menu no topo esquerdo do canvas
        if (isVersus) {
            const menuBtn = this.add.text(30, 20, '◀ MENU', {
                fontFamily: 'Orbitron',
                fontSize: '11px',
                fill: '#8c9ba5',
                fontWeight: '700'
            }).setInteractive({ useHandCursor: true });
            
            menuBtn.on('pointerover', () => menuBtn.setFill('#00f0ff'));
            menuBtn.on('pointerout', () => menuBtn.setFill('#8c9ba5'));
            menuBtn.on('pointerdown', () => {
                window.GameAudio.playBlock();
                this.scene.start('MainMenuScene');
            });
        }

        addLog(`Partida Iniciada: ${p1Char.toUpperCase()} vs ${p2Char.toUpperCase()} (${window.CombatConfig.gameMode.toUpperCase()})`, 'system');
    }

    update(time, delta) {

        // Atualizar Lutadores
        player.updateFighter(time, delta);
        cpu.updateFighter(time, delta);

        // Executar IA
        updateCPUBehavior(time, delta);

        // Colisões
        checkCombatCollisions(this);

        // Debug boxes
        drawDebugBoxes();
    }
}

// Configuração final do Phaser usando Cenas Modulares
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game-container',
    backgroundColor: '#0c0d12',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: window.CombatConfig.gravity },
            debug: false
        }
    },
    scene: [BootScene, MainMenuScene, CharSelectScene, GameScene]
};

let game;

function startGame() {
    if (!game) {
        game = new Phaser.Game(config);
        console.log("[SlashAndPixel] Motor do jogo inicializado com sucesso.");
    }
}

// Inicialização híbrida (Cordova / Navegador)
if (window.cordova) {
    document.addEventListener('deviceready', startGame, false);
} else {
    window.addEventListener('load', startGame, false);
}

// Variáveis de suporte física
let player;
let cpu;
let platforms;
let debugGraphics;
let particles;
let backgroundGrid;
let p1ComboText;
let p2ComboText;
let activeProjectiles;

// Relatório de console
function addLog(text, type = 'system') {
    const logWindow = document.getElementById('log-window');
    if (!logWindow) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const now = new Date();
    const timeStr = `[${now.toLocaleTimeString()}]`;
    entry.innerText = `${timeStr} ${text}`;
    
    logWindow.appendChild(entry);
    logWindow.scrollTop = logWindow.scrollHeight;
    
    while (logWindow.childNodes.length > 50) {
        logWindow.removeChild(logWindow.firstChild);
    }
}

// Escuta Sliders
function setupUIListeners(scene) {
    const ids = [
        { slider: 'gravity-slider', val: 'gravity-val', prop: 'gravity', suffix: '' },
        { slider: 'speed-slider', val: 'speed-val', prop: 'playerSpeed', suffix: '' },
        { slider: 'jump-slider', val: 'jump-val', prop: 'jumpForce', suffix: '' },
        { slider: 'kaelen-range-slider', val: 'kaelen-range-val', prop: 'kaelenRange', suffix: 'px' },
        { slider: 'valeri-damage-slider', val: 'valeri-damage-val', prop: 'valeriDamage', suffix: '' }
    ];

    ids.forEach(item => {
        const sliderEl = document.getElementById(item.slider);
        const valEl = document.getElementById(item.val);
        
        if (sliderEl && valEl) {
            // Remove listeners antigos para evitar chamadas duplas
            const newSlider = sliderEl.cloneNode(true);
            sliderEl.parentNode.replaceChild(newSlider, sliderEl);

            newSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                valEl.innerText = `${val}${item.suffix}`;
                window.CombatConfig[item.prop] = val;
                
                if (item.prop === 'gravity') {
                    scene.physics.world.gravity.y = val;
                }
            });
        }
    });

    const toggleBoxes = document.getElementById('toggle-boxes');
    if (toggleBoxes) {
        const newToggle = toggleBoxes.cloneNode(true);
        toggleBoxes.parentNode.replaceChild(newToggle, toggleBoxes);
        newToggle.addEventListener('change', (e) => {
            window.CombatConfig.showBoxes = e.target.checked;
        });
    }

    const cpuSelect = document.getElementById('cpu-behavior');
    if (cpuSelect) {
        const newSelect = cpuSelect.cloneNode(true);
        cpuSelect.parentNode.replaceChild(newSelect, cpuSelect);
        newSelect.addEventListener('change', (e) => {
            window.CombatConfig.cpuBehavior = e.target.value;
            addLog(`IA do CPU alterada para: ${newSelect.options[newSelect.selectedIndex].text.toUpperCase()}`, 'system');
        });
    }

    const resetBtn = document.getElementById('reset-button');
    if (resetBtn) {
        const newBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newBtn, resetBtn);
        newBtn.addEventListener('click', () => {
            document.getElementById('gravity-slider').value = 1200;
            document.getElementById('gravity-val').innerText = '1200';
            window.CombatConfig.gravity = 1200;
            scene.physics.world.gravity.y = 1200;

            document.getElementById('speed-slider').value = 300;
            document.getElementById('speed-val').innerText = '300';
            window.CombatConfig.playerSpeed = 300;

            document.getElementById('jump-slider').value = 550;
            document.getElementById('jump-val').innerText = '550';
            window.CombatConfig.jumpForce = 550;

            document.getElementById('kaelen-range-slider').value = 65;
            document.getElementById('kaelen-range-val').innerText = '65px';
            window.CombatConfig.kaelenRange = 65;

            document.getElementById('valeri-damage-slider').value = 25;
            document.getElementById('valeri-damage-val').innerText = '25';
            window.CombatConfig.valeriDamage = 25;

            document.getElementById('toggle-boxes').checked = true;
            window.CombatConfig.showBoxes = true;

            document.getElementById('cpu-behavior').value = 'blocker';
            window.CombatConfig.cpuBehavior = 'blocker';

            addLog('Configurações redefinidas.', 'system');
        });
    }
}

// Projétil
class Projectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction, owner) {
        super(scene, x, y, 'projectile_sprites');
        this.scene = scene;
        this.direction = direction;
        this.owner = owner;
        this.damage = 14;
        this.hasHit = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setVelocityX(direction * 380);
        this.body.setSize(24, 24);
        this.setFlipX(direction === -1);
        this.play('projectile_anim');

        scene.time.delayedCall(1500, () => {
            this.destroy();
        });
    }
}

// Desenhar Cenário Cyberpunk Profissional
function drawScenery(scene, W, H, GROUND_Y) {
    // Usar valores padrão se não forem passados (modo lab sem resize)
    if (!W) W = scene.scale.width;
    if (!H) H = scene.scale.height;
    if (!GROUND_Y) GROUND_Y = Math.round(H * 0.89);

    const skyH = GROUND_Y; // O céu cobre do topo até o chão

    // 1. Céu com Degradê
    const skyGraphics = scene.add.graphics().setDepth(-10);
    const step = Math.max(4, Math.round(skyH / 40));
    for (let y = 0; y < skyH; y += step) {
        const percent = y / skyH;
        const r = Math.round(8 + (21 - 8) * percent);
        const g = Math.round(10 + (17 - 10) * percent);
        const b = Math.round(15 + (36 - 15) * percent);
        const color = (r << 16) + (g << 8) + b;
        skyGraphics.fillStyle(color, 1);
        skyGraphics.fillRect(0, y, W, step);
    }

    // 2. Estrelas Cintilantes Aleatórias
    const starCount = Math.round(W / 16);
    for (let i = 0; i < starCount; i++) {
        const starX = Phaser.Math.FloatBetween(0, W);
        const starY = Phaser.Math.FloatBetween(0, skyH * 0.65);
        const starRadius = Phaser.Math.FloatBetween(0.6, 1.5);
        const starAlpha = Phaser.Math.FloatBetween(0.3, 0.9);
        skyGraphics.fillStyle(0x00f0ff, starAlpha);
        skyGraphics.fillCircle(starX, starY, starRadius);
    }

    // 3. Lua Gigante Neon — posicionada no canto superior direito
    const moonX = W * 0.82;
    const moonY = skyH * 0.22;
    const moonR = Math.round(W * 0.044);
    skyGraphics.fillStyle(0xfff5cc, 0.08);
    skyGraphics.fillCircle(moonX, moonY, moonR * 1.85);
    skyGraphics.fillStyle(0xfff5cc, 0.16);
    skyGraphics.fillCircle(moonX, moonY, moonR * 1.43);
    skyGraphics.fillStyle(0xffe899, 0.95);
    skyGraphics.fillCircle(moonX, moonY, moonR);

    // 4. Silhuetas de Arranha-céus (Skyline) — proporcionais à largura e GROUND_Y
    const bScale = W / 640; // fator de escala baseado na largura original
    const buildings = [
        { xr: -0.15, wr: 0.14, hr: 0.44 },
        { xr: 0.015, wr: 0.12, hr: 0.56 },
        { xr: 0.156, wr: 0.094, hr: 0.78 },
        { xr: 0.273, wr: 0.133, hr: 0.50 },
        { xr: 0.43, wr: 0.109, hr: 0.69 },
        { xr: 0.562, wr: 0.125, hr: 0.53 },
        { xr: 0.703, wr: 0.086, hr: 0.88 },
        { xr: 0.812, wr: 0.141, hr: 0.59 },
        { xr: 0.977, wr: 0.109, hr: 0.41 },
        { xr: 1.11, wr: 0.133, hr: 0.66 }
    ];
    buildings.forEach((b, i) => {
        const bx = Math.round(b.xr * W);
        const bw = Math.round(b.wr * W);
        const bh = Math.round(b.hr * GROUND_Y * 0.75);
        // Bloco do prédio
        skyGraphics.fillStyle(0x0a0c15, 1);
        skyGraphics.fillRect(bx, GROUND_Y - bh, bw, bh);
        // Linha de neon no topo
        const neonColor = i % 2 === 0 ? 0x00f0ff : 0xff0055;
        skyGraphics.lineStyle(1.5, neonColor, 0.85);
        skyGraphics.strokeLineShape(new Phaser.Geom.Line(bx, GROUND_Y - bh, bx + bw, GROUND_Y - bh));
        // Janelas iluminadas
        skyGraphics.fillStyle(0xffdd00, 0.40);
        for (let wx = bx + 6; wx < bx + bw - 6; wx += 10) {
            for (let wy = GROUND_Y - bh + 12; wy < GROUND_Y - 10; wy += 16) {
                if (Math.random() < 0.25) skyGraphics.fillRect(wx, wy, 2, 3);
            }
        }
    });

    // 5. Ponte Tecnológica / Plataforma de Combate
    const floorGraphics = scene.add.graphics().setDepth(-5);
    const floorThick = Math.max(20, Math.round(H * 0.06));

    // Vigas estruturais abaixo da ponte
    floorGraphics.lineStyle(2, 0x141824, 1);
    for (let vx = 0; vx < W; vx += Math.round(W / 8)) {
        floorGraphics.lineBetween(vx, GROUND_Y, vx + 40, GROUND_Y + floorThick);
        floorGraphics.lineBetween(vx, GROUND_Y, vx - 40, GROUND_Y + floorThick);
    }

    // Corpo metálico escuro da plataforma
    floorGraphics.fillStyle(0x161925, 1);
    floorGraphics.fillRect(0, GROUND_Y, W, floorThick);

    // Placa inferior de acabamento
    floorGraphics.fillStyle(0x0e1017, 1);
    floorGraphics.fillRect(0, GROUND_Y + floorThick - 4, W, 4);

    // Faixa Neon Ciano Brilhante (onde os personagens pisam)
    floorGraphics.lineStyle(3, 0x00f0ff, 1);
    floorGraphics.strokeLineShape(new Phaser.Geom.Line(0, GROUND_Y, W, GROUND_Y));
    // Brilho
    floorGraphics.lineStyle(1, 0x00f0ff, 0.4);
    floorGraphics.strokeLineShape(new Phaser.Geom.Line(0, GROUND_Y - 1, W, GROUND_Y - 1));
    floorGraphics.strokeLineShape(new Phaser.Geom.Line(0, GROUND_Y + 1, W, GROUND_Y + 1));

    // Listras de perigo amarelo/preto nas extremidades
    const stripeW = Math.round(W * 0.12);
    const stripeH = Math.round(floorThick * 0.35);
    const drawHazardStripes = (startX, dir) => {
        for (let offset = 0; offset < stripeW; offset += 10) {
            floorGraphics.fillStyle(0xffdd00, 1);
            floorGraphics.fillRect(startX + offset * dir, GROUND_Y, 5, stripeH);
        }
    };
    drawHazardStripes(0, 1);
    drawHazardStripes(W, -1);
}

// Registrar Combos
function registerComboHit(targetFighter, damage) {
    const attacker = (targetFighter === player) ? cpu : player;
    const now = game.loop.time;

    if (now - targetFighter.lastHitTime < 1300) {
        targetFighter.comboCount++;
        targetFighter.comboDamage += damage;
    } else {
        targetFighter.comboCount = 1;
        targetFighter.comboDamage = damage;
    }
    targetFighter.lastHitTime = now;

    const comboText = (attacker === player) ? p1ComboText : p2ComboText;
    comboText.setText(`${targetFighter.comboCount} HITS\n${Math.round(targetFighter.comboDamage)} DMG`);
    comboText.setAlpha(1.0);
    comboText.setScale(1.2);
    
    attacker.scene.tweens.add({
        targets: comboText,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 100
    });

    if (targetFighter.comboTimer) targetFighter.comboTimer.remove();
    targetFighter.comboTimer = attacker.scene.time.delayedCall(1300, () => {
        attacker.scene.tweens.add({
            targets: comboText,
            alpha: 0,
            duration: 200
        });
    });
}

// Freeze screen
function triggerUltimateFreeze(scene, caster, callback) {
    const originalTimeScale = scene.physics.world.timeScale;
    scene.physics.world.timeScale = 15;
    
    const flashOverlay = scene.add.rectangle(320, 180, 640, 360, 0xffffff).setDepth(9999).setAlpha(0.85);
    scene.cameras.main.shake(150, 0.02);

    scene.tweens.add({
        targets: flashOverlay,
        alpha: 0,
        duration: 400,
        onComplete: () => {
            flashOverlay.destroy();
            scene.physics.world.timeScale = originalTimeScale;
            callback();
        }
    });
}

// --- CLASSE DOS PERSONAGENS ---
class Fighter extends Phaser.GameObjects.Container {
    constructor(scene, x, y, isPlayer, charType) {
        super(scene, x, y);
        this.scene = scene;
        this.isPlayer = isPlayer;
        this.charType = charType;

        this.maxHp = 100;
        this.hp = 100;
        this.maxPostura = 100;
        this.postura = 100;
        this.tension = 0;
        
        this.facing = isPlayer ? 1 : -1;

        this.currentState = 'IDLE';
        this.stateTimer = 0;
        
        this.dodgeCooldown = 0;
        this.specialCooldown = 0;
        this.posturaRegenTimer = 0;
        this.doubleJumpAvailable = true;
        this.superArmorActive = false;
        
        this.comboCount = 0;
        this.comboDamage = 0;
        this.lastHitTime = 0;
        this.comboTimer = null;

        this.attackHitbox = null; 
        this.hasHitThisAttack = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setCollideWorldBounds(true);
        this.body.setDragX(800);
        
        let height = 70;
        let width = 32;
        if (this.charType === 'kaelen') {
            width = 32;
            height = 70;
        } else {
            width = 44;
            height = 82;
        }

        this.normalHeight = height;
        this.body.setSize(width, height);
        this.body.setOffset(-width / 2, -height);

        // Sprite posicionado nos pés (0,0) com ponto de pivot na base (0.5, 1.0)
        this.sprite = scene.add.sprite(0, 0, this.charType + '_sprites', 0);
        this.sprite.setOrigin(0.5, 1.0);
        this.add(this.sprite);

        this.visualGraphics = scene.add.graphics();
        this.add(this.visualGraphics);

        this.infoText = scene.add.text(0, -height - 15, '', {
            fontFamily: 'Orbitron',
            fontSize: '9px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        this.add(this.infoText);

        this.redrawCharacter();
    }

    redrawCharacter() {
        this.visualGraphics.clear();
        
        const isKaelen = this.charType === 'kaelen';
        const width = isKaelen ? 32 : 44;
        const height = isKaelen ? 70 : 82;

        this.sprite.setFlipX(this.facing === -1);

        let stateKey = this.currentState.toLowerCase();
        if (stateKey === 'parry_standby') stateKey = 'block';
        if (stateKey === 'stunned') stateKey = 'hitstun';
        if (stateKey === 'dash') stateKey = 'walk';
        if (stateKey === 'jump') stateKey = 'idle';
        if (stateKey === 'special_1' || stateKey === 'special_2' || stateKey === 'ultimate') stateKey = 'special';

        const animKey = `${this.charType}_${stateKey}`;
        if (this.scene.anims.exists(animKey)) {
            this.sprite.play(animKey, true);
        }

        if (this.currentState === 'DODGE') {
            this.sprite.setAlpha(0.4);
        } else if (this.currentState === 'HITSTUN') {
            this.sprite.setAlpha(0.8);
        } else {
            this.sprite.setAlpha(1.0);
        }
        
        if (this.currentState === 'BLOCK' || this.currentState === 'PARRY_STANDBY') {
            const shieldColor = this.currentState === 'PARRY_STANDBY' ? 0x00ff88 : 0xffdd00;
            this.visualGraphics.lineStyle(3, shieldColor, 1);
            this.visualGraphics.strokeCircle(this.facing * 12, -height/2, 22);
            if (this.currentState === 'PARRY_STANDBY') {
                this.visualGraphics.lineStyle(1, 0x00ff88, 0.4);
                this.visualGraphics.strokeCircle(this.facing * 12, -height/2, 28);
            }
        }

        if (this.superArmorActive) {
            this.visualGraphics.lineStyle(2.5, 0xffdd00, 0.85);
            this.visualGraphics.strokeRoundedRect(-width/2 - 6, -height - 4, width + 12, height + 8, 8);
        }
    }

    updateFighter(time, delta) {
        if (this.dodgeCooldown > 0) this.dodgeCooldown -= delta;
        if (this.specialCooldown > 0) this.specialCooldown -= delta;

        if (this.stateTimer > 0) {
            this.stateTimer -= delta;
            if (this.stateTimer <= 0) {
                this.onStateTimerComplete();
            }
        }

        if (this.currentState !== 'BLOCK' && this.currentState !== 'STUNNED') {
            this.posturaRegenTimer += delta;
            if (this.posturaRegenTimer >= 100) {
                this.postura = Math.min(this.maxPostura, this.postura + 2);
                this.posturaRegenTimer = 0;
            }
        }

        const enemy = this.isPlayer ? cpu : player;
        if (['IDLE', 'WALK', 'JUMP'].includes(this.currentState)) {
            const oldFacing = this.facing;
            this.facing = (enemy.x > this.x) ? 1 : -1;
            if (oldFacing !== this.facing) {
                this.redrawCharacter();
            }
        }

        this.updateHUDText();

        if (this.isPlayer) {
            this.handlePlayerInput();
        }
    }

    updateHUDText() {
        let statusEmoji = '';
        if (this.currentState === 'BLOCK') statusEmoji = '🛡️ ';
        if (this.currentState === 'PARRY_STANDBY') statusEmoji = '⚡ ';
        if (this.currentState === 'HITSTUN') statusEmoji = '💥 ';
        if (this.currentState === 'STUNNED') statusEmoji = '🥴 GUARD BREAK ';
        if (this.currentState === 'ULTIMATE') statusEmoji = '🔥 SUPREMO ';
        
        this.infoText.setText(
            `${this.charType.toUpperCase()}\n` +
            `HP: ${Math.round(this.hp)} | Guard: ${Math.round(this.postura)}% | ESP: ${Math.round(this.tension)}%\n` +
            `${statusEmoji}[${this.currentState}]`
        );
        this.infoText.setColor(this.isPlayer ? '#00f0ff' : '#ff0055');
    }

    handlePlayerInput() {
        const input = window.GameInput;
        const onGround = this.body.blocked.down;

        const isAttacking = ['LIGHT_ATTACK', 'HEAVY_ATTACK'].includes(this.currentState);
        const isCancelable = isAttacking && this.stateTimer < 140;

        if (['HITSTUN', 'STUNNED', 'DODGE', 'SPECIAL_1', 'SPECIAL_2', 'ULTIMATE'].includes(this.currentState)) {
            return;
        }

        if (isAttacking && !isCancelable) {
            return;
        }

        if (isCancelable) {
            if (input.dodge || input.specialAttack || (input.ultimateAttack && this.tension >= 100)) {
                this.destroyHitbox();
                this.superArmorActive = false;
                addLog(`[CANCEL] ${this.charType.toUpperCase()} cancelou a recuperação do golpe!`, 'system');
            } else {
                return;
            }
        }

        if (input.ultimateAttack && this.tension >= 100) {
            this.performUltimate();
            input.ultimateAttack = false;
            return;
        }

        if (input.dodge && onGround && this.dodgeCooldown <= 0) {
            this.enterDodgeState();
            input.dodge = false;
            return;
        }

        if (input.specialAttack && this.specialCooldown <= 0) {
            this.performSpecialAttack(onGround);
            input.specialAttack = false;
            return;
        }

        if (input.dashLeftTrigger && onGround) {
            this.enterDashState(-1);
            input.dashLeftTrigger = false;
            return;
        }
        if (input.dashRightTrigger && onGround) {
            this.enterDashState(1);
            input.dashRightTrigger = false;
            return;
        }

        if (input.block && onGround) {
            if (this.currentState !== 'BLOCK' && this.currentState !== 'PARRY_STANDBY') {
                this.enterBlockState();
            }
            this.body.setVelocityX(0);
            return;
        } else if (!input.block && (this.currentState === 'BLOCK' || this.currentState === 'PARRY_STANDBY')) {
            this.currentState = 'IDLE';
            this.redrawCharacter();
        }

        if (input.lightAttack) {
            this.performLightAttack();
            input.lightAttack = false;
            return;
        }
        if (input.heavyAttack) {
            this.performHeavyAttack();
            input.heavyAttack = false;
            return;
        }

        let moveSpeed = window.CombatConfig.playerSpeed;
        if (input.left) {
            this.body.setVelocityX(-moveSpeed);
            if (onGround) this.currentState = 'WALK';
        } else if (input.right) {
            this.body.setVelocityX(moveSpeed);
            if (onGround) this.currentState = 'WALK';
        } else {
            this.body.setVelocityX(0);
            if (onGround && this.currentState !== 'BLOCK') this.currentState = 'IDLE';
        }

        if (input.jump) {
            if (onGround) {
                this.body.setVelocityY(-window.CombatConfig.jumpForce);
                this.currentState = 'JUMP';
                this.doubleJumpAvailable = true;
            } else if (this.doubleJumpAvailable) {
                this.body.setVelocityY(-window.CombatConfig.jumpForce * 0.9);
                this.doubleJumpAvailable = false;
                spawnClashSpark(this.scene, this.x, this.y - 10, 0x00f0ff);
            }
            input.jump = false;
        }
    }

    enterDodgeState() {
        this.currentState = 'DODGE';
        this.stateTimer = 300;
        this.dodgeCooldown = 700;
        this.body.checkCollision.none = true;
        this.body.setVelocityX(this.facing * (window.CombatConfig.playerSpeed + 150));
        
        // Encolher a hurtbox/pushbox física pela metade (evasão sob ataques altos)
        const width = this.charType === 'kaelen' ? 32 : 44;
        this.body.setSize(width, this.normalHeight / 2);
        this.body.setOffset(-width / 2, -this.normalHeight / 2);

        this.redrawCharacter();
        
        window.GameAudio.playSlash(); // esquiva som
        addLog(`[ESQUIVA] ${this.charType.toUpperCase()} esquivou encolhendo sua hurtbox.`, 'system');
    }

    enterDashState(dir) {
        this.currentState = 'DASH';
        this.stateTimer = 180;
        this.facing = dir;
        this.body.setVelocityX(dir * (window.CombatConfig.playerSpeed * 2.2));
        this.redrawCharacter();
        
        window.GameAudio.playSlash();
    }

    enterBlockState() {
        this.currentState = 'BLOCK';
        this.redrawCharacter();
        this.currentState = 'PARRY_STANDBY';
        this.scene.time.delayedCall(120, () => {
            if (this.currentState === 'PARRY_STANDBY') {
                this.currentState = 'BLOCK';
                this.redrawCharacter();
            }
        });
    }

    performLightAttack() {
        this.currentState = 'LIGHT_ATTACK';
        this.hasHitThisAttack = false;
        this.body.setVelocityX(this.facing * 80);
        
        const isKaelen = this.charType === 'kaelen';
        const startup = isKaelen ? 100 : 180;
        const active = isKaelen ? 120 : 150;
        const recovery = isKaelen ? 150 : 200;

        this.stateTimer = startup + active + recovery;
        this.redrawCharacter();
        
        window.GameAudio.playSlash();

        this.scene.time.delayedCall(startup, () => {
            if (this.currentState === 'LIGHT_ATTACK') {
                this.createHitbox(isKaelen ? 'light-kaelen' : 'light-valeri');
            }
        });

        this.scene.time.delayedCall(startup + active, () => {
            this.destroyHitbox();
        });
    }

    performHeavyAttack() {
        this.currentState = 'HEAVY_ATTACK';
        this.hasHitThisAttack = false;
        
        const isKaelen = this.charType === 'kaelen';
        const startup = isKaelen ? 220 : 350;
        const active = isKaelen ? 150 : 200;
        const recovery = isKaelen ? 250 : 350;

        this.stateTimer = startup + active + recovery;
        
        if (isKaelen) {
            this.body.setVelocityX(this.facing * (window.CombatConfig.playerSpeed + 80));
        } else {
            this.superArmorActive = true;
            this.body.setVelocityX(this.facing * 40);
        }
        
        this.redrawCharacter();
        
        window.GameAudio.playSlash();

        this.scene.time.delayedCall(startup, () => {
            if (this.currentState === 'HEAVY_ATTACK') {
                this.superArmorActive = false;
                this.createHitbox(isKaelen ? 'heavy-kaelen' : 'heavy-valeri');
                this.redrawCharacter();
            }
        });

        this.scene.time.delayedCall(startup + active, () => {
            this.destroyHitbox();
        });
    }

    performSpecialAttack(onGround) {
        this.specialCooldown = 1500;
        const isKaelen = this.charType === 'kaelen';
        
        window.GameAudio.playUltimate(); // Efeito de início de especial

        if (isKaelen) {
            if (onGround) {
                this.currentState = 'SPECIAL_1';
                this.stateTimer = 600;
                this.body.setVelocityX(this.facing * 30);
                this.redrawCharacter();
                addLog(`[ESPECIAL] Kaelen iniciou a ESTOCADA RELÂMPAGO!`, 'p1-hit');

                let count = 0;
                const timer = this.scene.time.addEvent({
                    delay: 100,
                    repeat: 3,
                    callback: () => {
                        if (this.currentState === 'SPECIAL_1') {
                            this.hasHitThisAttack = false;
                            this.createHitbox('special-kaelen-lightning');
                            window.GameAudio.playSlash();
                            this.scene.time.delayedCall(60, () => this.destroyHitbox());
                            spawnClashSpark(this.scene, this.x + this.facing * 45, this.y - 50, 0x00f0ff);
                        }
                    }
                });
            } else {
                this.currentState = 'SPECIAL_2';
                this.stateTimer = 400;
                this.hasHitThisAttack = false;
                this.body.setVelocityX(this.facing * 500);
                this.body.setVelocityY(-50);
                this.redrawCharacter();
                addLog(`[ESPECIAL] Kaelen executa PASSO DE ESGRIMA aéreo!`, 'p1-hit');

                this.scene.time.delayedCall(150, () => {
                    if (this.currentState === 'SPECIAL_2') {
                        this.createHitbox('special-kaelen-crush');
                    }
                });
                this.scene.time.delayedCall(300, () => {
                    this.destroyHitbox();
                });
            }
        } else {
            if (onGround) {
                this.currentState = 'SPECIAL_1';
                this.stateTimer = 700;
                this.body.setVelocityX(0);
                this.redrawCharacter();
                addLog(`[ESPECIAL] Valeri executa CORTE SÍSMICO no solo!`, 'p2-hit');

                this.scene.time.delayedCall(300, () => {
                    if (this.currentState === 'SPECIAL_1') {
                        const proj = new Projectile(this.scene, this.x + this.facing * 30, this.y - 26, this.facing, this);
                        activeProjectiles.add(proj);
                        spawnClashSpark(this.scene, this.x + this.facing * 30, this.y - 21, 0xff5500);
                        this.scene.cameras.main.shake(120, 0.008);
                    }
                });
            } else {
                this.currentState = 'SPECIAL_2';
                this.stateTimer = 550;
                this.body.setVelocityX(this.facing * 200);
                this.redrawCharacter();
                addLog(`[ESPECIAL] Valeri executa GIRO DA LÂMINA!`, 'p2-hit');

                let count = 0;
                const spinTimer = this.scene.time.addEvent({
                    delay: 130,
                    repeat: 2,
                    callback: () => {
                        if (this.currentState === 'SPECIAL_2') {
                            this.hasHitThisAttack = false;
                            this.createHitbox('special-valeri-spin');
                            window.GameAudio.playSlash();
                            this.scene.time.delayedCall(90, () => this.destroyHitbox());
                            spawnClashSpark(this.scene, this.x, this.y - 56, 0xff0055);
                        }
                    }
                });
            }
        }
    }

    performUltimate() {
        this.tension = 0;
        this.currentState = 'ULTIMATE';
        this.stateTimer = 1000;
        this.body.setVelocity(0);
        this.redrawCharacter();
        
        const isKaelen = this.charType === 'kaelen';
        const enemy = this.isPlayer ? cpu : player;

        addLog(`[SUPREMO] ${this.charType.toUpperCase()} ATIVA ATAQUE SUPREMO!`, 'clash');
        window.GameAudio.playUltimate();

        triggerUltimateFreeze(this.scene, this, () => {
            if (this.currentState === 'ULTIMATE') {
                this.hasHitThisAttack = false;
                
                if (isKaelen) {
                    addLog(`[SUPREMO] Kaelen executa DANÇA DAS MIL ESTOCADAS!`, 'p1-hit');
                    this.x = enemy.x - enemy.facing * 50;
                    this.facing = enemy.facing;
                    this.redrawCharacter();
                    
                    this.createHitbox('ultimate-kaelen');
                    window.GameAudio.playHit();
                    this.scene.time.delayedCall(300, () => this.destroyHitbox());
                    spawnClashSpark(this.scene, enemy.x, enemy.y - 55, 0x00f0ff);
                } else {
                    addLog(`[SUPREMO] Valeri desfere JULGAMENTO DO SOL NEGRO!`, 'p2-hit');
                    this.body.setVelocityY(-400);
                    
                    this.scene.time.delayedCall(200, () => {
                        this.body.setVelocityY(800);
                    });
                    
                    this.scene.time.delayedCall(400, () => {
                        this.createHitbox('ultimate-valeri');
                        window.GameAudio.playHit();
                        this.scene.time.delayedCall(200, () => this.destroyHitbox());
                        spawnClashSpark(this.scene, this.x + this.facing * 50, this.y - 26, 0xff0055);
                        this.scene.cameras.main.shake(300, 0.03);
                    });
                }
            }
        });
    }

    createHitbox(attackType) {
        let width = 0, height = 0, offsetX = 0, offsetY = 0;
        
        if (attackType === 'light-kaelen') {
            width = window.CombatConfig.kaelenRange;
            height = 12;
            offsetX = this.facing === 1 ? 16 : -16 - width;
            offsetY = -57;
        } else if (attackType === 'heavy-kaelen') {
            width = window.CombatConfig.kaelenRange + 25;
            height = 14;
            offsetX = this.facing === 1 ? 16 : -16 - width;
            offsetY = -57;
        } else if (attackType === 'special-kaelen-lightning') {
            width = 85;
            height = 18;
            offsetX = this.facing === 1 ? 16 : -16 - width;
            offsetY = -60;
        } else if (attackType === 'special-kaelen-crush') {
            width = 90;
            height = 20;
            offsetX = this.facing === 1 ? 16 : -16 - width;
            offsetY = -60;
        } else if (attackType === 'ultimate-kaelen') {
            width = 130;
            height = 50;
            offsetX = this.facing === 1 ? -60 : 60 - width;
            offsetY = -75;
        } else if (attackType === 'light-valeri') {
            width = 65;
            height = 50;
            offsetX = this.facing === 1 ? 22 : -22 - width;
            offsetY = -81;
        } else if (attackType === 'heavy-valeri') {
            width = 85;
            height = 80;
            offsetX = this.facing === 1 ? 22 : -22 - width;
            offsetY = -106;
        } else if (attackType === 'special-valeri-spin') {
            width = 100;
            height = 80;
            offsetX = -50;
            offsetY = -96;
        } else if (attackType === 'ultimate-valeri') {
            width = 140;
            height = 90;
            offsetX = this.facing === 1 ? 22 : -22 - width;
            offsetY = -111;
        }

        this.attackHitbox = {
            width: width,
            height: height,
            x: this.x + offsetX,
            y: this.y + offsetY,
            type: attackType,
            owner: this
        };
    }

    destroyHitbox() {
        this.attackHitbox = null;
    }

    receiveHit(damage, knockbackX, isHeavy, attacker) {
        if (this.currentState === 'DODGE') return;

        if (this.currentState === 'PARRY_STANDBY') {
            this.triggerParrySuccess(attacker);
            return;
        }

        if (this.currentState === 'BLOCK') {
            this.triggerBlockSuccess(damage, knockbackX, attacker);
            return;
        }

        if (this.superArmorActive) {
            this.hp = Math.max(0, this.hp - damage * 0.7);
            this.tension = Math.min(100, this.tension + damage * 0.4);
            addLog(`[SUPER ARMOR] ${this.charType.toUpperCase()} absorveu o golpe. HP: ${Math.round(this.hp)}`, 'block');
            spawnClashSpark(this.scene, this.x, this.y - 55, 0xffdd00);
            window.GameAudio.playBlock();
            return;
        }

        this.hp = Math.max(0, this.hp - damage);
        this.tension = Math.min(100, this.tension + damage * 0.5);
        if (attacker) attacker.tension = Math.min(100, attacker.tension + damage * 0.8);

        this.currentState = 'HITSTUN';
        this.stateTimer = isHeavy ? 450 : 250;
        this.destroyHitbox();

        this.body.setVelocityX(knockbackX);
        this.body.setVelocityY(-150);

        this.redrawCharacter();
        spawnClashSpark(this.scene, this.x, this.y - 55, 0xff0055);
        this.scene.cameras.main.shake(100, isHeavy ? 0.02 : 0.01);
        
        window.GameAudio.playHit();

        addLog(`[GOLPE] ${attacker.charType.toUpperCase()} atingiu ${this.charType.toUpperCase()}! Dano: ${Math.round(damage)}`, this.isPlayer ? 'p2-hit' : 'p1-hit');

        registerComboHit(this, damage);

        if (this.hp <= 0) {
            this.triggerKO();
        }
    }

    triggerParrySuccess(attacker) {
        attacker.currentState = 'STUNNED';
        attacker.stateTimer = 1300;
        attacker.body.setVelocityX(-attacker.facing * 220);
        attacker.destroyHitbox();
        attacker.redrawCharacter();

        attacker.postura = Math.max(0, attacker.postura - 35);
        this.tension = Math.min(100, this.tension + 25);

        spawnClashSpark(this.scene, this.x + this.facing * 15, this.y - 55, 0x00ff88);
        this.scene.cameras.main.shake(120, 0.018);
        
        window.GameAudio.playParry();

        addLog(`[PARRY] ${this.charType.toUpperCase()} defendeu com aparo perfeito!`, 'parry');
        this.redrawCharacter();
    }

    triggerBlockSuccess(damage, knockbackX, attacker) {
        const damageBlocked = damage * 0.12;
        this.hp = Math.max(0, this.hp - damageBlocked);
        
        const posturaCost = damage * 1.4;
        this.postura = Math.max(0, this.postura - posturaCost);
        this.tension = Math.min(100, this.tension + damage * 0.2);

        this.body.setVelocityX(knockbackX * 0.35);
        spawnClashSpark(this.scene, this.x + this.facing * 15, this.y - 55, 0xffdd00);
        
        window.GameAudio.playBlock();

        addLog(`[BLOQUEIO] ${this.charType.toUpperCase()} defendeu o golpe.`, 'block');

        if (this.postura <= 0) {
            this.currentState = 'STUNNED';
            this.stateTimer = 1600;
            this.destroyHitbox();
            this.redrawCharacter();
            this.scene.cameras.main.shake(160, 0.015);
            addLog(`[BREAK] Defesa de ${this.charType.toUpperCase()} foi estourada!`, 'stun');
        }
    }

    triggerKO() {
        this.currentState = 'STUNNED';
        this.stateTimer = 3000;
        this.body.setVelocityX(-this.facing * 180);
        this.redrawCharacter();
        
        window.GameAudio.playKO();
        
        addLog(`[ROUND OVER] ${this.charType.toUpperCase()} foi NOCAUTEADO!`, 'danger');

        this.scene.time.delayedCall(2500, () => {
            player.hp = 100;
            player.postura = 100;
            player.tension = 0;
            player.currentState = 'IDLE';
            player.x = 180;
            player.y = 200;
            player.body.setVelocity(0);
            player.redrawCharacter();

            cpu.hp = 100;
            cpu.postura = 100;
            cpu.tension = 0;
            cpu.currentState = 'IDLE';
            cpu.x = 460;
            cpu.y = 200;
            cpu.body.setVelocity(0);
            cpu.redrawCharacter();

            p1ComboText.setAlpha(0);
            p2ComboText.setAlpha(0);

            // Volta para a seleção de personagens se for versus
            if (window.CombatConfig.gameMode === 'versus') {
                this.scene.scene.start('CharSelectScene');
            } else {
                addLog('Nova rodada iniciada.', 'system');
            }
        });
    }

    onStateTimerComplete() {
        if (this.currentState === 'DODGE') {
            this.body.checkCollision.none = false;
            // Restaurar tamanho físico normal
            const width = this.charType === 'kaelen' ? 32 : 44;
            this.body.setSize(width, this.normalHeight);
            this.body.setOffset(-width / 2, -this.normalHeight);
        }
        this.currentState = this.body.blocked.down ? 'IDLE' : 'JUMP';
        this.redrawCharacter();
    }
}

// --- INTELIGÊNCIA ARTIFICIAL ---
let lastCpuDecisionTime = 0;

function updateCPUBehavior(time, delta) {
    const behavior = window.CombatConfig.cpuBehavior;
    if (behavior === 'dummy') {
        if (!['HITSTUN', 'STUNNED'].includes(cpu.currentState) && cpu.body.blocked.down) {
            cpu.body.setVelocityX(0);
            cpu.currentState = 'IDLE';
        }
        return;
    }

    const dist = Math.abs(player.x - cpu.x);
    const onGround = cpu.body.blocked.down;

    if (['HITSTUN', 'STUNNED', 'LIGHT_ATTACK', 'HEAVY_ATTACK', 'DODGE', 'SPECIAL_1', 'SPECIAL_2', 'ULTIMATE'].includes(cpu.currentState)) {
        return;
    }

    if (behavior === 'blocker') {
        if ((player.currentState === 'LIGHT_ATTACK' || player.currentState === 'HEAVY_ATTACK' || player.currentState === 'SPECIAL_1' || player.currentState === 'SPECIAL_2') && dist < 130) {
            if (cpu.currentState !== 'BLOCK' && cpu.currentState !== 'PARRY_STANDBY') {
                cpu.enterBlockState();
            }
        } else {
            if (cpu.currentState === 'BLOCK' || cpu.currentState === 'PARRY_STANDBY') {
                cpu.currentState = 'IDLE';
                cpu.redrawCharacter();
            }
            if (dist > 150) {
                cpu.body.setVelocityX(cpu.facing * window.CombatConfig.playerSpeed * 0.7);
                cpu.currentState = 'WALK';
            } else if (dist < 110) {
                cpu.body.setVelocityX(-cpu.facing * window.CombatConfig.playerSpeed * 0.7);
                cpu.currentState = 'WALK';
            } else {
                cpu.body.setVelocityX(0);
                cpu.currentState = 'IDLE';
            }
        }
        return;
    }

    if (behavior === 'aggressor') {
        if (time - lastCpuDecisionTime > 350) {
            lastCpuDecisionTime = time;

            if (cpu.tension >= 100) {
                cpu.performUltimate();
                return;
            }

            if (dist > 160) {
                if (onGround && Math.random() < 0.4 && cpu.specialCooldown <= 0) {
                    cpu.performSpecialAttack(true);
                } else {
                    cpu.body.setVelocityX(cpu.facing * window.CombatConfig.playerSpeed * 0.95);
                    cpu.currentState = 'WALK';
                    if (Math.random() < 0.2) cpu.enterDashState(cpu.facing);
                }
            } else {
                const rnd = Math.random();
                if (rnd < 0.25) {
                    cpu.performLightAttack();
                } else if (rnd < 0.50) {
                    cpu.performHeavyAttack();
                } else if (rnd < 0.70 && cpu.specialCooldown <= 0) {
                    cpu.performSpecialAttack(false);
                } else if (rnd < 0.85) {
                    cpu.enterBlockState();
                } else {
                    cpu.enterDodgeState();
                }
            }
        }
    }
}

// --- DETECÇÃO DE COLISÃO ---
function checkCombatCollisions(scene) {
    if (player.attackHitbox && !player.hasHitThisAttack) {
        if (checkOverlap(player.attackHitbox, cpu)) {
            if (cpu.attackHitbox) {
                if (checkOverlap(player.attackHitbox, cpu.attackHitbox)) {
                    triggerWeaponClash(scene);
                    return;
                }
            }

            player.hasHitThisAttack = true;
            let isHeavy = player.currentState === 'HEAVY_ATTACK' || player.currentState === 'ULTIMATE';
            let damage = 10;
            let kbX = player.facing * 180;

            if (player.currentState === 'HEAVY_ATTACK') {
                damage = 18;
                kbX = player.facing * 280;
            } else if (player.currentState === 'SPECIAL_1') {
                damage = 4.5;
                kbX = player.facing * 100;
            } else if (player.currentState === 'SPECIAL_2') {
                damage = 12;
                kbX = player.facing * 300;
                if (cpu.currentState === 'BLOCK') cpu.postura = 0;
            } else if (player.currentState === 'ULTIMATE') {
                damage = 40;
                kbX = player.facing * 400;
            }

            cpu.receiveHit(damage, kbX, isHeavy, player);
        }
    }

    if (cpu.attackHitbox && !cpu.hasHitThisAttack) {
        if (checkOverlap(cpu.attackHitbox, player)) {
            if (player.attackHitbox) {
                if (checkOverlap(cpu.attackHitbox, player.attackHitbox)) {
                    triggerWeaponClash(scene);
                    return;
                }
            }

            cpu.hasHitThisAttack = true;
            let isHeavy = cpu.currentState === 'HEAVY_ATTACK' || cpu.currentState === 'ULTIMATE';
            let damage = 12;
            let kbX = cpu.facing * 200;

            if (cpu.currentState === 'HEAVY_ATTACK') {
                damage = window.CombatConfig.valeriDamage;
                kbX = cpu.facing * 340;
            } else if (cpu.currentState === 'SPECIAL_2') {
                damage = 6;
                kbX = cpu.facing * 220;
            } else if (cpu.currentState === 'ULTIMATE') {
                damage = 45;
                kbX = cpu.facing * 450;
            }

            player.receiveHit(damage, kbX, isHeavy, cpu);
        }
    }

    activeProjectiles.children.each(proj => {
        if (!proj.hasHit && checkOverlap(proj, player)) {
            proj.hasHit = true;
            player.receiveHit(proj.damage, proj.direction * 250, false, cpu);
            spawnClashSpark(scene, proj.x, proj.y, 0xff5500);
            proj.destroy();
        }
    });
}

function checkOverlap(hitbox, target) {
    const targetBounds = target.body ? {
        x: target.x - target.body.width/2,
        y: target.y - target.body.height/2,
        width: target.body.width,
        height: target.body.height
    } : target;

    return hitbox.x < targetBounds.x + targetBounds.width &&
           hitbox.x + hitbox.width > targetBounds.x &&
           hitbox.y < targetBounds.y + targetBounds.height &&
           hitbox.y + hitbox.height > targetBounds.y;
}

function triggerWeaponClash(scene) {
    player.destroyHitbox();
    cpu.destroyHitbox();
    player.hasHitThisAttack = true;
    cpu.hasHitThisAttack = true;

    player.currentState = 'HITSTUN';
    player.stateTimer = 220;
    player.body.setVelocityX(-player.facing * 240);
    player.redrawCharacter();

    cpu.currentState = 'HITSTUN';
    cpu.stateTimer = 220;
    cpu.body.setVelocityX(-cpu.facing * 240);
    cpu.redrawCharacter();

    player.tension = Math.min(100, player.tension + 15);
    cpu.tension = Math.min(100, cpu.tension + 15);

    const middleX = (player.x + cpu.x) / 2;
    const middleY = (player.y + cpu.y) / 2 - 60;

    spawnClashSpark(scene, middleX, middleY, 0xff00ff);
    scene.cameras.main.shake(80, 0.015);
    
    window.GameAudio.playClash();

    addLog(`[CLASH] Choque de Armas! As duas lâminas se colidiram! (+15% Especial)`, 'clash');
}

function spawnClashSpark(scene, x, y, colorCode) {
    const flash = scene.add.circle(x, y, 6, colorCode);
    scene.tweens.add({
        targets: flash,
        scaleX: 3.5,
        scaleY: 3.5,
        alpha: 0,
        duration: 250,
        onComplete: () => flash.destroy()
    });

    for (let i = 0; i < 8; i++) {
        const particle = scene.add.circle(x, y, 2.5, 0xffffff);
        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.Between(120, 280);
        
        scene.physics.add.existing(particle);
        particle.body.setVelocity(
            Math.cos(angle * Math.PI / 180) * speed,
            Math.sin(angle * Math.PI / 180) * speed
        );
        particle.body.setGravityY(400);

        scene.tweens.add({
            targets: particle,
            alpha: 0,
            duration: 350,
            onComplete: () => particle.destroy()
        });
    }
}

// Depuração
function drawDebugBoxes() {
    debugGraphics.clear();

    if (!window.CombatConfig.showBoxes) return;

    // Apenas desenha se a cena ativa for GameScene
    const activeScene = game.scene.getScene('GameScene');
    if (!activeScene || !activeScene.sys.isActive()) return;

    drawFighterBoxes(player);
    drawFighterBoxes(cpu);

    activeProjectiles.children.each(proj => {
        if (proj.body) {
            debugGraphics.lineStyle(1.5, 0xff7700, 0.8);
            debugGraphics.strokeRect(proj.x - proj.body.width/2, proj.y - proj.body.height/2, proj.body.width, proj.body.height);
        }
    });
}

function drawFighterBoxes(fighter) {
    if (!fighter.body) return;

    // Desenhar Pushbox (Corpo Físico) em verde
    debugGraphics.lineStyle(1.5, 0x00ff88, 0.6);
    debugGraphics.strokeRect(
        fighter.body.x,
        fighter.body.y,
        fighter.body.width,
        fighter.body.height
    );

    // Desenhar Hurtbox (Caixa de Dano) em azul transparente
    debugGraphics.fillStyle(0x0088ff, 0.15);
    debugGraphics.lineStyle(1, 0x0088ff, 0.5);
    debugGraphics.fillRect(
        fighter.body.x + 2,
        fighter.body.y + 2,
        fighter.body.width - 4,
        fighter.body.height - 4
    );
    debugGraphics.strokeRect(
        fighter.body.x + 2,
        fighter.body.y + 2,
        fighter.body.width - 4,
        fighter.body.height - 4
    );

    // Desenhar Hitbox de Ataque em vermelho
    if (fighter.attackHitbox) {
        debugGraphics.fillStyle(0xff003c, 0.35);
        debugGraphics.lineStyle(2, 0xff003c, 0.9);
        debugGraphics.fillRect(
            fighter.attackHitbox.x,
            fighter.attackHitbox.y,
            fighter.attackHitbox.width,
            fighter.attackHitbox.height
        );
        debugGraphics.strokeRect(
            fighter.attackHitbox.x,
            fighter.attackHitbox.y,
            fighter.attackHitbox.width,
            fighter.attackHitbox.height
        );
        
        debugGraphics.lineStyle(4, 0xff003c, 0.25);
        debugGraphics.strokeRect(
            fighter.attackHitbox.x - 2,
            fighter.attackHitbox.y - 2,
            fighter.attackHitbox.width + 4,
            fighter.attackHitbox.height + 4
        );
    }
}
