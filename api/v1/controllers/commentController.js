const CommentModel = require('../../../models/commentModel');

exports.createComment = async (req, res) => {
    const { tabId, content } = req.body;
    const userId = req.user.id;
    if (!tabId || !content) return res.status(400).json({ success: false, message: 'Missing tabId or content' });
    const commentId = await CommentModel.create(userId, tabId, content);
    res.status(201).json({ success: true, commentId });
};

exports.getComments = async (req, res) => {
    const { tabId } = req.query;
    if (!tabId) return res.status(400).json({ success: false, message: 'Missing tabId' });
    const comments = await CommentModel.getByTabId(tabId);
    res.json({ success: true, data: comments });
};

exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const success = await CommentModel.update(commentId, userId, content);
    if (!success) return res.status(403).json({ success: false, message: 'Not allowed' });
    res.json({ success: true });
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const success = await CommentModel.delete(commentId, userId);
    if (!success) return res.status(403).json({ success: false, message: 'Not allowed' });
    res.json({ success: true });
};
