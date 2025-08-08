import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
    }
  }

  async sendRsvpConfirmation(
    toEmail: string,
    guestName: string,
    eventTitle: string,
    eventDate: Date,
    status: 'confirmed' | 'declined',
  ) {
    const subject = `RSVP ${status === 'confirmed' ? 'Confirmation' : 'Response'} - ${eventTitle}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">RSVP ${status === 'confirmed' ? 'Confirmation' : 'Response'}</h2>
        <p>Dear ${guestName},</p>
        <p>Thank you for your RSVP response for <strong>${eventTitle}</strong>.</p>
        <p>Your response has been recorded as: <strong>${status.toUpperCase()}</strong></p>
        <p>Event Details:</p>
        <ul>
          <li><strong>Event:</strong> ${eventTitle}</li>
          <li><strong>Date:</strong> ${eventDate.toLocaleDateString()}</li>
        </ul>
        <p>We look forward to celebrating with you!</p>
        <p>Best regards,<br>The Event Team</p>
      </div>
    `;

    return await this.sendEmail(toEmail, subject, html);
  }

  async sendEventInvitation(
    toEmail: string,
    guestName: string,
    eventTitle: string,
    eventDate: Date,
    eventSlug: string,
    hostName: string,
  ) {
    const subject = `You're Invited! - ${eventTitle}`;
    const eventUrl = `${this.configService.get('FRONTEND_URL')}/event/${eventSlug}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You're Invited!</h2>
        <p>Dear ${guestName},</p>
        <p>You have been invited to attend <strong>${eventTitle}</strong>.</p>
        <p>Event Details:</p>
        <ul>
          <li><strong>Event:</strong> ${eventTitle}</li>
          <li><strong>Date:</strong> ${eventDate.toLocaleDateString()}</li>
          <li><strong>Host:</strong> ${hostName}</li>
        </ul>
        <p>Please click the link below to RSVP:</p>
        <a href="${eventUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">RSVP Now</a>
        <p>We hope to see you there!</p>
        <p>Best regards,<br>${hostName}</p>
      </div>
    `;

    return await this.sendEmail(toEmail, subject, html);
  }

  async sendEventReminder(
    toEmail: string,
    guestName: string,
    eventTitle: string,
    eventDate: Date,
    eventSlug: string,
  ) {
    const subject = `Reminder: ${eventTitle} is coming up!`;
    const eventUrl = `${this.configService.get('FRONTEND_URL')}/event/${eventSlug}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Event Reminder</h2>
        <p>Dear ${guestName},</p>
        <p>This is a friendly reminder about <strong>${eventTitle}</strong>.</p>
        <p>Event Details:</p>
        <ul>
          <li><strong>Event:</strong> ${eventTitle}</li>
          <li><strong>Date:</strong> ${eventDate.toLocaleDateString()}</li>
        </ul>
        <p>If you haven't RSVP'd yet, please click the link below:</p>
        <a href="${eventUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">RSVP Now</a>
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>The Event Team</p>
      </div>
    `;

    return await this.sendEmail(toEmail, subject, html);
  }

  async sendEventUpdate(
    toEmail: string,
    guestName: string,
    eventTitle: string,
    eventDate: Date,
    eventSlug: string,
    updateMessage: string,
  ) {
    const subject = `Event Update: ${eventTitle}`;
    const eventUrl = `${this.configService.get('FRONTEND_URL')}/event/${eventSlug}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Event Update</h2>
        <p>Dear ${guestName},</p>
        <p>There has been an update to <strong>${eventTitle}</strong>.</p>
        <p><strong>Update:</strong> ${updateMessage}</p>
        <p>Event Details:</p>
        <ul>
          <li><strong>Event:</strong> ${eventTitle}</li>
          <li><strong>Date:</strong> ${eventDate.toLocaleDateString()}</li>
        </ul>
        <p>Click the link below to view the updated event details:</p>
        <a href="${eventUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View Event</a>
        <p>Best regards,<br>The Event Team</p>
      </div>
    `;

    return await this.sendEmail(toEmail, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.warn('Resend API key not configured. Email not sent.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const result = await this.resend.emails.send({
        from: 'noreply@newly.com',
        to: [to],
        subject,
        html,
      });

      this.logger.log(`Email sent successfully to ${to}`);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return { success: false, error: error.message };
    }
  }
} 