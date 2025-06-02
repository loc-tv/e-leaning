// Simulation animation code
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('simulation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Form elements
    const form = document.getElementById('simulationForm');
    const modulationTypeEl = document.getElementById('modulationType');
    const carrierFreqEl = document.getElementById('carrierFreq');
    const messageFreqEl = document.getElementById('messageFreq');
    const amplitudeEl = document.getElementById('amplitude');
    const pskBitsEl = document.getElementById('pskBits');
    const pskBitGroup = document.getElementById('pskBitGroup');
    const startBtn = document.getElementById('startSimBtn');

    let animationId = null;
    let time = 0;
    let params = {};

    // Show/hide PSK bits input
    modulationTypeEl.addEventListener('change', function() {
        if (modulationTypeEl.value === 'PSK') {
            pskBitGroup.style.display = '';
        } else {
            pskBitGroup.style.display = 'none';
        }
    });

    function getParamsFromForm() {
        return {
            modulationType: modulationTypeEl.value,
            carrierFreq: parseFloat(carrierFreqEl.value),
            messageFreq: parseFloat(messageFreqEl.value),
            amplitude: parseFloat(amplitudeEl.value),
            pskBits: pskBitsEl.value.split(',').map(b => b.trim()).filter(b => b === '0' || b === '1').map(Number)
        };
    }

    function drawAxes() {
        ctx.save();
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1.2;
        // Trục Y
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(50, canvas.height - 40);
        ctx.stroke();
        // Trục X
        ctx.beginPath();
        ctx.moveTo(50, canvas.height / 2);
        ctx.lineTo(canvas.width - 20, canvas.height / 2);
        ctx.stroke();
        // Nhãn trục Y (Biên độ) - sát mép trên
        ctx.fillStyle = '#222';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Biên độ', 52, 28);
        // Nhãn trục X (Thời gian) - sát mép dưới
        ctx.textAlign = 'center';
        ctx.fillText('Thời gian (t)', (canvas.width + 50 - 20) / 2, canvas.height - 10);
        ctx.restore();
    }

    function drawSignal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw grid
        ctx.save();
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 0.7;
        for(let x = 50; x < canvas.width - 20; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, canvas.height - 30); ctx.stroke();
        }
        for(let y = 10; y < canvas.height - 30; y += 40) {
            ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(canvas.width - 20, y); ctx.stroke();
        }
        ctx.restore();
        // Draw axes
        drawAxes();
        // Draw signal
        ctx.save();
        ctx.shadowColor = '#2196F3';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2.2;
        const { modulationType, carrierFreq, messageFreq, amplitude, pskBits } = params;
        const T = 1 / (messageFreq || 1);
        const plotWidth = canvas.width - 70; // 50 left, 20 right
        const samplesPerBit = Math.floor(plotWidth / (pskBits && pskBits.length ? pskBits.length : 8));
        for(let x = 0; x < plotWidth; x++) {
            let y = canvas.height/2;
            const t = (x + time) / plotWidth * 2 * Math.PI;
            if (modulationType === 'AM') {
                y += amplitude * 50 * (1 + 0.5 * Math.sin(messageFreq * t)) * Math.sin(carrierFreq * t);
            } else if (modulationType === 'FM') {
                y += amplitude * 50 * Math.sin(carrierFreq * t + 2 * Math.sin(messageFreq * t));
            } else if (modulationType === 'PSK') {
                let bitIdx = Math.floor(x / samplesPerBit) % (pskBits.length || 1);
                let phase = pskBits[bitIdx] === 1 ? 0 : Math.PI;
                y += amplitude * 50 * Math.sin(carrierFreq * t + phase);
            }
            if(x === 0) ctx.moveTo(x + 50, y); else ctx.lineTo(x + 50, y);
        }
        ctx.stroke();
        ctx.restore();
        time += 2;
        animationId = requestAnimationFrame(drawSignal);
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        time = 0;
        params = getParamsFromForm();
        drawSignal();
    }

    startBtn.addEventListener('click', startAnimation);

    // Optional: start with default params
    params = getParamsFromForm();
    drawSignal();

    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (animationId) cancelAnimationFrame(animationId);
    });
}); 