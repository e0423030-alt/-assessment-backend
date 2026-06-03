import User from '../models/User.js';
import Project from '../models/Project.js';
import Issue from '../models/Issue.js';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Delete all existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Issue.deleteMany({});
    console.log('Cleared existing data');

    console.log('Seeding database with fresh sample data...');

    // Create test users (use save() to trigger pre-save hashing)
    const userData = [
      {
        userId: 'USR0001',
        name: 'System Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        department: 'Administration',
        status: 'active'
      },
      {
        userId: 'USR1001',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@test.com',
        password: 'password123',
        role: 'manager',
        department: 'Management',
        status: 'active'
      },
      {
        userId: 'USR1002',
        name: 'Priya Iyer',
        email: 'priya.iyer@test.com',
        password: 'password123',
        role: 'developer',
        department: 'Development',
        status: 'active'
      },
      {
        userId: 'USR1003',
        name: 'Arjun Nair',
        email: 'arjun.nair@test.com',
        password: 'password123',
        role: 'developer',
        department: 'Development',
        status: 'active'
      },
      {
        userId: 'USR1004',
        name: 'Meera Krishnan',
        email: 'meera.krishnan@test.com',
        password: 'password123',
        role: 'tester',
        department: 'QA',
        status: 'active'
      }
    ];

    const users = [];
    for (const data of userData) {
      const user = new User(data);
      await user.save();
      users.push(user);
    }

    console.log(`Created ${users.length} users with hashed passwords`);

    // Create test projects
    const projectData = [
      {
        projectId: 'PROJ1',
        title: 'Issue Tracker Portal',
        category: 'Web Application',
        description: 'Issue tracking system for bug management',
        owner: users[0]._id,
        members: [users[0]._id, users[1]._id, users[2]._id],
        status: 'active'
      },
      {
        projectId: 'PROJ2',
        title: 'CRM Portal',
        category: 'CRM',
        description: 'Customer relationship management platform',
        owner: users[1]._id,
        members: [users[1]._id, users[2]._id, users[3]._id],
        status: 'active'
      },
      {
        projectId: 'PROJ3',
        title: 'E-Commerce Platform',
        category: 'E-Commerce',
        description: 'Online shopping and sales management system',
        owner: users[0]._id,
        members: [users[0]._id, users[2]._id, users[4]._id],
        status: 'active'
      }
    ];

    const projects = [];
    for (const data of projectData) {
      const project = new Project(data);
      await project.save();
      projects.push(project);
    }

    console.log(`Created ${projects.length} projects`);

    // Create test issues
    const issueData = [
      {
        issueId: 'ISS1',
        title: 'Login page not loading',
        description: 'Users unable to access login page - crashes on load',
        project: projects[0]._id,
        assignedTo: users[2]._id,
        reportedBy: users[4]._id,
        priority: 'high',
        severity: 'critical',
        status: 'open'
      },
      {
        issueId: 'ISS2',
        title: 'Database connection timeout',
        description: 'API requests timing out after 30 seconds',
        project: projects[0]._id,
        assignedTo: users[3]._id,
        reportedBy: users[4]._id,
        priority: 'high',
        severity: 'critical',
        status: 'in-progress'
      },
      {
        issueId: 'ISS3',
        title: 'UI button alignment issue',
        description: 'Buttons misaligned on mobile devices',
        project: projects[1]._id,
        assignedTo: users[2]._id,
        reportedBy: users[0]._id,
        priority: 'medium',
        severity: 'major',
        status: 'open'
      },
      {
        issueId: 'ISS4',
        title: 'Add dark mode feature',
        description: 'Implement dark mode toggle in settings',
        project: projects[1]._id,
        assignedTo: users[3]._id,
        reportedBy: users[1]._id,
        priority: 'low',
        severity: 'minor',
        status: 'open'
      },
      {
        issueId: 'ISS5',
        title: 'Fix email notification bug',
        description: 'Users not receiving password reset emails',
        project: projects[2]._id,
        assignedTo: null,
        reportedBy: users[0]._id,
        priority: 'high',
        severity: 'critical',
        status: 'open'
      }
    ];

    const issues = [];
    for (const data of issueData) {
      const issue = new Issue(data);
      await issue.save();
      issues.push(issue);
    }

    console.log(`Created ${issues.length} issues`);
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
