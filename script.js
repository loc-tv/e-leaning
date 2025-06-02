// Main functionality code
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // Detail view functionality
    function showDetail(content) {
        const detailContent = document.getElementById('detailContent');
        const detailModal = document.getElementById('detailModal');
        if (detailContent && detailModal) {
            detailContent.innerHTML = content;
            detailModal.style.display = 'block';
        }
    }

    // Close modal functionality
    const closeButtons = document.querySelectorAll('.close');
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        if (modals.length > 0) {
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });

    // Detail view functions for each section
    window.showModulationDetail = function(type) {
        const contentElem = document.getElementById(`${type}Content`);
        if (contentElem) {
            showDetail(contentElem.innerHTML);
        }
    };

    window.showEncodingDetail = function(type) {
        const contentElem = document.getElementById(`${type}EncodingContent`);
        if (contentElem) {
            showDetail(contentElem.innerHTML);
        }
    };

    window.showCorrectionDetail = function(type) {
        const contentElem = document.getElementById(`${type}CorrectionContent`);
        if (contentElem) {
            showDetail(contentElem.innerHTML);
        }
    };

    window.showTransmissionDetail = function(type) {
        const contentElem = document.getElementById(`${type}TransmissionContent`);
        if (contentElem) {
            showDetail(contentElem.innerHTML);
        }
    };

    // Quiz form event listener (safe for all pages)
    const quizForm = document.getElementById("quizForm");
    if (quizForm) {
        quizForm.addEventListener("submit", function(e) {
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
            if (result) {
                result.innerHTML = `✅ Bạn đã trả lời đúng ${score}/${total} câu.`;
            }
        });
    }
}); 