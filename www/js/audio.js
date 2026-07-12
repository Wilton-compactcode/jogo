// Sintetizador de Áudio Retro-Arcade usando a Web Audio API
window.GameAudio = {
    ctx: null,

    // Garantir inicialização ao primeiro clique
    init: function() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    // Criar Buffer de Ruído Branco para efeitos de vento/faísca
    createNoiseBuffer: function() {
        if (!this.ctx) return null;
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 segundos
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    },

    // 1. Espada no Ar (Swish / Miss)
    playSlash: function() {
        this.init();
        if (!this.ctx) return;

        const noise = this.ctx.createBufferSource();
        const noiseBuffer = this.createNoiseBuffer();
        if (!noiseBuffer) return;
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.18);
    },

    // 2. Impacto de Espada (Clang / Hit)
    playHit: function() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        
        // Elemento metálico agudo
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(2200, now);
        osc1.frequency.exponentialRampToValueAtTime(300, now + 0.08);

        // Elemento encorpado
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(800, now);
        osc2.frequency.exponentialRampToValueAtTime(80, now + 0.12);

        const gain1 = this.ctx.createGain();
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc1.connect(gain1);
        osc2.connect(gain1);
        gain1.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
    },

    // 3. Bloqueio Comum (Shield Block / Tonk)
    playBlock: function() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    },

    // 4. Aparo Perfeito (Parry / Ting-Ting!)
    playParry: function() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Sino cristalino 1
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(3200, now);

        // Sino cristalino 2 (Duplo toque ligeiramente atrasado)
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(3400, now + 0.04);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.setValueAtTime(0.35, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.04);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    },

    // 5. Choque de Armas (Weapon Clash / Spark-Clash)
    playClash: function() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Choque de Metal
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(1400, now);
        osc1.frequency.exponentialRampToValueAtTime(200, now + 0.15);

        // Faísca Elétrica (Ruído Branco filtrado)
        const noise = this.ctx.createBufferSource();
        const noiseBuffer = this.createNoiseBuffer();
        if (noiseBuffer) noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4000, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc1.connect(gain);
        if (noiseBuffer) {
            noise.connect(filter);
            filter.connect(gain);
            noise.start(now);
            noise.stop(now + 0.2);
        }

        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.2);
    },

    // 6. Carregamento de Supremo (Ultimate Charge / Sci-Fi Sweep)
    playUltimate: function() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.45);

        // Modulador LFO para efeito tremido (Vibrato)
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(35, now); // 35Hz

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(100, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.55);
        osc.stop(now + 0.55);
    },

    // 7. Nocaute (Round Defeated / Descending Synth Chord)
    playKO: function() {
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        const frequencies = [110, 137.5, 165]; // Acorde menor (Lá menor retro)
        const oscillators = [];

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        frequencies.forEach(freq => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 0.5, now + 1.0); // Pitch Slide Down
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + 1.0);

            osc.connect(filter);
            filter.connect(gain);
            
            osc.start(now);
            osc.stop(now + 1.3);
            oscillators.push(osc);
        });

        gain.connect(this.ctx.destination);
    }
};
