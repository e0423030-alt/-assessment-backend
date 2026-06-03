import axios from 'axios';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Issue from '../models/Issue.js';
import { validateEmail } from '../utils/validators.js';

export const fetchAndSyncDataset = async () => {
  try {
    const STUDENT_ID = process.env.STUDENT_ID;
    const STUDENT_PASSWORD = process.env.STUDENT_PASSWORD;
    const API_URL = process.env.EXTERNAL_API_URL;

    console.log(`[SYNC] Starting sync from external API: ${API_URL}`);
    console.log(`[SYNC] Using credentials: ${STUDENT_ID}`);

    let dataset = { users: [], projects: [], issues: [] };

    // Try to get token from external API
    try {
      const tokenResponse = await axios.post(`${API_URL}/auth/login`, {
        email: STUDENT_ID,
        password: STUDENT_PASSWORD
      });

      const token = tokenResponse.data.token || tokenResponse.data.data?.token;
      console.log(`[SYNC] External API login: ${token ? 'Success' : 'No token returned'}`);

      if (token) {
        // Try different endpoints to fetch data
        const endpoints = ['/data', '/dataset', '/users', '/projects', '/issues'];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`[SYNC] Trying endpoint: ${endpoint}`);
            const response = await axios.get(`${API_URL}${endpoint}`, {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            });
            
            if (response.data?.users || response.data?.projects || response.data?.issues) {
              dataset = response.data;
              console.log(`[SYNC] Found data at endpoint: ${endpoint}`);
              break;
            }
          } catch (e) {
            console.log(`[SYNC] Endpoint ${endpoint} failed or returned no data`);
          }
        }
      }
    } catch (error) {
      console.log(`[SYNC] Could not authenticate with external API: ${error.message}`);
      console.log(`[SYNC] Proceeding with empty dataset...`);
    }

    let totalFetched = 0;
    let inserted = 0;
    let duplicates = 0;
    let rejected = 0;

    if (dataset.users) {
      totalFetched += dataset.users.length;
      for (const userData of dataset.users) {
        try {
          // Validate
          if (!userData.name || !userData.email || !validateEmail(userData.email)) {
            rejected++;
            continue;
          }

          // Check duplicate
          const exists = await User.findOne({ email: userData.email });
          if (exists) {
            duplicates++;
            continue;
          }

          // Create user
          const userCount = await User.countDocuments();
          const userId = `USR${String(userCount + 1).padStart(4, '0')}`;

          const user = new User({
            userId,
            name: userData.name,
            email: userData.email,
            password: userData.password || 'temp123',
            role: userData.role || 'developer',
            department: userData.department || 'General'
          });

          await user.save();
          inserted++;
        } catch (error) {
          rejected++;
        }
      }
    }

    return {
      totalFetched,
      inserted,
      duplicates,
      rejected
    };
  } catch (error) {
    throw new Error(`Sync failed: ${error.message}`);
  }
};
