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
            <h3>Điều chế AM (Amplitude Modulation)</h3>
            <p><b>Khái niệm:</b> Điều chế biên độ (AM) là phương pháp điều chế trong đó biên độ của sóng mang (carrier) được thay đổi theo tín hiệu thông tin (tín hiệu cần truyền).</p>
            <p><b>Nguyên lý:</b><br>
                Sóng mang: <code>s<sub>c</sub>(t) = A<sub>c</sub> \cdot \sin(2\pi f<sub>c</sub> t)</code><br>
                Tín hiệu điều chế: <code>m(t)</code><br>
                Sóng AM: <code>s(t) = [A<sub>c</sub> + m(t)] \cdot \sin(2\pi f<sub>c</sub> t)</code>
            </p>
            <ul>
                <li><b>Đặc điểm:</b> Đơn giản, dễ thực hiện. Nhược điểm: dễ bị nhiễu, hiệu suất sử dụng băng thông và năng lượng thấp.</li>
                <li><b>Ứng dụng:</b> Phát thanh AM, truyền hình analog.</li>
            </ul>
            <p><b>Ví dụ:</b> Nếu tín hiệu âm thanh là sóng sin 1kHz, sóng mang là 10kHz, biên độ sóng mang 1V, biên độ tín hiệu 0.5V, thì tín hiệu AM sẽ có dạng như hình dưới.</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Amfm3-en-de.gif" alt="AM Example" style="max-width:320px;display:block;margin:12px 0;">
            <button onclick="closeModulationDetail()">Đóng</button>
        `;
    } else if (type === 'fm') {
        html = `
            <h3>Điều chế FM (Frequency Modulation)</h3>
            <p><b>Khái niệm:</b> Điều chế tần số (FM) là phương pháp điều chế trong đó tần số của sóng mang được thay đổi theo tín hiệu thông tin.</p>
            <p><b>Nguyên lý:</b><br>
                Sóng mang: <code>s<sub>c</sub>(t) = A<sub>c</sub> \cdot \sin(2\pi f<sub>c</sub> t)</code><br>
                Sóng FM: <code>s(t) = A<sub>c</sub> \cdot \sin[2\pi f<sub>c</sub> t + 2\pi k_f \int m(\tau) d\tau]</code><br>
                <span style="font-size:0.98em;">với <b>k<sub>f</sub></b> là hệ số điều chế tần số, <b>m(t)</b> là tín hiệu thông tin.</span>
            </p>
            <ul>
                <li><b>Đặc điểm:</b> Chống nhiễu tốt hơn AM. Băng thông rộng hơn AM.</li>
                <li><b>Ứng dụng:</b> Phát thanh FM, truyền hình, liên lạc vô tuyến.</li>
            </ul>
            <p><b>Ví dụ:</b> Nếu tín hiệu âm thanh là sóng sin 1kHz, sóng mang là 10kHz, độ lệch tần số 5kHz, thì tín hiệu FM sẽ có dạng như hình dưới.</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Amfm3-en-de.gif" alt="FM Example" style="max-width:320px;display:block;margin:12px 0;object-fit:contain;">
            <button onclick="closeModulationDetail()">Đóng</button>
        `;
    } else if (type === 'psk') {
        html = `
            <h3>Điều chế PSK (Phase Shift Keying)</h3>
            <p><b>Khái niệm:</b> Điều chế pha (PSK) là phương pháp điều chế trong đó pha của sóng mang được thay đổi theo dữ liệu số (bit 0/1).</p>
            <p><b>Nguyên lý:</b><br>
                Sóng PSK: <code>s(t) = A<sub>c</sub> \cdot \sin(2\pi f<sub>c</sub> t + \varphi<sub>k</sub>)</code><br>
                <span style="font-size:0.98em;">với <b>\varphi<sub>k</sub></b> là pha ứng với từng giá trị bit.</span>
            </p>
            <ul>
                <li><b>Các loại PSK phổ biến:</b>
                    <ul>
                        <li><b>BPSK (Binary PSK):</b> Bit 0: pha 0, Bit 1: pha π.</li>
                        <li><b>QPSK (Quadrature PSK):</b> Mỗi ký hiệu biểu diễn 2 bit, sử dụng 4 pha khác nhau.</li>
                    </ul>
                </li>
                <li><b>Đặc điểm:</b> Hiệu quả băng thông cao. Khả năng chống nhiễu tốt hơn ASK.</li>
                <li><b>Ứng dụng:</b> Truyền thông số, WiFi, Bluetooth, vệ tinh.</li>
            </ul>
            <p><b>Ví dụ:</b> Với BPSK, bit 0 ứng với pha 0, bit 1 ứng với pha π. Sóng PSK sẽ có dạng như hình dưới.</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Binary_phase-shift_keying.png" alt="PSK Example" style="max-width:320px;display:block;margin:12px 0;">
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
                <li>Bit 0: chuyển từ cao xuống thấp (1 → 0)</li>
                <li>Bit 1: chuyển từ thấp lên cao (0 → 1)</li>
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
