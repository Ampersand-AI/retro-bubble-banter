import { Resend } from 'resend';
import express, { Request, Response } from 'express';

const resend = new Resend(process.env.RESEND_API_KEY);

export const supportRouter = express.Router();

supportRouter.post('/', express.json(), async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Send email using Resend
    const data = await resend.emails.send({
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

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending support email:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send support request'
    });
  }
}); 