// Simulation animation code
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on the simulations page
    const canvas = document.getElementById('simulation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;
    const amplitude = 50;
    const frequency = 0.02;
    const phase = 0;
    let animationId;

    function drawSignal() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for(let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for(let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw signal
        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;

        for(let x = 0; x < canvas.width; x++) {
            const y = canvas.height/2 + amplitude * Math.sin(frequency * (x + time) + phase);
            if(x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
        time += 2;

        // Continue animation
        animationId = requestAnimationFrame(drawSignal);
    }

    // Start animation
    drawSignal();

    // Cleanup function
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}); 