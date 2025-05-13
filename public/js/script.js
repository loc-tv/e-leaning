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

function showSimulation(type) {
    const paramsDiv = document.getElementById('simulation-params');
    let html = '';
    if (type === 'am') {
        html = `
            <div class="sim-param-group">
                <label>Biên độ sóng mang (A<sub>c</sub>)</label>
                <input type="number" id="am_Ac" min="0" max="5" step="0.1" value="1">
            </div>
            <div class="sim-param-group">
                <label>Tần số sóng mang (f<sub>c</sub>) [Hz]</label>
                <input type="number" id="am_fc" min="1" max="100" step="1" value="10">
            </div>
            <div class="sim-param-group">
                <label>Biên độ tín hiệu (A<sub>m</sub>)</label>
                <input type="number" id="am_Am" min="0" max="5" step="0.1" value="0.5">
            </div>
            <div class="sim-param-group">
                <label>Tần số tín hiệu (f<sub>m</sub>) [Hz]</label>
                <input type="number" id="am_fm" min="1" max="20" step="1" value="2">
            </div>
            <div class="sim-param-group">
                <label>Pha sóng mang (φ<sub>c</sub>) [rad]</label>
                <input type="number" id="am_phi" min="0" max="6.28" step="0.01" value="0">
            </div>
        `;
    } else if (type === 'fm') {
        html = `
            <div class="sim-param-group">
                <label>Biên độ sóng mang (A<sub>c</sub>)</label>
                <input type="number" id="fm_Ac" min="0" max="5" step="0.1" value="1">
            </div>
            <div class="sim-param-group">
                <label>Tần số sóng mang (f<sub>c</sub>) [Hz]</label>
                <input type="number" id="fm_fc" min="1" max="100" step="1" value="10">
            </div>
            <div class="sim-param-group">
                <label>Biên độ tín hiệu (A<sub>m</sub>)</label>
                <input type="number" id="fm_Am" min="0" max="5" step="0.1" value="0.5">
            </div>
            <div class="sim-param-group">
                <label>Tần số tín hiệu (f<sub>m</sub>) [Hz]</label>
                <input type="number" id="fm_fm" min="1" max="20" step="1" value="2">
            </div>
            <div class="sim-param-group">
                <label>Độ lệch tần số (Δf) [Hz]</label>
                <input type="number" id="fm_df" min="0" max="50" step="0.1" value="5">
            </div>
            <div class="sim-param-group">
                <label>Pha sóng mang (φ<sub>c</sub>) [rad]</label>
                <input type="number" id="fm_phi" min="0" max="6.28" step="0.01" value="0">
            </div>
        `;
    } else if (type === 'psk') {
        html = `
            <div class="sim-param-group">
                <label>Biên độ sóng mang (A<sub>c</sub>)</label>
                <input type="number" id="psk_Ac" min="0" max="5" step="0.1" value="1">
            </div>
            <div class="sim-param-group">
                <label>Tần số sóng mang (f<sub>c</sub>) [Hz]</label>
                <input type="number" id="psk_fc" min="1" max="100" step="1" value="10">
            </div>
            <div class="sim-param-group">
                <label>Tốc độ bit (bit rate) [bps]</label>
                <input type="number" id="psk_br" min="1" max="20" step="1" value="2">
            </div>
            <div class="sim-param-group">
                <label>Số mức pha (M)</label>
                <select id="psk_M">
                    <option value="2">BPSK (2)</option>
                    <option value="4">QPSK (4)</option>
                    <option value="8">8-PSK (8)</option>
                </select>
            </div>
            <div class="sim-param-group">
                <label>Pha ban đầu (φ<sub>c</sub>) [rad]</label>
                <input type="number" id="psk_phi" min="0" max="6.28" step="0.01" value="0">
            </div>
            <div class="sim-param-group" style="min-width:260px;">
                <label>Dãy bit (0/1, cách nhau bởi dấu phẩy)</label>
                <input type="text" id="psk_bits" value="1,0,1,1,0,0,1,0">
            </div>
        `;
    }
    paramsDiv.innerHTML = html;
    paramsDiv.querySelectorAll('input, select').forEach(input => {
        input.oninput = () => drawSimulation(type);
    });
    drawSimulation(type);

    // Đổi trạng thái active cho nút
    document.querySelectorAll('.simulation-controls button').forEach(btn => btn.classList.remove('active'));
    if (type === 'am') document.querySelector('.simulation-controls button:nth-child(1)').classList.add('active');
    if (type === 'fm') document.querySelector('.simulation-controls button:nth-child(2)').classList.add('active');
    if (type === 'psk') document.querySelector('.simulation-controls button:nth-child(3)').classList.add('active');
}

