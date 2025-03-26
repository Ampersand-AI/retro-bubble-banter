import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

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

    // Send email using Resend
    const response = await resend.emails.send({
      from: 'Rovyk Support <dev@ampvc.co>',
      to: ['dev@ampvc.co'],
      subject: `New Support Request from ${name}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending support email:', error);
    throw error;
  }
} 