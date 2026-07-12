// Controle de Input Unificado (Teclado e Touch Screen)
window.GameInput = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    lightAttack: false,
    heavyAttack: false,
    block: false,
    dodge: false,
    specialAttack: false,
    ultimateAttack: false,
    
    // Auxiliar para detectar duplo toque (Dash)
    lastPressTimeLeft: 0,
    lastPressTimeRight: 0,
    dashLeftTrigger: false,
    dashRightTrigger: false
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Deteção de Dispositivo Touch
    const detectTouch = () => {
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouch) {
            document.body.classList.add('is-touch');
        }
    };
    
    detectTouch();
    // Ativa também no primeiro evento touch, caso a deteção inicial falhe
    window.addEventListener('touchstart', function once() {
        document.body.classList.add('is-touch');
        window.removeEventListener('touchstart', once);
    });

    // 2. Mapeamento de Teclado
    const keyMap = {
        // Movimento P1 (WASD)
        'a': 'left', 'A': 'left', 'ArrowLeft': 'left',
        'd': 'right', 'D': 'right', 'ArrowRight': 'right',
        'w': 'up', 'W': 'up', 'ArrowUp': 'up',
        's': 'down', 'S': 'down', 'ArrowDown': 'down',
        ' ': 'jump',
        
        // Combate P1
        'j': 'lightAttack', 'J': 'lightAttack', 'x': 'lightAttack', 'X': 'lightAttack',
        'k': 'heavyAttack', 'K': 'heavyAttack', 'c': 'heavyAttack', 'C': 'heavyAttack',
        'l': 'block', 'L': 'block', 'v': 'block', 'V': 'block',
        'i': 'dodge', 'I': 'dodge', 'z': 'dodge', 'Z': 'dodge',
        'o': 'specialAttack', 'O': 'specialAttack',
        'u': 'ultimateAttack', 'U': 'ultimateAttack'
    };

    window.addEventListener('keydown', (e) => {
        const mapped = keyMap[e.key];
        if (mapped) {
            // Impedir rolagem de página por setas/espaço no navegador
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }
            
            // Logica para dash por clique duplo no teclado
            if (mapped === 'left' && !window.GameInput.left) {
                const now = Date.now();
                if (now - window.GameInput.lastPressTimeLeft < 250) {
                    window.GameInput.dashLeftTrigger = true;
                }
                window.GameInput.lastPressTimeLeft = now;
            }
            if (mapped === 'right' && !window.GameInput.right) {
                const now = Date.now();
                if (now - window.GameInput.lastPressTimeRight < 250) {
                    window.GameInput.dashRightTrigger = true;
                }
                window.GameInput.lastPressTimeRight = now;
            }

            window.GameInput[mapped] = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        const mapped = keyMap[e.key];
        if (mapped) {
            window.GameInput[mapped] = false;
        }
    });

    // 3. Controles Virtuais Mobile (Touch Overlay)
    const setupMobileButton = (btnId, inputProperty) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        const press = (e) => {
            e.preventDefault();
            
            // Especial para D-pad esquerdo/direito para disparar Dash
            if (inputProperty === 'left') {
                const now = Date.now();
                if (now - window.GameInput.lastPressTimeLeft < 250) {
                    window.GameInput.dashLeftTrigger = true;
                }
                window.GameInput.lastPressTimeLeft = now;
            }
            if (inputProperty === 'right') {
                const now = Date.now();
                if (now - window.GameInput.lastPressTimeRight < 250) {
                    window.GameInput.dashRightTrigger = true;
                }
                window.GameInput.lastPressTimeRight = now;
            }

            window.GameInput[inputProperty] = true;
        };

        const release = (e) => {
            e.preventDefault();
            window.GameInput[inputProperty] = false;
        };

        // Suporte para touch e mouse (para debug no browser simulando touch)
        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('touchend', release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false });
        
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    };

    // Registrar botões virtuais
    setupMobileButton('btn-left', 'left');
    setupMobileButton('btn-right', 'right');
    setupMobileButton('btn-up', 'up');
    setupMobileButton('btn-down', 'down');
    setupMobileButton('btn-jump', 'jump');
    setupMobileButton('btn-light', 'lightAttack');
    setupMobileButton('btn-heavy', 'heavyAttack');
    setupMobileButton('btn-block', 'block');
    setupMobileButton('btn-dodge', 'dodge');
    setupMobileButton('btn-special', 'specialAttack');
    setupMobileButton('btn-ultimate', 'ultimateAttack');
});