function drawSimulation(type) {
    const canvas = document.getElementById('simulation-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const N = width;
    const t = Array.from({length: N}, (_, i) => i / N * 1); // 1 giây

    let y = [];
    if (type === 'am') {
        const Ac = parseFloat(document.getElementById('am_Ac').value);
        const fc = parseFloat(document.getElementById('am_fc').value);
        const Am = parseFloat(document.getElementById('am_Am').value);
        const fm = parseFloat(document.getElementById('am_fm').value);
        const phi = parseFloat(document.getElementById('am_phi').value);
        y = t.map(tt => (Ac + Am * Math.sin(2 * Math.PI * fm * tt)) * Math.sin(2 * Math.PI * fc * tt + phi));
    } else if (type === 'fm') {
        const Ac = parseFloat(document.getElementById('fm_Ac').value);
        const fc = parseFloat(document.getElementById('fm_fc').value);
        const Am = parseFloat(document.getElementById('fm_Am').value);
        const fm = parseFloat(document.getElementById('fm_fm').value);
        const df = parseFloat(document.getElementById('fm_df').value);
        const phi = parseFloat(document.getElementById('fm_phi').value);
        // Chỉ số điều chế beta = Δf / f_m
        const beta = df / fm;
        y = t.map(tt => Ac * Math.sin(2 * Math.PI * fc * tt + beta * Math.sin(2 * Math.PI * fm * tt) + phi));
    } else if (type === 'psk') {
        const Ac = parseFloat(document.getElementById('psk_Ac').value);
        const fc = parseFloat(document.getElementById('psk_fc').value);
        const br = parseFloat(document.getElementById('psk_br').value);
        const M = parseInt(document.getElementById('psk_M').value);
        const phi = parseFloat(document.getElementById('psk_phi').value);
        let bits = document.getElementById('psk_bits').value.split(',').map(b => parseInt(b.trim()) ? 1 : 0);
        // Lặp lại bits nếu chưa đủ cho toàn bộ t
        while (bits.length * (N / bits.length) < N) bits = bits.concat(bits);
        // Tạo sóng PSK
        y = [];
        const bitDuration = 1 / br;
        for (let i = 0; i < N; i++) {
            const tt = t[i];
            const bitIndex = Math.floor(tt / bitDuration) % bits.length;
            const bitVal = bits[bitIndex];
            // Pha cho từng mức
            let phase = phi;
            if (M === 2) { // BPSK
                phase += bitVal ? 0 : Math.PI;
            } else if (M === 4) { // QPSK
                phase += bitVal ? 0 : Math.PI / 2;
            } else if (M === 8) { // 8-PSK
                phase += (bitVal % 8) * (Math.PI / 4);
            }
            y.push(Ac * Math.sin(2 * Math.PI * fc * tt + phase));
        }
    }

    // Vẽ sóng
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
        const yy = height / 2 - y[i] * (height / 3);
        if (i === 0) ctx.moveTo(i, yy);
        else ctx.lineTo(i, yy);
    }
    ctx.strokeStyle = "#2d2dff";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function showModulationDetail(type) {
    const detailDiv = document.getElementById('modulation-detail');
    let html = '';
    if (type === 'am') {
        html = `
            <h3>Điều chế AM (Amplitude Modulation)</h3>
            <p><b>Khái niệm:</b> Điều chế biên độ (AM) là phương pháp điều chế trong đó biên độ của sóng mang được thay đổi theo tín hiệu thông tin.</p>
            <p><b>Phương trình:</b> <br>
                <code>s(t) = [A_c + A_m \u22C5 sin(2\u03C0 f_m t)] \u22C5 sin(2\u03C0 f_c t)</code>
            </p>
            <p><b>Ví dụ:</b> Nếu tín hiệu âm thanh là sóng sin 1kHz, sóng mang là 10kHz, biên độ sóng mang 1V, biên độ tín hiệu 0.5V, thì tín hiệu AM sẽ có dạng như hình dưới.</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Amfm3-en-de.gif" alt="AM Example" style="max-width:320px;display:block;margin:12px 0;">
            <ul>
                <li><b>Ứng dụng:</b> Phát thanh AM, truyền hình analog, truyền dữ liệu đơn giản.</li>
            </ul>
            <button onclick="closeModulationDetail()">Đóng</button>
        `;
    } else if (type === 'fm') {
        html = `
            <h3>Điều chế FM (Frequency Modulation)</h3>
            <p><b>Khái niệm:</b> Điều chế tần số (FM) là phương pháp điều chế trong đó tần số của sóng mang được thay đổi theo tín hiệu thông tin.</p>
            <p><b>Phương trình:</b> <br>
                <code>s(t) = A_c \u22C5 sin(2\u03C0 f_c t + \u03B2 sin(2\u03C0 f_m t))</code> <br>
                với <b>\u03B2 = \u0394f / f_m</b> là chỉ số điều chế.
            </p>
            <p><b>Ví dụ:</b> Nếu tín hiệu âm thanh là sóng sin 1kHz, sóng mang là 10kHz, độ lệch tần số 5kHz, thì tín hiệu FM sẽ có dạng như hình dưới.</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Amfm3-en-de.gif" alt="FM Example" style="max-width:320px;display:block;margin:12px 0;object-fit:contain;">
            <ul>
                <li><b>Ứng dụng:</b> Phát thanh FM, truyền hình, truyền dữ liệu không dây.</li>
            </ul>
            <button onclick="closeModulationDetail()">Đóng</button>
        `;
    } else if (type === 'psk') {
        html = `
            <h3>Điều chế PSK (Phase Shift Keying)</h3>
            <p><b>Khái niệm:</b> Điều chế pha (PSK) là phương pháp điều chế trong đó pha của sóng mang được thay đổi theo tín hiệu số (bit 0/1).</p>
            <p><b>Phương trình:</b> <br>
                <code>s(t) = A_c \u22C5 sin(2\u03C0 f_c t + \u03C6_k)</code> <br>
                với <b>\u03C6_k</b> là pha ứng với từng giá trị bit.
            </p>
            <p><b>Ví dụ:</b> Với BPSK, bit 0 ứng với pha 0, bit 1 ứng với pha π. Sóng PSK sẽ có dạng như hình dưới.</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Binary_phase-shift_keying.png" alt="PSK Example" style="max-width:320px;display:block;margin:12px 0;">
            <ul>
                <li><b>Ứng dụng:</b> Truyền thông số, WiFi, Bluetooth, vệ tinh, 4G/5G.</li>
            </ul>
            <button onclick="closeModulationDetail()">Đóng</button>
        `;
    }
    detailDiv.innerHTML = html;
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({behavior: "smooth"});
}

function closeModulationDetail() {
    const detailDiv = document.getElementById('modulation-detail');
    detailDiv.style.display = 'none';
    detailDiv.innerHTML = '';
}

// Tự động hiển thị AM khi vào tab Simulations
document.addEventListener('DOMContentLoaded', function() {
    // Nếu tab Simulations đang hiển thị thì showSimulation('am')
    if (document.getElementById('simulations').style.display !== 'none') {
        showSimulation('am');
    }
});
