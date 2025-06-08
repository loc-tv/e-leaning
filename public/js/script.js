// Tab switching (đã có)
const buttons = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.tab;

        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        contents.forEach(content => {
            content.style.display = content.id === targetId ? "block" : "none";
        });
    });
});

// Sidebar switching
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        // Kích hoạt nav-item
        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        // Ẩn tất cả nội dung
        pages.forEach(page => page.style.display = "none");

        // Hiển thị đúng nội dung
        switch (index) {
            case 0:
                document.getElementById("study-materials").style.display = "block";
                break;
            case 1:
                document.getElementById("simulations").style.display = "block";
                break;
            case 2:
                document.getElementById("quizzes").style.display = "block";
                break;
            case 3:
                document.getElementById("settings").style.display = "block";
                break;
        }
    });
});

document.getElementById("quizForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const answers = {
      q1: "a",
      q2: "b"
  };

  let score = 0;
  let total = Object.keys(answers).length;

  // Reset styles
  const labels = this.querySelectorAll("label");
  labels.forEach(l => {
      l.classList.remove("correct", "incorrect");
  });

  for (let key in answers) {
      const selected = this.querySelector(`input[name="${key}"]:checked`);
      if (selected) {
          const label = selected.parentElement;
          if (selected.value === answers[key]) {
              label.classList.add("correct");
              score++;
          } else {
              label.classList.add("incorrect");
          }
      }
  }

  const result = document.getElementById("quizResult");
  result.innerHTML = `✅ Bạn đã trả lời đúng ${score}/${total} câu.`;
});

// function showPage(pageId) {
//   const pages = document.querySelectorAll('.page');
//   pages.forEach(page => page.style.display = 'none');

//   document.getElementById(pageId).style.display = 'block';

//   const studyMaterialSection = document.getElementById('study-material-section');
//   if (pageId === 'studyMaterial') {
//       studyMaterialSection.style.display = 'block';
//   } else {
//       studyMaterialSection.style.display = 'none';
//   }
// }

// Đã xoá toàn bộ các hàm và biến animation cho trang home: drawSimulation, animateSimulation, stopAnimation, showSimulation, animationId, animationPhase, lastSimType, và đoạn tự động gọi showSimulation('am') khi vào tab Simulations ở home.
// Chỉ giữ lại animation động cho /simulations (trong DOMContentLoaded ở cuối file).

// Animation động cho /simulations

