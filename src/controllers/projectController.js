import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  try {
    const { title, category, description, members } = req.body;

    const projectCount = await Project.countDocuments();
    const projectId = `PROJ${projectCount + 1}`;

    const owner = await User.findById(req.user.id);

    const project = new Project({
      projectId,
      title,
      category,
      description,
      owner: req.user.id,
      members: members || [req.user.id]
    });

    await project.save();
    await project.populate('owner members');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { status, owner, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (owner) {
      const ownerUser = await User.findOne({ name: { $regex: owner, $options: 'i' } });
      if (ownerUser) query.owner = ownerUser._id;
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('owner members')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId })
      .populate('owner members');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, status, members } = req.body;

    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (members) project.members = members;

    await project.save();
    await project.populate('owner members');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
