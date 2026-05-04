const nodemailer = require("nodemailer");

/**
 * Sends a notification to your inbox when someone submits the public contact form.
 * Requires GMAIL_USER + GMAIL_APP_PASSWORD (Google App Password, not your normal password).
 * Set LUMINA_CONTACT_NOTIFY_EMAIL if alerts should go to a different address than GMAIL_USER.
 */
async function sendContactInquiryEmail(inquiry) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.LUMINA_CONTACT_NOTIFY_EMAIL || user;
  if (!user || !pass || !to) {
    console.info("[contact] Email notify skipped (set GMAIL_USER + GMAIL_APP_PASSWORD to enable)");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const plain = [
    `New message via Lumina Weddings contact form`,
    ``,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "—"}`,
    `Country: ${inquiry.country || "—"}`,
    `Subject: ${inquiry.subject}`,
    ``,
    inquiry.inquiry_text || inquiry.message || "",
  ].join("\n");

  await transporter.sendMail({
    from: `"Lumina Weddings" <${user}>`,
    to,
    replyTo: inquiry.email,
    subject: `[Lumina Contact] ${inquiry.subject}`,
    text: plain,
  });
}

module.exports = { sendContactInquiryEmail };