document.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy nếu có canvas đúng trên trang /simulations
    const canvas = document.getElementById('simulation-canvas');
    const typeSel = document.getElementById('modulationType');
    const carrierInp = document.getElementById('carrierFreq');
    const msgInp = document.getElementById('messageFreq');
    const ampInp = document.getElementById('amplitude');
    const pskBitsInp = document.getElementById('pskBits');
    const pskBitGroup = document.getElementById('pskBitGroup');
    const startBtn = document.getElementById('startSimBtn');
    console.log({
        canvas, typeSel, carrierInp, msgInp, ampInp, pskBitsInp, pskBitGroup, startBtn
    });
    if (!canvas || !typeSel || !carrierInp || !msgInp || !ampInp || !startBtn) {
        return;
    }
    const ctx = canvas.getContext('2d');
    let simAnimId = null;
    let simPhase = 0;

    function getSimParams() {
        const type = typeSel.value;
        const carrierFreq = parseFloat(carrierInp.value) || 10;
        const messageFreq = parseFloat(msgInp.value) || 2;
        const amplitude = parseFloat(ampInp.value) || 1;
        let pskBits = '1,0,1,1,0,0,1,0';
        if (type === 'PSK' && pskBitsInp) {
            pskBits = pskBitsInp.value;
        }
        return { type, carrierFreq, messageFreq, amplitude, pskBits };
    }

    function drawSimSignal(phaseOffset = 0) {
        const width = canvas.width;
        const height = canvas.height;
        const N = width;
        ctx.clearRect(0, 0, width, height);
        const { type, carrierFreq, messageFreq, amplitude, pskBits } = getSimParams();
        const t = Array.from({length: N}, (_, i) => i / N * 1);
        let y = [];
        if (type === 'AM') {
            y = t.map(tt => (amplitude + 0.5 * Math.sin(2 * Math.PI * messageFreq * (tt + phaseOffset))) * Math.sin(2 * Math.PI * carrierFreq * (tt + phaseOffset)));
        } else if (type === 'FM') {
            const beta = 5 / messageFreq;
            y = t.map(tt => amplitude * Math.sin(2 * Math.PI * carrierFreq * (tt + phaseOffset) + beta * Math.sin(2 * Math.PI * messageFreq * (tt + phaseOffset))));
        } else if (type === 'PSK') {
            let bits = pskBits.split(',').map(b => parseInt(b.trim()) ? 1 : 0);
            while (bits.length * (N / bits.length) < N) bits = bits.concat(bits);
            y = [];
            const br = 2;
            const bitDuration = 1 / br;
            for (let i = 0; i < N; i++) {
                const tt = t[i] + phaseOffset;
                const bitIndex = Math.floor(tt / bitDuration) % bits.length;
                const bitVal = bits[(bitIndex + bits.length) % bits.length];
                let phaseVal = 0;
                phaseVal += bitVal ? 0 : Math.PI;
                y.push(amplitude * Math.sin(2 * Math.PI * carrierFreq * tt + phaseVal));
            }
        }
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
            const yy = height / 2 - y[i] * (height / 3);
            if (i === 0) ctx.moveTo(i, yy);
            else ctx.lineTo(i, yy);
        }
        ctx.strokeStyle = '#2d2dff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function simAnimate() {
        simPhase += 0.008;
        drawSimSignal(simPhase);
        simAnimId = requestAnimationFrame(simAnimate);
    }

    function startSimAnimation() {
        if (simAnimId) cancelAnimationFrame(simAnimId);
        simPhase = 0;
        drawSimSignal(0);
        simAnimId = requestAnimationFrame(simAnimate);
    }

    if (startBtn) startBtn.onclick = startSimAnimation;
    [typeSel, carrierInp, msgInp, ampInp, pskBitsInp].forEach(el => {
        if (el && el.addEventListener) el.addEventListener('input', startSimAnimation);
    });
    if (typeSel && pskBitGroup) {
        typeSel.addEventListener('change', function() {
            pskBitGroup.style.display = this.value === 'PSK' ? '' : 'none';
        });
        pskBitGroup.style.display = typeSel.value === 'PSK' ? '' : 'none';
    }
    startSimAnimation();
});

