import Issue from '../models/Issue.js';
import Project from '../models/Project.js';

export const createIssue = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, severity } = req.body;

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const issueCount = await Issue.countDocuments();
    const issueId = `ISS${issueCount + 1}`;

    const issue = new Issue({
      issueId,
      title,
      description,
      project: project._id,
      assignedTo: assignedTo || null,
      reportedBy: req.user.id,
      priority: priority || 'medium',
      severity: severity || 'major'
    });

    await issue.save();
    await issue.populate('project assignedTo reportedBy');

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const { status, priority, severity, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severity) query.severity = severity;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('project assignedTo reportedBy')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Issues fetched successfully',
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: issues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findOne({ issueId: req.params.issueId })
      .populate('project assignedTo reportedBy');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue fetched successfully',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { title, description, priority, severity } = req.body;

    const issue = await Issue.findOne({ issueId: req.params.issueId });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (priority) issue.priority = priority;
    if (severity) issue.severity = severity;

    await issue.save();
    await issue.populate('project assignedTo reportedBy');

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({ issueId: req.params.issueId });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const assignIssue = async (req, res) => {
  try {
    const { userId } = req.body;

    const issue = await Issue.findOne({ issueId: req.params.issueId });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    issue.assignedTo = userId;
    await issue.save();
    await issue.populate('project assignedTo reportedBy');

    res.status(200).json({
      success: true,
      message: 'Issue assigned successfully',
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findOne({ issueId: req.params.issueId });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const previousStatus = issue.status;
    issue.status = status;
    await issue.save();

    res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      data: {
        issueId: issue.issueId,
        previousStatus,
        newStatus: status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
