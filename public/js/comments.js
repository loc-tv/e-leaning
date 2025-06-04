document.addEventListener('DOMContentLoaded', function() {
    // Tìm tất cả các vùng comment trên trang (có thể có nhiều tabId khác nhau)
    const commentSections = document.querySelectorAll('.comments-section');
    commentSections.forEach(section => {
        // Lấy tabId từ form id
        const form = section.querySelector('form[id^="commentForm-"]');
        if (!form) return;
        const tabId = form.id.replace('commentForm-', '');
        // Lấy userId từ 1 input ẩn hoặc từ window.currentUserId nếu có
        let currentUserId = null;
        if (window.currentUserId) {
            currentUserId = String(window.currentUserId);
        } else {
            // Thử lấy từ data attribute nếu có
            const userIdInput = document.getElementById('currentUserId');
            if (userIdInput) currentUserId = String(userIdInput.value);
        }
        // Nếu không có userId, thử lấy từ script nhúng (nếu có)
        if (!currentUserId && window.user && window.user.id) {
            currentUserId = String(window.user.id);
        }

        // Hàm load comment
        async function loadComments() {
            const response = await fetch(`/api/v1/comments?tabId=${tabId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            const commentsList = section.querySelector(`#commentsList-${tabId}`);
            commentsList.innerHTML = (data.data || []).map(comment => `
                <div class="comment" data-id="${comment.id}">
                    <b>${comment.username}</b> <span>${new Date(comment.created_at).toLocaleString()}</span>
                    <div>${comment.content}</div>
                    ${
                        (String(comment.user_id) === currentUserId ? `<button onclick=\"editComment(${comment.id}, ${tabId})\">Sửa</button>` : '') +
                        ((String(comment.user_id) === currentUserId || window.currentUserRole === 'admin') ? `<button onclick=\"deleteComment(${comment.id}, ${tabId})\">Xóa</button>` : '')
                    }
                </div>
            `).join('');
        }

        // Gán hàm submit cho form
        form.onsubmit = async function(event) {
            event.preventDefault();
            const textarea = section.querySelector(`#commentContent-${tabId}`);
            const content = textarea.value;
            await fetch('/api/v1/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ tabId, content })
            });
            textarea.value = '';
            loadComments();
        };

        // Đưa các hàm edit/delete lên window để gọi từ HTML
        window.editComment = function(commentId, tabId) {
            // Hiện modal
            const modal = document.getElementById('editCommentModal');
            const textarea = document.getElementById('editCommentContent');
            modal.style.display = 'flex';
            // Lấy nội dung cũ
            const commentDiv = document.querySelector(`.comment[data-id="${commentId}"] div`);
            textarea.value = commentDiv ? commentDiv.textContent : '';

            // Xử lý nút Lưu
            document.getElementById('saveEditBtn').onclick = async function() {
                const newContent = textarea.value.trim();
                if (!newContent) return;
                try {
                    const res = await fetch(`/api/v1/comments/${commentId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ content: newContent })
                    });
                    const data = await res.json();
                    if (!data.success) {
                        alert(data.message || 'Không thể sửa bình luận');
                    }
                    modal.style.display = 'none';
                    textarea.value = '';
                    loadComments();
                } catch (err) {
                    alert('Lỗi khi sửa bình luận');
                    console.error(err);
                }
            };

            // Xử lý nút Hủy
            document.getElementById('cancelEditBtn').onclick = function() {
                modal.style.display = 'none';
                textarea.value = '';
            };
        };

        window.deleteComment = function(commentId, tabId) {
            // Hiện modal xác nhận xoá
            const modal = document.getElementById('deleteCommentModal');
            modal.style.display = 'flex';

            // Xử lý nút Xoá
            document.getElementById('confirmDeleteBtn').onclick = async function() {
                try {
                    const res = await fetch(`/api/v1/comments/${commentId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    const data = await res.json();
                    if (!data.success) {
                        alert(data.message || 'Không thể xóa bình luận');
                    }
                    modal.style.display = 'none';
                    loadComments();
                } catch (err) {
                    alert('Lỗi khi xóa bình luận');
                    console.error(err);
                }
            };

            // Xử lý nút Hủy
            document.getElementById('cancelDeleteBtn').onclick = function() {
                modal.style.display = 'none';
            };
        };

        // Lần đầu load comment
        loadComments();
    });
}); 