function showModulationDetail(type) {
    const detailDiv = document.getElementById('modulation-detail');
    let html = '';
    if (type === 'am') {
        html = `
        <div class="am-theory-box" style="background:#f8fafd;border-radius:14px;padding:28px 24px 18px 24px;box-shadow:0 2px 12px #e3e8f7;max-width:750px;margin:auto;">
            <h2 style="color:#1976d2;"><i class="fas fa-wave-square"></i> Điều chế biên độ (AM)</h2>
            <p style="font-size:1.1em;">
                <b>Khái niệm:</b> <span style="color:#333">
                <b>Điều chế biên độ</b> (<b>AM</b> - <i>Amplitude Modulation</i>) là phương pháp điều chế trong đó <b>biên độ</b> của sóng mang (<i>carrier</i>) được thay đổi theo tín hiệu thông tin <b>m(t)</b> cần truyền.<br>
                <a href="https://vi.wikipedia.org/wiki/%C4%90i%E1%BB%81u_ch%E1%BA%BF_bi%C3%AAn_%C4%91%E1%BB%99" target="_blank" style="font-size:0.95em;color:#1976d2;">(Tham khảo Wikipedia)</a>
                </span>
            </p>
            <div style="margin:18px 0 12px 0;">
                <b>Nguyên lý & Công thức:</b>
                <ul style="margin:8px 0 0 0;">
                    <li>Sóng mang: <div>$$s_c(t) = A_c \\cos(2\\pi f_c t)$$</div></li>
                    <li>Tín hiệu điều chế: <div>$$m(t) = A_m \\cos(2\\pi f_m t)$$</div></li>
                    <li>Sóng AM: <div>$$s(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = A_c[1 + \\mu \\cos(2\\pi f_m t)]\\cos(2\\pi f_c t)$$</div></li>
                </ul>
                <div style="margin-top:10px;"><b>Chỉ số điều chế (hệ số điều chế):</b></div>
                <div style="text-align:center;font-size:1.2em;margin:12px 0;">$$\\mu = \\frac{A_m}{A_c}$$</div>
                <div style="font-size:0.98em;color:#555;margin-top:4px;">
                    Trong đó: \(A_m\) là biên độ cực đại của tín hiệu điều chế, \(A_c\) là biên độ sóng mang.
                </div>
            </div>
            <table style="width:100%;margin:16px 0 12px 0;background:#fff;border-radius:8px;box-shadow:0 1px 4px #e3e8f7;">
                <tr>
                    <td style="padding:8px 12px;"><b><i class="fas fa-info-circle" style="color:#1976d2"></i> Đặc điểm</b></td>
                    <td style="padding:8px 12px;">
                        Đơn giản, dễ thực hiện, máy thu rẻ, dễ sản xuất.<br>
                        Nhược điểm: Dễ bị nhiễu, hiệu suất sử dụng năng lượng thấp (chỉ ~33%), băng thông gấp đôi tín hiệu gốc.
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;"><b><i class="fas fa-broadcast-tower" style="color:#43a047"></i> Ứng dụng</b></td>
                    <td style="padding:8px 12px;">
                        Phát thanh AM (sóng trung, sóng ngắn), truyền hình analog, truyền dữ liệu không dây đơn giản.
                    </td>
                </tr>
            </table>
            <div style="margin:18px 0 10px 0;">
                <b>Ví dụ thực tế:</b>
                <ul style="margin:8px 0 0 0;">
                    <li>Nếu tín hiệu âm thanh là sóng sin 1kHz, sóng mang là 10kHz, biên độ sóng mang 1V, biên độ tín hiệu 0.5V, thì tín hiệu AM sẽ có dạng như hình dưới.</li>
                    <li>Chỉ số điều chế h = 0.5 nghĩa là biên độ sóng mang biến thiên 50% trên và dưới mức không điều chế.</li>
                </ul>
            </div>
            <div style="text-align:center;margin:18px 0 10px 0;">
                <img src="/images/am_example.gif" alt="AM Example" style="max-width:360px;border-radius:8px;box-shadow:0 1px 8px #e3e8f7;">
                <div style="font-size:0.98em;color:#666;margin-top:4px;">Biểu diễn sóng AM: biên độ sóng mang thay đổi theo tín hiệu thông tin</div>
            </div>
            <div style="text-align:center;margin:18px 0 10px 0;">
                <img src="/images/am_spectrum.gif" alt="AM Spectrum" style="max-width:360px;border-radius:8px;box-shadow:0 1px 8px #e3e8f7;">
                <div style="font-size:0.98em;color:#666;margin-top:4px;">Phổ tần số của tín hiệu AM: hai dải biên và sóng mang trung tâm</div>
            </div>
            <button onclick="closeModulationDetail()" style="margin-top:18px;background:#1976d2;color:#fff;padding:8px 24px;border:none;border-radius:6px;font-size:1.1em;box-shadow:0 1px 4px #e3e8f7;cursor:pointer;transition:background 0.2s;">Đóng</button>
        </div>
        `;
    } else if (type === 'fm') {
        html = `
        <div class="fm-theory-box" style="background:#f8fafd;border-radius:14px;padding:28px 24px 18px 24px;box-shadow:0 2px 12px #e3e8f7;max-width:750px;margin:auto;">
            <h2 style="color:#1976d2;"><i class="fas fa-broadcast-tower"></i> Điều chế tần số (FM)</h2>
            <p style="font-size:1.1em;">
                <b>Khái niệm:</b> <span style="color:#333">
                <b>Điều chế tần số</b> (<b>FM</b> - <i>Frequency Modulation</i>) là phương pháp điều chế trong đó <b>tần số</b> của sóng mang được thay đổi theo tín hiệu thông tin <b>m(t)</b> cần truyền.<br>
                <a href="https://vi.wikipedia.org/wiki/%C4%90i%E1%BB%81u_ch%E1%BA%BF_t%E1%BA%A7n_s%E1%BB%91" target="_blank" style="font-size:0.95em;color:#1976d2;">(Tham khảo Wikipedia)</a>
                </span>
            </p>
            <div style="margin:18px 0 12px 0;">
                <b>Nguyên lý & Công thức:</b>
                <ul style="margin:8px 0 0 0;">
                    <li>Sóng mang: <div>$$s_c(t) = A_c \\cos(2\\pi f_c t)$$</div></li>
                    <li>Tín hiệu điều chế: <div>$$m(t) = A_m \\cos(2\\pi f_m t)$$</div></li>
                    <li>Sóng FM: <div>$$s(t) = A_c \\cos\\left(2\\pi f_c t + 2\\pi k_f \\int_0^t m(\\tau) d\\tau\\right)$$<br>$$= A_c \\cos\\left(2\\pi f_c t + \\beta \\sin(2\\pi f_m t)\\right)$$</div></li>
                </ul>
                <div style="margin-top:10px;"><b>Chỉ số điều chế FM (hệ số điều chế):</b></div>
                <div style="text-align:center;font-size:1.2em;margin:12px 0;">$$\\beta = \\frac{\\Delta f}{f_m} = \\frac{k_f A_m}{f_m}$$</div>
                <div style="font-size:0.98em;color:#555;margin-top:4px;">
                    Trong đó: \(\\Delta f\) là độ lệch tần số cực đại, \(f_m\) là tần số tín hiệu điều chế, \(k_f\) là hằng số độ nhạy tần số.
                </div>
            </div>
            <table style="width:100%;margin:16px 0 12px 0;background:#fff;border-radius:8px;box-shadow:0 1px 4px #e3e8f7;">
                <tr>
                    <td style="padding:8px 12px;"><b><i class="fas fa-info-circle" style="color:#1976d2"></i> Đặc điểm</b></td>
                    <td style="padding:8px 12px;">
                        Chống nhiễu tốt hơn AM, chất lượng âm thanh cao.<br>
                        Nhược điểm: Băng thông rộng hơn AM, mạch thu phát phức tạp hơn.
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;"><b><i class="fas fa-broadcast-tower" style="color:#43a047"></i> Ứng dụng</b></td>
                    <td style="padding:8px 12px;">
                        Phát thanh FM, truyền hình, liên lạc vô tuyến, truyền dữ liệu không dây.
                    </td>
                </tr>
            </table>
            <div style="margin:18px 0 10px 0;">
                <b>Ví dụ thực tế:</b>
                <ul style="margin:8px 0 0 0;">
                    <li>Nếu tín hiệu âm thanh là sóng sin 1kHz, sóng mang là 10kHz, độ lệch tần số cực đại 5kHz, thì tín hiệu FM sẽ có dạng như hình dưới.</li>
                    <li>FM thường dùng trong phát thanh chất lượng cao, truyền hình, liên lạc vô tuyến.</li>
                </ul>
            </div>
            <div style="text-align:center;margin:18px 0 10px 0;">
                <img src="/images/fm_example.gif" alt="FM Example" style="max-width:360px;border-radius:8px;box-shadow:0 1px 8px #e3e8f7;">
                <div style="font-size:0.98em;color:#666;margin-top:4px;">Biểu diễn sóng FM: tần số sóng mang thay đổi theo tín hiệu thông tin</div>
            </div>
            <button onclick="closeModulationDetail()" style="margin-top:18px;background:#1976d2;color:#fff;padding:8px 24px;border:none;border-radius:6px;font-size:1.1em;box-shadow:0 1px 4px #e3e8f7;cursor:pointer;transition:background 0.2s;">Đóng</button>
        </div>
        `;
    } else if (type === 'psk') {
        html = `
        <div class="psk-theory-box" style="background:#f8fafd;border-radius:14px;padding:28px 24px 18px 24px;box-shadow:0 2px 12px #e3e8f7;max-width:750px;margin:auto;">
            <h2 style="color:#1976d2;"><i class="fas fa-random"></i> Điều chế pha (PSK)</h2>
            <p style="font-size:1.1em;"></p>
                <b>Khái niệm:</b> <span style="color:#333">
                <b>Điều chế pha</b> (PSK - <i>Phase Shift Keying</i>) là phương pháp điều chế trong đó <b>pha</b> của sóng mang được thay đổi theo dữ liệu số (bit 0/1) cần truyền.<br>
                <a href="https://vi.wikipedia.org/wiki/Phase-shift_keying" target="_blank" style="font-size:0.95em;color:#1976d2;">(Tham khảo Wikipedia)</a>
                </span>
            </p>
            <div style="margin:18px 0 12px 0;">
                <b>Nguyên lý chung:</b>
                <div style="margin:8px 0;text-align:center;">$$s(t) = A_c \\cos(2\\pi f_c t + \\varphi_k)$$</div>
                <div style="font-size:0.98em;color:#555;margin-top:4px;">
                    Trong đó: \(A_c\) là biên độ sóng mang, \(f_c\) là tần số sóng mang, \(\\varphi_k\) là pha ứng với từng giá trị bit hoặc cặp bit.
                </div>
            </div>
            <div style="margin:22px 0 0 0;">
                <h3 style="color:#1976d2;margin-bottom:8px;">BPSK (Binary Phase Shift Keying)</h3>
                <div style="margin-bottom:8px;text-align:center;">
                    <b>Công thức:</b>
                    <div style="text-align:center;">$$s(t) = A_c \\cos(2\\pi f_c t + \\varphi_k)$$</div>
                    <div style="text-align:center;">$$
                        \\varphi_k = 
                        \\begin{cases}
                        0 & \\text{cho bit 1} \\\\
                        \\pi & \\text{cho bit 0}
                        \\end{cases}
                    $$</div>
                </div>
                <div style="margin-bottom:8px;">
                    <b>Lý thuyết:</b> BPSK là dạng đơn giản nhất của PSK, mỗi bit dữ liệu được mã hóa bằng 1 trong 2 pha: 0 hoặc \(\\pi\) (180°). Khi bit thay đổi, pha sóng mang "lật" 180°.
                </div>
                <div style="margin-bottom:8px;">
                    <b>Ví dụ:</b> Dãy bit <code>1 0 1 1 0</code> sẽ tạo ra sóng mang có pha lần lượt là 0, \(\\pi\), 0, 0, \(\\pi\).
                </div>
                <div style="text-align:center;margin:10px 0 0 0;">
                    <img src="/images/bpsk_example.png" alt="BPSK Example" style="max-width:320px;border-radius:6px;box-shadow:0 1px 6px #e3e8f7;">
                    <div style="font-size:0.95em;color:#666;margin-top:4px;">Biểu diễn sóng BPSK</div>
                </div>
            </div>
            <div style="margin:32px 0 0 0;">
                <h3 style="color:#1976d2;margin-bottom:8px;">QPSK (Quadrature Phase Shift Keying)</h3>
                <div style="margin-bottom:8px;text-align:center;">
                    <b>Công thức:</b>
                    <div style="text-align:center;">$$s(t) = A_c \\cos(2\\pi f_c t + \\varphi_k)$$</div>
                    <div style="text-align:center;">$$
                        \\varphi_k = 
                        \\begin{cases}
                        0 & \\text{cho 00} \\\\
                        \\frac{\\pi}{2} & \\text{cho 01} \\\\
                        \\pi & \\text{cho 11} \\\\
                        \\frac{3\\pi}{2} & \\text{cho 10}
                        \\end{cases}
                    $$</div>
                </div>
                <div style="margin-bottom:8px;">
                    <b>Lý thuyết:</b> QPSK mã hóa 2 bit trên mỗi ký hiệu, sử dụng 4 pha khác nhau. Nhờ đó tốc độ truyền dữ liệu gấp đôi BPSK trên cùng băng thông.
                </div>
                <div style="margin-bottom:8px;">
                    <b>Ví dụ:</b> Cặp bit <code>00, 01, 11, 10</code> ứng với các pha: \(0\), \(\\frac{\\pi}{2}\), \(\\pi\), \(\\frac{3\\pi}{2}\).
                </div>
                <div style="text-align:center;margin:10px 0 0 0;">
                    <img src="/images/qpsk_example.jpg" alt="QPSK Example" style="max-width:320px;border-radius:6px;box-shadow:0 1px 6px #e3e8f7;">
                    <div style="font-size:0.95em;color:#666;margin-top:4px;">Biểu diễn sóng QPSK</div>
                </div>
            </div>
            <table style="width:100%;margin:32px 0 12px 0;background:#fff;border-radius:8px;box-shadow:0 1px 4px #e3e8f7;">
                <tr>
                    <td style="padding:8px 12px;"><b><i class="fas fa-info-circle" style="color:#1976d2"></i> Đặc điểm</b></td>
                    <td style="padding:8px 12px;">
                        Hiệu quả băng thông cao, chống nhiễu tốt hơn ASK.<br>
                        Có thể mở rộng lên nhiều mức pha (8-PSK, 16-PSK...) để tăng tốc độ truyền.
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 12px;"><b><i class="fas fa-broadcast-tower" style="color:#43a047"></i> Ứng dụng</b></td>
                    <td style="padding:8px 12px;">
                        Truyền thông số, WiFi, Bluetooth, truyền hình vệ tinh, RFID, truyền dữ liệu tốc độ cao.
                    </td>
                </tr>
            </table>
            <button onclick="closeModulationDetail()" style="margin-top:18px;background:#1976d2;color:#fff;padding:8px 24px;border:none;border-radius:6px;font-size:1.1em;box-shadow:0 1px 4px #e3e8f7;cursor:pointer;transition:background 0.2s;">Đóng</button>
        </div>
        `;
    }
    detailDiv.innerHTML = html;
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({behavior: "smooth"});
    if (window.MathJax && window.MathJax.typeset) {
        MathJax.typeset();
    }
}

