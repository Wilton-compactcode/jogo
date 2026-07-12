// Gerador Procedural de Sprites Pixel Art para Slash & Pixel
window.SpriteGenerator = {
    // Paletas de Cores
    palettes: {
        kaelen: {
            '.': null,              // Transparente
            'k': '#12131c',         // Contorno escuro
            'w': '#ffffff',         // Cabelo branco/lâmina
            's': '#ffd3a3',         // Pele
            'b': '#0055ff',         // Jaqueta azul
            'c': '#00f0ff',         // Detalhes cyan
            'g': '#4b5563',         // Calças cinza
            'd': '#1f2937',         // Botas
            'e': 'rgba(0, 240, 255, 0.4)' // Brilho de energia cyan
        },
        valeri: {
            '.': null,              // Transparente
            'k': '#12131c',         // Contorno escuro
            'h': '#ff3838',         // Cabelo vermelho
            's': '#ffeaa7',         // Pele
            'm': '#747d8c',         // Armadura cinza
            'r': '#d63031',         // Capa vermelha
            'g': '#ffb8b8',         // Detalhes rosa/ouro
            'd': '#2f3542',         // Botas
            'w': '#ffffff',         // Espada lâmina
            'e': 'rgba(255, 0, 85, 0.4)' // Brilho de energia vermelho
        }
    },

    // Representações Gráficas das matrizes 32x32
    // Cada caractere representa 1 pixel na resolução 32x32.
    // As matrizes são compactadas por facilidade de leitura e desenho.
    kaelenFrames: {
        // Idle (4 frames)
        idle: [
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "...........ggggggggg............",
                "...........ggggggggg............",
                "...........gggg.gggg............",
                "...........gggg.gggg............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ],
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "...........ggggggggg............",
                "...........ggggggggg............",
                "...........gggg.gggg............",
                "...........gggg.gggg............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ],
            // Frame 2 (Respiração levemente abaixada)
            [
                "................................",
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "          bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "...........ggggggggg............",
                "...........ggggggggg............",
                "...........gggg.gggg............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ],
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "...........ggggggggg............",
                "...........ggggggggg............",
                "...........gggg.gggg............",
                "...........gggg.gggg............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ]
        ],
        // Walk (4 frames)
        walk: [
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "...........gggg.gggg............",
                "...........gggg..ggg............",
                "..........gggg...ggg............",
                "..........ddd.....ddd...........",
                "................................"
            ],
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "............gggggggg............",
                "............gggggggg............",
                "............gggg.ggg............",
                "............ddd...dd............",
                "................................"
            ],
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "............gggg.ggg............",
                "............ggg..ggg............",
                "............ggg..gggg...........",
                "............ddd...ddd...........",
                "................................"
            ],
            [
                "................................",
                ".............wwwww..............",
                "............wwwwwww.............",
                "...........wwwssssw.............",
                "...........wwssssss.............",
                "............ksssss..............",
                "............bbbbbbbb............",
                "...........bbbbbbbbb............",
                "..........bbbcbcbbbbb...........",
                "..........bbbbbbbbbbb...........",
                "...........bbbbbbbbb............",
                "............gggggggg............",
                "............gggggggg............",
                "............ggg..ggg............",
                "............dd...ddd............",
                "................................"
            ]
        ],
        // Light Attack (Pose de estocada)
        lightAttack: [
            "................................",
            "................................",
            ".............wwwww..............",
            "............wwwwwww.............",
            "...........wwwssssw.............",
            "...........wwssssss.............",
            "............ksssss..w...........",
            "............bbbbbb.www..........",
            ".......bbbbbbbbbbbbwww..........",
            ".......ccccccccccccccwwwwwwww...",
            ".......bbbbbbbbbbbbwww..........",
            "............bbbbbb.www..........",
            "...........bbbbbbbb..w..........",
            "...........gggg.ggg.............",
            "...........gggg.ggg.............",
            "...........ddd...ddd............",
            "................................"
        ],
        // Heavy Attack (Lunge profundo com espada brilhante)
        heavyAttack: [
            "................................",
            ".............wwwww..............",
            "............wwwwwww.............",
            "...........wwwssssw...........ee",
            "...........wwssssss.........eeee",
            "............ksssss........eeeeee",
            "............bbbbbb......eeeeeeee",
            "........bbbbbbbbbbbb..eeeeeeeeee",
            ".......ccccccccccccccwwwwwwwwwww",
            "........bbbbbbbbbbbb..eeeeeeeeee",
            "............bbbbbb......eeeeeeee",
            "...........gggg.ggg.......eeeeee",
            "..........gggg...ggg........eeee",
            ".........ddd......ddd.........ee",
            "................................"
        ],
        // Block (Em guarda com espada vertical e escudo de energia)
        block: [
            "................................",
            ".............wwwww..............",
            "............wwwwwww.............",
            "...........wwwssssw.e...........",
            "...........wwsssssseee..........",
            "............kssssseeeee.w.......",
            ".............ssssseeeee.w.......",
            "............bbbbbbeeeee.w.......",
            "...........bbbbbbbeeeee.w.......",
            "..........bbbcbcbbeeeee.w.......",
            "..........bbbcbcbbeeeee.w.......",
            "..........bbbbbbbbeeeee.w.......",
            "...........bbbbbbbeeeee.w.......",
            "...........gggggggeeeee.........",
            "...........gggggggggge..........",
            "...........gggg.gggg............",
            "...........dddd.dddd............",
            "................................"
        ],
        // Dodge (Rolamento em círculo compacto)
        dodge: [
            "................................",
            "................................",
            "................................",
            "................................",
            ".............wwwww..............",
            "...........wwwwwwwww............",
            "..........wwwbbbbbbww...........",
            ".........wwbbbbbbbbbbw..........",
            "........wwbbbbbbbbbbbbw.........",
            "........wbbbcbcbbbbbbbw.........",
            "........wbbbcbcbbbbbbbw.........",
            "........wwbbbbbbbbbbbw..........",
            ".........wwggggggggww...........",
            "..........wwwddddwww............",
            "............wwwwww..............",
            "................................"
        ],
        // Hitstun (Arremessado para trás com impacto)
        hitstun: [
            "................................",
            "..........wwwwww................",
            ".........wwwwwwww...............",
            "........wwwssssww...............",
            "........wwssssss................",
            ".........ksssss.................",
            "..........sssss.................",
            "...........bbbbbbbb.............",
            "..........bbbbbbbbbb............",
            ".........bbbcbcbbbbbb...........",
            ".........bbbcbcbbbbbb...........",
            "..........bbbbbbbbbb............",
            "...........bbbbbbbb.............",
            "............gggggggg............",
            "...........gggg..ggg............",
            "..........ddd.....ddd...........",
            "................................"
        ],
        // Special (Pose de canalização mágica/rúnica)
        special: [
            "................................",
            ".............wwwww..............",
            "............wwwwwww.............",
            "...........wwwssssw.............",
            "...........wwssssss.............",
            "............ksssss...e..........",
            "............bbbbbb..eee.........",
            "........bbbbbbbbbbbb....e.......",
            ".......ccccccccccccccwwwwwwww...",
            "........bbbbbbbbbbbb....e.......",
            "............bbbbbb..eee.........",
            "...........gggg.ggg..e..........",
            "..........gggg...ggg............",
            ".........ddd......ddd...........",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................",
            "................................"
        ]
    },

    valeriFrames: {
        // Idle (4 frames)
        idle: [
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "...........ddddddddd............",
                "...........ddddddddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ],
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "...........ddddddddd............",
                "...........ddddddddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ],
            // Frame 2 (Abaixa ombro levemente)
            [
                "................................",
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "...........ddddddddd............",
                "...........ddddddddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ],
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                ".............sssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "...........ddddddddd............",
                "...........ddddddddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "...........dddd.dddd............",
                "................................"
            ]
        ],
        // Walk (4 frames)
        walk: [
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "...........dddd.dddd............",
                "...........dddd..ddd............",
                "..........dddd...ddd............",
                "..........ddd.....ddd...........",
                "................................"
            ],
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "............dddddddd............",
                "............dddddddd............",
                "............dddd.ddd............",
                "............ddd...dd............",
                "................................"
            ],
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "............dddd.ddd............",
                "............ddd..ddd............",
                "............ddd..dddd...........",
                "............ddd...ddd...........",
                "................................"
            ],
            [
                "................................",
                ".............hhhhh..............",
                "............hhhhhhh.............",
                "...........hhsssssh.............",
                "...........hhssssss.............",
                "............ksssss..............",
                "............mmmmmmmm............",
                "...........rmmmmmmmr............",
                "..........rmmmgmgmmmr...........",
                "..........rmmmmmmmmmr...........",
                "...........rmmmmmmmr............",
                "............dddddddd............",
                "............dddddddd............",
                "............ddd..ddd............",
                "............dd...ddd............",
                "................................"
            ]
        ],
        // Light Attack (Corte com montante)
        lightAttack: [
            "................................",
            "................................",
            ".............hhhhh..............",
            "............hhhhhhh.............",
            "...........hhsssssh.............",
            "...........hhssssss.............",
            "............ksssss..............",
            "............mmmmmm..............",
            ".......mmmmmmmmmmmm.............",
            ".......ggggggggggggwwwwwwwwww...",
            ".......mmmmmmmmmmmm.............",
            "............mmmmmm..............",
            "...........mmmmmmmm.............",
            "...........dddd.ddd.............",
            "...........dddd.ddd.............",
            "...........ddd...ddd............",
            "................................"
        ],
        // Heavy Attack (Grande corte aéreo com fogo/energia vermelha)
        heavyAttack: [
            "..............................ee",
            ".............hhhhh...........eee",
            "............hhhhhhh.........eeee",
            "...........hhsssssh.......eeeeee",
            "...........hhssssss.....eeeeeeee",
            "............ksssss....eeeeeeeeee",
            "............mmmmmm..eeeeeeeeeeee",
            "........mmmmmmmmmmmmwwwwwwwwwwww",
            ".......gggggggggggggwwwwwwwwwwww",
            "........mmmmmmmmmmmmwwwwwwwwwwww",
            "............mmmmmm..eeeeeeeeeeee",
            "...........dddd.ddd...eeeeeeeeee",
            "..........dddd...ddd....eeeeeeee",
            ".........ddd......ddd.....eeeeee",
            "................................"
        ],
        // Block (Guarda de espada pesada vertical)
        block: [
            "................................",
            ".............hhhhh..............",
            "............hhhhhhh.............",
            "...........hhsssssh.e...........",
            "...........hhsssssseee..........",
            "............kssssseeeee.w.......",
            ".............ssssseeeee.w.......",
            "............mmmmmmeeeee.w.......",
            "...........rmmmmmmeeeee.w.......",
            "..........rmmmgmgmeeeee.w.......",
            "..........rmmmgmgmeeeee.w.......",
            "..........rmmmmmmeeeee..w.......",
            "...........rmmmmmmeeeee.........",
            "...........dddddddeeee..........",
            "...........ddddddddde...........",
            "...........dddd.dddd............",
            "...........dddd.dddd............",
            "................................"
        ],
        // Dodge (Rolamento pesado da vanguarda)
        dodge: [
            "................................",
            "................................",
            "................................",
            "................................",
            ".............hhhhh..............",
            "...........hhhhhhhhh............",
            "..........hhmmmmmmmmhh..........",
            ".........hhmmmmmmmmmmh..........",
            "........hhmmmmmmmmmmmmh.........",
            "........hmmmmgmgmmmmmmh.........",
            "........hmmmmgmgmmmmmmh.........",
            "........hhmmmmmmmmmmh...........",
            ".........hhddddddddhh...........",
            "..........wwwddddwww............",
            "............wwwwww..............",
            "................................"
        ],
        // Hitstun (Impacto em armadura pesada)
        hitstun: [
            "................................",
            "..........hhhhhh................",
            ".........hhhhhhhh...............",
            "........hhsssshh................",
            "........hhssssss................",
            ".........ksssss.................",
            "..........sssss.................",
            "...........mmmmmmmm.............",
            "..........rmmmmmmmmr............",
            ".........rmmmgmgmmmr............",
            ".........rmmmgmgmmmr............",
            "..........rmmmmmmmr.............",
            "...........rmmmmmmr.............",
            "............dddddddd............",
            "...........dddd..ddd............",
            "..........ddd.....ddd...........",
            "................................"
        ],
        // Special (Levantando montante verticalmente carregando energia)
        special: [
            "..................ww............",
            ".................wwww...........",
            ".................wwww...........",
            ".................wwww...........",
            ".................wwww...........",
            ".................wwww...........",
            ".............hhhhwwww...........",
            "............hhhhhwwww...........",
            "...........hhssssshw............",
            "...........hhssssss.............",
            "............ksssss..............",
            "............mmmmmm..............",
            "........mmmmmmmmmmmm............",
            ".......ggggggggggggg............",
            "........mmmmmmmmmmmm............",
            "............mmmmmm..............",
            "...........dddd.ddd.............",
            "..........dddd...ddd............",
            ".........ddd......ddd...........",
            "................................"
        ]
    },

    // Função interna para criar spritesheet no canvas e registrar no Phaser
    createSpritesheet: function(scene, key, charType) {
        const isKaelen = charType === 'kaelen';
        const framesData = isKaelen ? this.kaelenFrames : this.valeriFrames;
        const palette = isKaelen ? this.palettes.kaelen : this.palettes.valeri;

        // Lista ordenada de quadros a renderizar horizontalmente
        const framesList = [];
        
        // 4 quadros de Idle
        framesList.push(...framesData.idle);
        // 4 quadros de Walk
        framesList.push(...framesData.walk);
        // 1 quadro de Light Attack
        framesList.push(framesData.lightAttack[0]);
        // 1 quadro de Heavy Attack
        framesList.push(framesData.heavyAttack[0]);
        // 1 quadro de Block
        framesList.push(framesData.block[0]);
        // 1 quadro de Dodge
        framesList.push(framesData.dodge[0]);
        // 1 quadro de Hitstun
        framesList.push(framesData.hitstun[0]);
        // 1 quadro de Special
        framesList.push(framesData.special[0]);

        const totalFrames = framesList.length;
        const spriteSize = 32; // Resolução lógica da matriz
        const scale = 2;       // Fator de escala pixel-perfect (gerando quadros 64x64)
        const frameWidth = spriteSize * scale;
        const frameHeight = spriteSize * scale;

        // Criar elemento canvas
        const canvas = document.createElement('canvas');
        canvas.width = frameWidth * totalFrames;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Garante o pixel-art limpo

        // Desenhar cada quadro
        framesList.forEach((frameMatrix, frameIndex) => {
            const startX = frameIndex * frameWidth;

            // Percorrer a matriz de string do quadro
            for (let y = 0; y < spriteSize; y++) {
                const row = frameMatrix[y] || "";
                for (let x = 0; x < spriteSize; x++) {
                    const char = row[x] || '.';
                    const color = palette[char];

                    if (color) {
                        ctx.fillStyle = color;
                        // Desenha um bloco "escala x escala" no canvas
                        ctx.fillRect(
                            startX + x * scale, 
                            y * scale, 
                            scale, 
                            scale
                        );
                    }
                }
            }
        });

        // Adicionar o canvas gerado como spritesheet no Phaser
        scene.textures.addSpriteSheet(key, canvas, {
            frameWidth: frameWidth,
            frameHeight: frameHeight
        });

        console.log(`[SpritesProcedural] Spritesheet '${key}' criada com ${totalFrames} frames de tamanho ${frameWidth}x${frameHeight}.`);
    },

    createProjectileSpritesheet: function(scene) {
        const spriteSize = 16;
        const scale = 2;
        const frameSize = spriteSize * scale;
        const totalFrames = 4;

        const palette = {
            '.': null,
            'r': '#ff3838', // Vermelho
            'o': '#ff9f43', // Laranja
            'y': '#feca57', // Amarelo
            'w': '#ffffff'  // Branco centro
        };

        const frames = [
            [
                "................",
                "................",
                "................",
                ".......r........",
                "......ro........",
                ".....roy........",
                "....rowy........",
                "...roww.........",
                "..roww..........",
                ".roww...........",
                "row.............",
                "oo..............",
                "................"
            ],
            [
                "................",
                "................",
                ".......r........",
                "......ro........",
                ".....roy........",
                "....rowy........",
                "...roww.........",
                "..roww..........",
                ".row............",
                "oo..............",
                "................",
                "................"
            ],
            [
                "................",
                ".......r........",
                "......ro........",
                ".....roy........",
                "....rowy........",
                "...roww.........",
                "..roww..........",
                ".row............",
                "oo..............",
                "................",
                "................",
                "................"
            ],
            [
                "................",
                "......r.........",
                ".....ro.........",
                "....roy.........",
                "...rowy.........",
                "..roww..........",
                ".roww...........",
                "row.............",
                "oo..............",
                "................",
                "................",
                "................"
            ]
        ];

        const canvas = document.createElement('canvas');
        canvas.width = frameSize * totalFrames;
        canvas.height = frameSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        frames.forEach((frameMatrix, frameIndex) => {
            const startX = frameIndex * frameSize;
            for (let y = 0; y < spriteSize; y++) {
                const row = frameMatrix[y] || "";
                for (let x = 0; x < spriteSize; x++) {
                    const char = row[x] || '.';
                    const color = palette[char];
                    if (color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(startX + x * scale, y * scale, scale, scale);
                    }
                }
            }
        });

        scene.textures.addSpriteSheet('projectile_sprites', canvas, {
            frameWidth: frameSize,
            frameHeight: frameSize
        });
        console.log(`[SpritesProcedural] Spritesheet de projéteis criada com sucesso.`);
    }
};
