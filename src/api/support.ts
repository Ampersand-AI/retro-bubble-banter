import { API_ENDPOINTS } from '@/config';

export async function sendSupportEmail(data: { name: string; email: string; message: string }) {
  try {
    const { name, email, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error('Missing required fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Send request to our server
    const response = await fetch(API_ENDPOINTS.support, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send support request');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending support email:', error);
    throw error;
  }
} 