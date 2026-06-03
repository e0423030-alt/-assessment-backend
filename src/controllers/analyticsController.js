import Issue from '../models/Issue.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getIssueAnalytics = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const openIssues = await Issue.countDocuments({ status: 'open' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });
    const testingIssues = await Issue.countDocuments({ status: 'testing' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const closedIssues = await Issue.countDocuments({ status: 'closed' });

    res.status(200).json({
      success: true,
      message: 'Issue analytics fetched successfully',
      data: {
        totalIssues,
        openIssues,
        inProgressIssues,
        testingIssues,
        resolvedIssues,
        closedIssues
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProjectAnalytics = async (req, res) => {
  try {
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const archivedProjects = await Project.countDocuments({ status: 'archived' });

    const projects = await Project.find()
      .populate('owner')
      .select('projectId title status owner');

    const projectsWithIssueCount = await Promise.all(
      projects.map(async (project) => {
        const issueCount = await Issue.countDocuments({ project: project._id });
        return {
          projectId: project.projectId,
          title: project.title,
          owner: project.owner.name,
          status: project.status,
          issueCount
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Project analytics fetched successfully',
      data: {
        activeProjects,
        completedProjects,
        archivedProjects,
        projects: projectsWithIssueCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDeveloperAnalytics = async (req, res) => {
  try {
    const developers = await User.find({ role: 'developer' });

    const developerStats = await Promise.all(
      developers.map(async (dev) => {
        const assignedIssues = await Issue.countDocuments({ assignedTo: dev._id });
        const resolvedIssues = await Issue.countDocuments({
          assignedTo: dev._id,
          status: 'resolved'
        });
        return {
          userId: dev.userId,
          name: dev.name,
          assignedIssues,
          resolvedIssues
        };
      })
    );

    const highestResolved = developerStats.reduce((max, dev) =>
      dev.resolvedIssues > max.resolvedIssues ? dev : max
    );

    res.status(200).json({
      success: true,
      message: 'Developer analytics fetched successfully',
      data: {
        highestResolvedDeveloper: highestResolved,
        developers: developerStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
