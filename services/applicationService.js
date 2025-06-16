import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const getRankedApplications = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/applications/ranked`);
    return response.data;
  } catch (error) {
    console.error('Error getting ranked applications:', error);
    throw error;
  }
}; 