function closeModulationDetail() {
    const detailDiv = document.getElementById('modulation-detail');
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = '';
}

function showEncodingDetail(type) {
    const detailDiv = document.getElementById('encoding-detail');
    let html = '';
    if (type === 'nrz') {
        html = `
            <h3>NRZ (Non-Return to Zero)</h3>
            <p><b>Khái niệm:</b> NRZ là phương pháp mã hóa tín hiệu số trong đó mức logic 1 và 0 được biểu diễn bằng hai mức điện áp khác nhau, không trở về 0 giữa các bit.</p>
            <ul>
                <li><b>NRZ-L:</b> 1 và 0 ứng với hai mức điện áp khác nhau.</li>
                <li><b>NRZ-I:</b> Đổi mức điện áp khi gặp bit 1, giữ nguyên khi gặp bit 0.</li>
            </ul>
            <p><b>Ưu điểm:</b> Đơn giản, dễ thực hiện. <b>Nhược điểm:</b> Dễ mất đồng bộ khi chuỗi bit giống nhau kéo dài.</p>
            <button onclick="closeEncodingDetail()">Đóng</button>
        `;
    } else if (type === 'manchester') {
        html = `
            <h3>Manchester</h3>
            <p><b>Khái niệm:</b> Manchester là phương pháp mã hóa tín hiệu số trong đó mỗi bit có một chuyển mức ở giữa:</p>
            <ul>
                <li>Bit 0: chuyển từ cao xuống thấp (1 \rightarrow 0)</li>
                <li>Bit 1: chuyển từ thấp lên cao (0 \rightarrow 1)</li>
            </ul>
            <p><b>Ưu điểm:</b> Dễ đồng bộ, chống nhiễu tốt. <b>Nhược điểm:</b> Băng thông sử dụng gấp đôi tốc độ bit.</p>
            <button onclick="closeEncodingDetail()">Đóng</button>
        `;
    } else if (type === 'bipolar') {
        html = `
            <h3>Bipolar (AMI)</h3>
            <p><b>Khái niệm:</b> AMI (Alternate Mark Inversion) là phương pháp mã hóa trong đó:</p>
            <ul>
                <li>Bit 0: mức 0V</li>
                <li>Bit 1: luân phiên +V và -V</li>
            </ul>
            <p><b>Ưu điểm:</b> Giảm thành phần DC, dễ phát hiện lỗi. <b>Nhược điểm:</b> Dễ mất đồng bộ nếu chuỗi 0 kéo dài.</p>
            <button onclick="closeEncodingDetail()">Đóng</button>
        `;
    }
    detailDiv.innerHTML = html;
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({behavior: "smooth"});
}

