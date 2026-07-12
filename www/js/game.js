// Configurações Globais do Motor de Combate
window.CombatConfig = {
    gravity: 1200,
    playerSpeed: 300,
    jumpForce: 550,
    kaelenRange: 65,
    valeriDamage: 25,
    showBoxes: false,
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
        window.SpriteGenerator.createSpritesheet(this, 'rin_sprites', 'rin');
        window.SpriteGenerator.createProjectileSpritesheet(this);
    }
    create() {
        // Criar animações globais uma única vez no boot
        this.createAnims('kaelen');
        this.createAnims('valeri');
        this.createAnims('rin');

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
        const title = this.add.text(width / 2, height / 2 - 60, 'STRIKE ZONE', {
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

        // Cartão 1: KAELEN (x = 130)
        const cardKaelen = this.add.rectangle(130, height / 2 + 10, 140, 210, 0x161922).setStrokeStyle(2, 0x2a3142);
        const sprKaelen = this.add.sprite(130, height / 2 - 30, 'kaelen_sprites', 0).setScale(1.2);
        sprKaelen.play('kaelen_idle');
        
        this.add.text(130, height / 2 + 25, 'KAELEN', {
            fontFamily: 'Orbitron',
            fontSize: '13px',
            fill: '#00f0ff',
            fontWeight: '700'
        }).setOrigin(0.5);

        this.add.text(130, height / 2 + 50, 'AGILIDADE: 9\nFORÇA: 5\nALCANCE: 7', {
            fontFamily: 'monospace',
            fontSize: '9px',
            fill: '#8c9ba5',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Cartão 2: VALERI (x = 320)
        const cardValeri = this.add.rectangle(320, height / 2 + 10, 140, 210, 0x161922).setStrokeStyle(2, 0x2a3142);
        const sprValeri = this.add.sprite(320, height / 2 - 30, 'valeri_sprites', 0).setScale(1.2);
        sprValeri.play('valeri_idle');

        this.add.text(320, height / 2 + 25, 'VALERI', {
            fontFamily: 'Orbitron',
            fontSize: '13px',
            fill: '#ff0055',
            fontWeight: '700'
        }).setOrigin(0.5);

        this.add.text(320, height / 2 + 50, 'AGILIDADE: 3\nFORÇA: 9\nALCANCE: 8', {
            fontFamily: 'monospace',
            fontSize: '9px',
            fill: '#8c9ba5',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Cartão 3: RIN (x = 510)
        const cardRin = this.add.rectangle(510, height / 2 + 10, 140, 210, 0x161922).setStrokeStyle(2, 0x2a3142);
        const sprRin = this.add.sprite(510, height / 2 - 30, 'rin_sprites', 0).setScale(1.2);
        sprRin.play('rin_idle');

        this.add.text(510, height / 2 + 25, 'RIN', {
            fontFamily: 'Orbitron',
            fontSize: '13px',
            fill: '#2ed573',
            fontWeight: '700'
        }).setOrigin(0.5);

        this.add.text(510, height / 2 + 50, 'AGILIDADE: 10\nFORÇA: 6\nALCANCE: 4', {
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

        cardRin.setInteractive({ useHandCursor: true });
        cardRin.on('pointerover', () => {
            cardRin.setStrokeStyle(3, 0x2ed573);
            window.GameAudio.playSlash();
        });
        cardRin.on('pointerout', () => cardRin.setStrokeStyle(2, 0x2a3142));
        cardRin.on('pointerdown', () => {
            window.GameAudio.playHit();
            window.CombatConfig.selectedCharacter = 'rin';
            this.scene.start('GameScene');
        });

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

        // Atualizar limites do mundo de física para o novo tamanho do canvas (alinhado com o chão)
        this.physics.world.setBounds(0, 0, W, GROUND_Y);

        // Chão de Arena Estilizado (física) — responsivo ao tamanho real
        platforms = this.physics.add.staticGroup();
        const ground = this.add.rectangle(W / 2, GROUND_Y + 20, W * 3, 40, 0x000000, 0);
        this.physics.add.existing(ground, true);
        platforms.add(ground);

        // Desenhar cenário cyberpunk elegante (usa GROUND_Y)
        drawScenery(this, W, H, GROUND_Y);

        // Instanciar Jogadores baseado na escolha
        const p1Char = window.CombatConfig.selectedCharacter;
        let p2Char = 'valeri';
        if (p1Char === 'valeri') {
            p2Char = Math.random() < 0.5 ? 'kaelen' : 'rin';
        } else if (p1Char === 'kaelen') {
            p2Char = Math.random() < 0.5 ? 'valeri' : 'rin';
        } else if (p1Char === 'rin') {
            p2Char = Math.random() < 0.5 ? 'kaelen' : 'valeri';
        }

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

        // Partículas e HUD
        particles = this.add.graphics();
        debugGraphics = this.add.graphics();
        this.hudGraphics = this.add.graphics();
        this.hudNamesCreated = false;

        // Registrar escutas de UI caso o painel esteja visível (modo treino)
        setupUIListeners(this);

        this.playerWins = 0;
        this.cpuWins = 0;
        this.currentRound = 1;
        this.roundActive = !isVersus;

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

            // Criar elementos HUD de Rounds no Versus
            this.hudRoundText = this.add.text(W / 2, 20, 'ROUND 1', {
                fontFamily: 'Orbitron',
                fontSize: '13px',
                fill: '#ffffff',
                fontWeight: '700',
                letterSpacing: 2
            }).setOrigin(0.5, 0);

            this.hudP1WinsText = this.add.text(W * 0.41, 16, '☆ ☆', {
                fontFamily: 'Orbitron',
                fontSize: '16px',
                fill: '#00f0ff',
                fontWeight: '900'
            }).setOrigin(1, 0);

            this.hudP2WinsText = this.add.text(W * 0.59, 16, '☆ ☆', {
                fontFamily: 'Orbitron',
                fontSize: '16px',
                fill: '#ff0055',
                fontWeight: '900'
            }).setOrigin(0, 0);

            // Iniciar introdução do primeiro round
            this.time.delayedCall(200, () => {
                this.startRoundIntro();
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

        // Desenhar barra de vida/postura no Versus
        this.drawHUDLifebars();
    }

    startRoundIntro() {
        this.roundActive = false;
        
        // Reposicionar jogadores no início do round
        const W = this.scale.width;
        const H = this.scale.height;
        const GROUND_Y = Math.round(H * 0.89);
        
        player.x = W * 0.27;
        player.y = GROUND_Y - 40;
        player.hp = 100;
        player.postura = 100;
        player.tension = 0;
        player.currentState = 'IDLE';
        player.isKO = false;
        player.body.checkCollision.none = false;
        let pWidth = player.charType === 'kaelen' ? 32 : (player.charType === 'rin' ? 28 : 44);
        player.body.setSize(pWidth, player.normalHeight);
        player.body.setOffset(-pWidth / 2, -player.normalHeight);
        player.body.setVelocity(0);
        player.redrawCharacter();

        cpu.x = W * 0.73;
        cpu.y = GROUND_Y - 40;
        cpu.hp = 100;
        cpu.postura = 100;
        cpu.tension = 0;
        cpu.currentState = 'IDLE';
        cpu.isKO = false;
        cpu.body.checkCollision.none = false;
        let cWidth = cpu.charType === 'kaelen' ? 32 : (cpu.charType === 'rin' ? 28 : 44);
        cpu.body.setSize(cWidth, cpu.normalHeight);
        cpu.body.setOffset(-cWidth / 2, -cpu.normalHeight);
        cpu.body.setVelocity(0);
        cpu.redrawCharacter();

        // Atualizar textos do HUD
        if (this.hudRoundText) {
            let roundLabel = `ROUND ${this.currentRound}`;
            if (this.currentRound === 3) roundLabel = 'ROUND FINAL';
            this.hudRoundText.setText(roundLabel);
        }
        if (this.hudP1WinsText) {
            this.hudP1WinsText.setText(this.playerWins === 1 ? '★ ☆' : (this.playerWins >= 2 ? '★ ★' : '☆ ☆'));
        }
        if (this.hudP2WinsText) {
            this.hudP2WinsText.setText(this.cpuWins === 1 ? '★ ☆' : (this.cpuWins >= 2 ? '★ ★' : '☆ ☆'));
        }

        // Criar texto gigante central de Round
        let bannerText = `ROUND ${this.currentRound}`;
        if (this.currentRound === 3) bannerText = 'ROUND FINAL';

        const banner = this.add.text(W / 2, H / 2 - 30, bannerText, {
            fontFamily: 'Orbitron',
            fontSize: '34px',
            fontWeight: '900',
            fill: '#ffffff',
            letterSpacing: 4
        }).setOrigin(0.5).setAlpha(0).setScale(0.6);
        banner.setShadow(0, 0, '#00f0ff', 12, true, true);

        // Animação de entrada do Round
        this.tweens.add({
            targets: banner,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(800, () => {
                    // Mudar para FIGHT!
                    banner.setText('FIGHT!');
                    banner.setShadow(0, 0, '#ff0055', 12, true, true);
                    window.GameAudio.playSlash();
                    
                    this.tweens.add({
                        targets: banner,
                        scaleX: 1.3,
                        scaleY: 1.3,
                        alpha: 0,
                        duration: 600,
                        ease: 'Power2.easeOut',
                        onComplete: () => {
                            banner.destroy();
                            this.roundActive = true; // Liberar movimentação!
                            addLog(`Round ${this.currentRound} iniciado! LUTE!`, 'system');
                        }
                    });
                });
            }
        });
    }

    showVictoryScreen(winnerName, winnerChar) {
        this.roundActive = false;
        const W = this.scale.width;
        const H = this.scale.height;

        // Fundo semitransparente escuro
        const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75).setDepth(1000).setAlpha(0);
        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 400
        });

        // Texto de Vencedor
        const title = this.add.text(W / 2, H / 2 - 60, 'FIM DA PARTIDA', {
            fontFamily: 'Orbitron',
            fontSize: '28px',
            fontWeight: '900',
            fill: '#ffffff',
            letterSpacing: 3
        }).setOrigin(0.5).setDepth(1001).setAlpha(0);
        title.setShadow(0, 0, '#00f0ff', 10, true, true);

        const desc = this.add.text(W / 2, H / 2 - 20, `${winnerChar.toUpperCase()} VENCEU!`, {
            fontFamily: 'Orbitron',
            fontSize: '18px',
            fontWeight: '700',
            fill: winnerName === 'P1' ? '#00f0ff' : '#ff0055',
            letterSpacing: 2
        }).setOrigin(0.5).setDepth(1001).setAlpha(0);

        this.tweens.add({
            targets: [title, desc],
            alpha: 1,
            y: '+=10',
            duration: 600,
            delay: 200,
            ease: 'Power2.easeOut'
        });

        // Botões interativos
        const createBtn = (yOffset, text, callback) => {
            const btn = this.add.text(W / 2, H / 2 + yOffset, text, {
                fontFamily: 'Orbitron',
                fontSize: '13px',
                fontWeight: '700',
                fill: '#8c9ba5',
                letterSpacing: 2
            }).setOrigin(0.5).setDepth(1001).setAlpha(0).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => {
                btn.setFill('#ffffff');
                btn.setScale(1.08);
                window.GameAudio.playSlash();
            });
            btn.on('pointerout', () => {
                btn.setFill('#8c9ba5');
                btn.setScale(1.0);
            });
            btn.on('pointerdown', () => {
                window.GameAudio.playHit();
                callback();
            });

            this.tweens.add({
                targets: btn,
                alpha: 1,
                duration: 500,
                delay: 600
            });
        };

        // Jogar Novamente
        createBtn(35, 'JOGAR NOVAMENTE', () => {
            overlay.destroy();
            title.destroy();
            desc.destroy();
            // Resetar estado de rounds
            this.playerWins = 0;
            this.cpuWins = 0;
            this.currentRound = 1;
            // Reiniciar intro
            this.startRoundIntro();
        });

        // Voltar ao Menu
        createBtn(75, 'SELEÇÃO DE PERSONAGENS', () => {
            this.scene.start('CharSelectScene');
        });
    }

    drawHUDLifebars() {
        this.hudGraphics.clear();
        
        const isVersus = window.CombatConfig.gameMode === 'versus';
        if (!isVersus) return;

        const W = this.scale.width;
        
        const barWidth = 200;
        const barHeight = 12;
        const guardHeight = 4;
        
        const p1X = 50;
        const p1Y = 22;
        
        this.hudGraphics.fillStyle(0x1a1a24, 0.85);
        this.hudGraphics.fillRect(p1X, p1Y, barWidth, barHeight);
        this.hudGraphics.fillRect(p1X, p1Y + barHeight + 3, barWidth, guardHeight);
        
        const p1HpW = (player.hp / 100) * barWidth;
        if (p1HpW > 0) {
            this.hudGraphics.fillStyle(0x00f0ff, 1);
            this.hudGraphics.fillRect(p1X, p1Y, p1HpW, barHeight);
        }
        
        const p1PostW = (player.postura / 100) * barWidth;
        if (p1PostW > 0) {
            this.hudGraphics.fillStyle(0xffdd00, 1);
            this.hudGraphics.fillRect(p1X, p1Y + barHeight + 3, p1PostW, guardHeight);
        }

        const p2X = W - 50 - barWidth;
        const p2Y = 22;
        
        this.hudGraphics.fillStyle(0x1a1a24, 0.85);
        this.hudGraphics.fillRect(p2X, p2Y, barWidth, barHeight);
        this.hudGraphics.fillRect(p2X, p2Y + barHeight + 3, barWidth, guardHeight);
        
        const p2HpW = (cpu.hp / 100) * barWidth;
        if (p2HpW > 0) {
            this.hudGraphics.fillStyle(0xff0055, 1);
            this.hudGraphics.fillRect(p2X + (barWidth - p2HpW), p2Y, p2HpW, barHeight);
        }
        
        const p2PostW = (cpu.postura / 100) * barWidth;
        if (p2PostW > 0) {
            this.hudGraphics.fillStyle(0xffdd00, 1);
            this.hudGraphics.fillRect(p2X + (barWidth - p2PostW), p2Y + barHeight + 3, p2PostW, guardHeight);
        }
        
        if (!this.hudNamesCreated) {
            this.hudNamesCreated = true;
            this.p1HudName = this.add.text(p1X, p1Y - 14, player.charType.toUpperCase(), {
                fontFamily: 'Orbitron',
                fontSize: '10px',
                fill: '#00f0ff',
                fontWeight: '700'
            });
            this.p2HudName = this.add.text(W - 50, p2Y - 14, cpu.charType.toUpperCase(), {
                fontFamily: 'Orbitron',
                fontSize: '10px',
                fill: '#ff0055',
                fontWeight: '700'
            }).setOrigin(1, 0);
        } else {
            this.p1HudName.setText(player.charType.toUpperCase());
            this.p2HudName.setText(cpu.charType.toUpperCase());
        }
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
        console.log("[StrikeZone] Motor do jogo inicializado com sucesso.");
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
        
        // Atributos de Veneno (específicos para Rin)
        this.poisonBuffTimer = 0;
        this.poisonedTimer = 0;
        this.poisonTickTimer = 0;
        this.poisonedBy = null;
        this.isKO = false;
        
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
        } else if (this.charType === 'rin') {
            width = 28;
            height = 66;
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
        
        let width = 32;
        let height = 70;
        if (this.charType === 'kaelen') {
            width = 32;
            height = 70;
        } else if (this.charType === 'rin') {
            width = 28;
            height = 66;
        } else {
            width = 44;
            height = 82;
        }

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

        if (this.poisonBuffTimer > 0) {
            this.sprite.setTint(0x2ed573);
        } else {
            this.sprite.clearTint();
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

        // Atualizar timers de veneno
        if (this.poisonBuffTimer > 0) {
            this.poisonBuffTimer -= delta;
            if (Math.random() < 0.18) {
                spawnPoisonParticles(this.scene, this.x + Phaser.Math.Between(-15, 15), this.y - Phaser.Math.Between(10, 50));
            }
        }
        if (this.poisonedTimer > 0) {
            this.poisonedTimer -= delta;
            if (Math.random() < 0.25) {
                spawnPoisonParticles(this.scene, this.x + Phaser.Math.Between(-12, 12), this.y - Phaser.Math.Between(10, 45));
            }
            this.poisonTickTimer = (this.poisonTickTimer || 0) + delta;
            if (this.poisonTickTimer >= 1000) {
                this.poisonTickTimer = 0;
                const dmg = 2.5;
                this.hp = Math.max(0, this.hp - dmg);
                addLog(`[VENENO] ${this.charType.toUpperCase()} sofreu 2.5 DoT! HP: ${Math.round(this.hp)}`, this.isPlayer ? 'p1-hit' : 'p2-hit');
                
                // Dar um pequeno feedback de piscar verde se estiver envenenado
                this.scene.tweens.add({
                    targets: this.sprite,
                    tint: 0x2ed573,
                    duration: 100,
                    yoyo: true,
                    repeat: 0,
                    onComplete: () => {
                        if (this.poisonBuffTimer > 0) {
                            this.sprite.setTint(0x2ed573);
                        } else {
                            this.sprite.clearTint();
                        }
                    }
                });

                if (this.hp <= 0) {
                    this.triggerKO();
                }
            }
        } else {
            this.poisonTickTimer = 0;
        }

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
        const isVersus = window.CombatConfig.gameMode === 'versus';
        this.infoText.setVisible(!isVersus);
        if (isVersus) return;

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
        if (!this.scene.roundActive) {
            this.body.setVelocityX(0);
            if (this.body.blocked.down) {
                this.currentState = 'IDLE';
                this.redrawCharacter();
            }
            return;
        }

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
        if (this.charType === 'rin') moveSpeed *= 1.15;
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
            let jumpF = window.CombatConfig.jumpForce;
            if (this.charType === 'rin') jumpF *= 1.08;
            if (onGround) {
                this.body.setVelocityY(-jumpF);
                this.currentState = 'JUMP';
                this.doubleJumpAvailable = true;
            } else if (this.doubleJumpAvailable) {
                this.body.setVelocityY(-jumpF * 0.9);
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
        let width = 32;
        if (this.charType === 'kaelen') width = 32;
        else if (this.charType === 'rin') width = 28;
        else width = 44;
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
        
        let startup = 100;
        let active = 120;
        let recovery = 150;
        let hitboxType = 'light-kaelen';
        
        if (this.charType === 'kaelen') {
            startup = 100; active = 120; recovery = 150;
            hitboxType = 'light-kaelen';
        } else if (this.charType === 'rin') {
            startup = 70; active = 100; recovery = 100;
            hitboxType = 'light-rin';
        } else { // valeri
            startup = 180; active = 150; recovery = 200;
            hitboxType = 'light-valeri';
        }

        this.stateTimer = startup + active + recovery;
        this.redrawCharacter();
        
        window.GameAudio.playSlash();

        this.scene.time.delayedCall(startup, () => {
            if (this.currentState === 'LIGHT_ATTACK') {
                this.createHitbox(hitboxType);
            }
        });

        this.scene.time.delayedCall(startup + active, () => {
            this.destroyHitbox();
        });
    }

    performHeavyAttack() {
        this.currentState = 'HEAVY_ATTACK';
        this.hasHitThisAttack = false;
        
        let startup = 220;
        let active = 150;
        let recovery = 250;
        let hitboxType = 'heavy-kaelen';
        
        if (this.charType === 'kaelen') {
            startup = 220; active = 150; recovery = 250;
            hitboxType = 'heavy-kaelen';
            this.body.setVelocityX(this.facing * (window.CombatConfig.playerSpeed + 80));
        } else if (this.charType === 'rin') {
            startup = 150; active = 120; recovery = 180;
            hitboxType = 'heavy-rin';
            this.body.setVelocityX(this.facing * (window.CombatConfig.playerSpeed * 1.3)); // lunge de ninja
        } else { // valeri
            startup = 350; active = 200; recovery = 350;
            hitboxType = 'heavy-valeri';
            this.superArmorActive = true;
            this.body.setVelocityX(this.facing * 40);
        }

        this.stateTimer = startup + active + recovery;
        this.redrawCharacter();
        
        window.GameAudio.playSlash();

        this.scene.time.delayedCall(startup, () => {
            if (this.currentState === 'HEAVY_ATTACK') {
                this.superArmorActive = false;
                this.createHitbox(hitboxType);
                this.redrawCharacter();
            }
        });

        this.scene.time.delayedCall(startup + active, () => {
            this.destroyHitbox();
        });
    }

    performSpecialAttack(onGround) {
        this.specialCooldown = 1500;
        
        window.GameAudio.playUltimate(); // Efeito de início de especial

        if (this.charType === 'kaelen') {
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
        } else if (this.charType === 'rin') {
            if (onGround) {
                // SPECIAL_1: Lâmina Tóxica
                this.currentState = 'SPECIAL_1';
                this.stateTimer = 450;
                this.poisonBuffTimer = 6000; // 6 segundos de veneno nas lâminas
                this.body.setVelocityX(0);
                this.redrawCharacter();
                addLog(`[ESPECIAL] Rin ativa LÂMINA TÓXICA! Suas garras/katanas brilham com veneno!`, 'parry');
                spawnClashSpark(this.scene, this.x, this.y - 45, 0x2ed573);
            } else {
                // SPECIAL_2: Passo de Fumaça (Teleport)
                this.currentState = 'SPECIAL_2';
                this.stateTimer = 500;
                this.hasHitThisAttack = false;
                this.redrawCharacter();
                
                const enemy = this.isPlayer ? cpu : player;
                addLog(`[ESPECIAL] Rin executa PASSO DE FUMAÇA!`, 'system');

                // Soltar fumaça na origem
                spawnPoisonParticles(this.scene, this.x, this.y - 30);
                spawnPoisonParticles(this.scene, this.x - 10, this.y - 20);
                spawnPoisonParticles(this.scene, this.x + 10, this.y - 20);

                // Teleportar atrás do inimigo
                this.scene.time.delayedCall(100, () => {
                    if (this.currentState === 'SPECIAL_2') {
                        this.x = enemy.x - enemy.facing * 60;
                        this.facing = enemy.facing;
                        this.body.setVelocity(0, -100); // flutua um pouquinho
                        this.redrawCharacter();
                        
                        // Soltar fumaça no destino
                        spawnPoisonParticles(this.scene, this.x, this.y - 30);
                        
                        // Desferir ataque de adaga surpresa
                        this.scene.time.delayedCall(100, () => {
                            if (this.currentState === 'SPECIAL_2') {
                                this.createHitbox('special-rin-teleport');
                                window.GameAudio.playSlash();
                            }
                        });
                        this.scene.time.delayedCall(250, () => {
                            this.destroyHitbox();
                        });
                    }
                });
            }
        } else { // valeri
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
        
        const enemy = this.isPlayer ? cpu : player;

        addLog(`[SUPREMO] ${this.charType.toUpperCase()} ATIVA ATAQUE SUPREMO!`, 'clash');
        window.GameAudio.playUltimate();

        triggerUltimateFreeze(this.scene, this, () => {
            if (this.currentState === 'ULTIMATE') {
                this.hasHitThisAttack = false;
                
                if (this.charType === 'kaelen') {
                    addLog(`[SUPREMO] Kaelen executa DANÇA DAS MIL ESTOCADAS!`, 'p1-hit');
                    this.x = enemy.x - enemy.facing * 50;
                    this.facing = enemy.facing;
                    this.redrawCharacter();
                    
                    this.createHitbox('ultimate-kaelen');
                    window.GameAudio.playHit();
                    this.scene.time.delayedCall(300, () => this.destroyHitbox());
                    spawnClashSpark(this.scene, enemy.x, enemy.y - 55, 0x00f0ff);
                } else if (this.charType === 'rin') {
                    addLog(`[SUPREMO] Rin executa DANÇA DAS SOMBRAS (MULTI-CLONE)!`, 'parry');
                    
                    // Ataques rápidos consecutivos de clones em posições diferentes
                    for (let i = 0; i < 3; i++) {
                        this.scene.time.delayedCall(i * 180, () => {
                            if (this.currentState === 'ULTIMATE') {
                                // Mudar de lado alternadamente
                                const side = i % 2 === 0 ? 1 : -1;
                                this.x = enemy.x + side * 70;
                                this.facing = -side;
                                this.redrawCharacter();
                                spawnPoisonParticles(this.scene, this.x, this.y - 30);
                                spawnClashSpark(this.scene, enemy.x, enemy.y - 45, 0x2ed573);
                                window.GameAudio.playSlash();
                                
                                // Dano menor por clone
                                enemy.receiveHit(8, -this.facing * 80, false, this);
                            }
                        });
                    }

                    // Golpe finalizador mais forte
                    this.scene.time.delayedCall(600, () => {
                        if (this.currentState === 'ULTIMATE') {
                            this.x = enemy.x - enemy.facing * 50;
                            this.facing = enemy.facing;
                            this.redrawCharacter();
                            
                            this.createHitbox('ultimate-rin');
                            window.GameAudio.playHit();
                            this.scene.time.delayedCall(200, () => this.destroyHitbox());
                            spawnClashSpark(this.scene, enemy.x, enemy.y - 45, 0xff0055);
                            this.scene.cameras.main.shake(250, 0.025);
                        }
                    });
                } else { // valeri
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
        } else if (attackType === 'light-rin') {
            width = 45;
            height = 12;
            offsetX = this.facing === 1 ? 14 : -14 - width;
            offsetY = -45;
        } else if (attackType === 'heavy-rin') {
            width = 58;
            height = 14;
            offsetX = this.facing === 1 ? 14 : -14 - width;
            offsetY = -45;
        } else if (attackType === 'special-rin-teleport') {
            width = 60;
            height = 16;
            offsetX = this.facing === 1 ? 14 : -14 - width;
            offsetY = -45;
        } else if (attackType === 'ultimate-rin') {
            width = 110;
            height = 40;
            offsetX = this.facing === 1 ? -40 : 40 - width;
            offsetY = -55;
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

        // Se o atacante for a Rin e estiver com o buff de veneno ativo, envenena o alvo
        if (attacker && attacker.charType === 'rin' && attacker.poisonBuffTimer > 0) {
            this.poisonedTimer = 5000;
            this.poisonedBy = attacker;
            addLog(`[VENENO] ${this.charType.toUpperCase()} foi envenenado!`, 'parry');
        }

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
        if (this.isKO) return;
        this.isKO = true;

        this.body.checkCollision.none = false;
        this.currentState = 'STUNNED';
        this.stateTimer = 3000;
        this.body.setVelocityX(-this.facing * 180);
        this.redrawCharacter();
        
        window.GameAudio.playKO();
        
        const isVersus = window.CombatConfig.gameMode === 'versus';
        addLog(`[ROUND OVER] ${this.charType.toUpperCase()} foi NOCAUTEADO!`, 'danger');

        if (isVersus) {
            // Parar o combate
            this.scene.roundActive = false;

            // Determinar o vencedor do round
            const winner = this.isPlayer ? cpu : player;
            const winnerName = this.isPlayer ? 'P2' : 'P1';

            if (winnerName === 'P1') {
                this.scene.playerWins++;
                if (this.scene.hudP1WinsText) {
                    this.scene.hudP1WinsText.setText(this.scene.playerWins === 1 ? '★ ☆' : '★ ★');
                }
            } else {
                this.scene.cpuWins++;
                if (this.scene.hudP2WinsText) {
                    this.scene.hudP2WinsText.setText(this.scene.cpuWins === 1 ? '★ ☆' : '★ ★');
                }
            }

            const W = this.scene.scale.width;
            const H = this.scene.scale.height;

            // Banner gigante de K.O. no centro
            const koBanner = this.scene.add.text(W / 2, H / 2 - 30, 'K.O.', {
                fontFamily: 'Orbitron',
                fontSize: '48px',
                fontWeight: '900',
                fill: '#ff0055',
                letterSpacing: 4
            }).setOrigin(0.5).setAlpha(0).setScale(0.5);
            koBanner.setShadow(0, 0, '#ff003c', 15, true, true);

            this.scene.tweens.add({
                targets: koBanner,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    this.scene.time.delayedCall(1000, () => {
                        koBanner.setText(`${winner.charType.toUpperCase()} VENCE O ROUND!`);
                        koBanner.setFontSize(22);
                        koBanner.setShadow(0, 0, winnerName === 'P1' ? '#00f0ff' : '#ff0055', 8, true, true);
                        koBanner.setFill(winnerName === 'P1' ? '#00f0ff' : '#ff0055');
                    });
                }
            });

            this.scene.time.delayedCall(2800, () => {
                koBanner.destroy();
                p1ComboText.setAlpha(0);
                p2ComboText.setAlpha(0);

                // Verificar se alguém venceu a partida
                if (this.scene.playerWins >= 2 || this.scene.cpuWins >= 2) {
                    this.scene.showVictoryScreen(winnerName, winner.charType);
                } else {
                    this.scene.currentRound++;
                    this.scene.startRoundIntro();
                }
            });
        } else {
            // Lógica padrão de resete instantâneo para o laboratório de física (treino)
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
                addLog('Nova rodada iniciada.', 'system');
            });
        }
    }

    onStateTimerComplete() {
        if (this.currentState === 'DODGE') {
            this.body.checkCollision.none = false;
            // Restaurar tamanho físico normal
            let width = 32;
            if (this.charType === 'kaelen') width = 32;
            else if (this.charType === 'rin') width = 28;
            else width = 44;
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
    if (!cpu.scene.roundActive) {
        cpu.body.setVelocityX(0);
        if (cpu.body.blocked.down) {
            cpu.currentState = 'IDLE';
            cpu.redrawCharacter();
        }
        return;
    }

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

            if (cpu.charType === 'rin') {
                if (dist > 160) {
                    if (cpu.specialCooldown <= 0 && Math.random() < 0.6) {
                        // Passo de fumaça (teleport aéreo)
                        cpu.performSpecialAttack(false);
                    } else {
                        cpu.body.setVelocityX(cpu.facing * window.CombatConfig.playerSpeed * 1.1);
                        cpu.currentState = 'WALK';
                        if (Math.random() < 0.3) cpu.enterDashState(cpu.facing);
                    }
                } else {
                    const rnd = Math.random();
                    if (cpu.specialCooldown <= 0 && cpu.poisonBuffTimer <= 0 && rnd < 0.5) {
                        // Ativar Lâmina Tóxica no solo
                        cpu.performSpecialAttack(true);
                    } else if (rnd < 0.40) {
                        cpu.performLightAttack();
                    } else if (rnd < 0.65) {
                        cpu.performHeavyAttack();
                    } else if (rnd < 0.80) {
                        cpu.enterBlockState();
                    } else {
                        cpu.enterDodgeState();
                    }
                }
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
            let damage = player.charType === 'rin' ? 8 : 10;
            let kbX = player.facing * (player.charType === 'rin' ? 120 : 180);

            if (player.currentState === 'HEAVY_ATTACK') {
                damage = player.charType === 'rin' ? 14 : 18;
                kbX = player.facing * (player.charType === 'rin' ? 200 : 280);
            } else if (player.currentState === 'SPECIAL_1') {
                damage = 4.5;
                kbX = player.facing * 100;
            } else if (player.currentState === 'SPECIAL_2') {
                damage = player.charType === 'rin' ? 12 : 12;
                kbX = player.facing * (player.charType === 'rin' ? 150 : 300);
                if (cpu.currentState === 'BLOCK') cpu.postura = 0;
            } else if (player.currentState === 'ULTIMATE') {
                damage = player.charType === 'rin' ? 24 : 40;
                kbX = player.facing * (player.charType === 'rin' ? 380 : 400);
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
            let damage = cpu.charType === 'rin' ? 8 : 12;
            let kbX = cpu.facing * (cpu.charType === 'rin' ? 120 : 200);

            if (cpu.currentState === 'HEAVY_ATTACK') {
                damage = cpu.charType === 'rin' ? 14 : (cpu.charType === 'kaelen' ? 18 : window.CombatConfig.valeriDamage);
                kbX = cpu.facing * (cpu.charType === 'rin' ? 200 : (cpu.charType === 'kaelen' ? 280 : 340));
            } else if (cpu.currentState === 'SPECIAL_2') {
                damage = cpu.charType === 'rin' ? 12 : 6;
                kbX = cpu.facing * (cpu.charType === 'rin' ? 150 : 220);
            } else if (cpu.currentState === 'ULTIMATE') {
                damage = cpu.charType === 'rin' ? 24 : 45;
                kbX = cpu.facing * (cpu.charType === 'rin' ? 380 : 450);
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

function spawnPoisonParticles(scene, x, y) {
    const bubble = scene.add.circle(x, y, Phaser.Math.FloatBetween(2, 4.5), 0x2ed573, 0.7);
    scene.tweens.add({
        targets: bubble,
        y: y - Phaser.Math.Between(15, 35),
        x: x + Phaser.Math.Between(-10, 10),
        scaleX: 0.1,
        scaleY: 0.1,
        alpha: 0,
        duration: Phaser.Math.Between(600, 1000),
        onComplete: () => bubble.destroy()
    });
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
