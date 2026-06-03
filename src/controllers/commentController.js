import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';

export const createComment = async (req, res) => {
  try {
    const { issueId, message } = req.body;

    const issue = await Issue.findOne({ issueId });
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const commentCount = await Comment.countDocuments();
    const commentId = `COM${commentCount + 1}`;

    const comment = new Comment({
      commentId,
      issue: issue._id,
      user: req.user.id,
      message
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { issueId, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (issueId) {
      const issue = await Issue.findOne({ issueId });
      if (issue) query.issue = issue._id;
    }
    if (search) query.message = { $regex: search, $options: 'i' };

    const total = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate('issue user')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Comments fetched successfully',
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findOne({ commentId: req.params.commentId })
      .populate('issue user');

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment fetched successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ commentId: req.params.commentId });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