function closeEncodingDetail() {
    const detailDiv = document.getElementById('encoding-detail');
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = '';
}

function showCorrectionDetail(type) {
    const detailDiv = document.getElementById('correction-detail');
    let html = '';
    if (type === 'parity') {
        html = `
            <h3>Parity Bit (Bit chẵn lẻ)</h3>
            <p><b>Khái niệm:</b> Thêm 1 bit vào cuối mỗi từ dữ liệu để kiểm tra tính chẵn/lẻ tổng số bit 1.</p>
            <ul>
                <li><b>Parity chẵn:</b> Tổng số bit 1 là chẵn.</li>
                <li><b>Parity lẻ:</b> Tổng số bit 1 là lẻ.</li>
            </ul>
            <p><b>Ưu điểm:</b> Đơn giản, phát hiện lỗi đơn bit. <b>Nhược điểm:</b> Không sửa được lỗi, không phát hiện được lỗi chẵn bit.</p>
            <button onclick="closeCorrectionDetail()">Đóng</button>
        `;
    } else if (type === 'crc') {
        html = `
            <h3>CRC (Cyclic Redundancy Check)</h3>
            <p><b>Khái niệm:</b> CRC sử dụng phép chia đa thức để phát hiện lỗi trong dữ liệu truyền đi.</p>
            <ul>
                <li>Thêm chuỗi kiểm tra (checksum) vào cuối khung dữ liệu.</li>
                <li>Phát hiện được nhiều loại lỗi phức tạp.</li>
            </ul>
            <p><b>Ưu điểm:</b> Độ tin cậy cao, dùng rộng rãi trong mạng máy tính, lưu trữ dữ liệu.</p>
            <button onclick="closeCorrectionDetail()">Đóng</button>
        `;
    } else if (type === 'hamming') {
        html = `
            <h3>Hamming Code</h3>
            <p><b>Khái niệm:</b> Hamming code là mã sửa lỗi có thể phát hiện và sửa lỗi 1 bit.</p>
            <ul>
                <li>Thêm các bit kiểm tra vào vị trí xác định trong dữ liệu.</li>
                <li>Phát hiện và sửa lỗi đơn bit.</li>
            </ul>
            <p><b>Ứng dụng:</b> Bộ nhớ RAM, truyền thông số.</p>
            <button onclick="closeCorrectionDetail()">Đóng</button>
        `;
    }
    detailDiv.innerHTML = html;
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({behavior: "smooth"});
}

