import type { TournamentTicket } from "@shared/schema";

export async function sendTournamentTicketEmail(
  ticket: TournamentTicket,
  ticketSVG: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not found. Email sending is disabled.");
      return {
        success: false,
        message: "Email service not configured. Please set up Resend integration.",
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GameZone Arena <noreply@yourdomain.com>",
        to: [ticket.email],
        subject: `Your Tournament Ticket #${ticket.ticketNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Tournament Ticket</title>
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #8b5cf6; margin: 0 0 10px 0;">🏆 Tournament Registration Confirmed!</h1>
                  <p style="color: #666; font-size: 16px; margin: 0;">GameZone Arena</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 30px;">
                  <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px 0; font-size: 14px;">Your Ticket Number</p>
                  <p style="color: white; font-size: 42px; font-weight: bold; margin: 0; letter-spacing: 2px;">${ticket.ticketNumber}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                  <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Registration Details</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Name:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: 500; text-align: right; font-size: 14px;">${ticket.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Email:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: 500; text-align: right; font-size: 14px;">${ticket.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Phone:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: 500; text-align: right; font-size: 14px;">${ticket.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Game:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333; font-weight: 500; text-align: right; font-size: 14px;">${ticket.gamePreference}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #666; font-size: 14px;">Registered:</td>
                      <td style="padding: 10px 0; color: #333; font-weight: 500; text-align: right; font-size: 14px;">${new Date(ticket.createdAt).toLocaleString()}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                    <strong style="color: #333;">Important:</strong> Please present this ticket number at the venue on tournament day.
                  </p>
                  <p style="color: #666; font-size: 14px; margin: 0;">
                    You can download your complete ticket from the website or find it attached to this email.
                  </p>
                </div>
                
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">GameZone Arena • Dombivli West</p>
                  <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">+91-9876543210</p>
                </div>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: `tournament-ticket-${ticket.ticketNumber}.svg`,
            content: Buffer.from(ticketSVG).toString("base64"),
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return {
        success: false,
        message: "Failed to send email. Please try again later.",
      };
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return {
      success: true,
      message: "Ticket sent to your email successfully!",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