function closeCorrectionDetail() {
    const detailDiv = document.getElementById('correction-detail');
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = '';
}

function showTransmissionDetail(type) {
    const detailDiv = document.getElementById('transmission-detail');
    let html = '';
    if (type === 'baseband') {
        html = `
            <h3>Baseband Transmission</h3>
            <p><b>Khái niệm:</b> Truyền tín hiệu số trực tiếp trên kênh vật lý mà không điều chế lên sóng mang.</p>
            <ul>
                <li>Ứng dụng: Ethernet, USB.</li>
                <li>Chỉ dùng cho khoảng cách ngắn, tốc độ cao.</li>
            </ul>
            <button onclick="closeTransmissionDetail()">Đóng</button>
        `;
    } else if (type === 'broadband') {
        html = `
            <h3>Broadband Transmission</h3>
            <p><b>Khái niệm:</b> Điều chế tín hiệu số lên sóng mang để truyền trên nhiều kênh tần số khác nhau.</p>
            <ul>
                <li>Ứng dụng: Truyền hình cáp, ADSL.</li>
                <li>Truyền được khoảng cách xa, nhiều kênh song song.</li>
            </ul>
            <button onclick="closeTransmissionDetail()">Đóng</button>
        `;
    } else if (type === 'bitrate') {
        html = `
            <h3>Bit Rate & Bandwidth</h3>
            <p><b>Bit Rate:</b> Số bit truyền trong 1 giây (bps).</p>
            <p><b>Bandwidth:</b> Dải tần số mà tín hiệu chiếm dụng trên kênh truyền.</p>
            <ul>
                <li><b>BER (Bit Error Rate):</b> Xác suất bit bị lỗi khi truyền.</li>
                <li><b>Ý nghĩa:</b> Ảnh hưởng đến chất lượng và tốc độ truyền dữ liệu.</li>
            </ul>
            <button onclick="closeTransmissionDetail()">Đóng</button>
        `;
    }
    detailDiv.innerHTML = html;
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({behavior: "smooth"});
}

function closeTransmissionDetail() {
    const detailDiv = document.getElementById('transmission-detail');
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = '';
}
