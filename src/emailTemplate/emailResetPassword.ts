export function buildResetPasswordEmail(params: {
  email: string;
  resetUrl: string;
  expireMinutes?: number;
  supportEmail?: string;
}) {
  const {
    email,
    resetUrl,
    expireMinutes = 60,
    supportEmail = 'support@example.com',
  } = params;

  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Reset your password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; padding:0; background:#f5f7fb; color:#111; }
    .container { max-width:600px; margin:28px auto; background:#ffffff; border-radius:8px; box-shadow:0 4px 18px rgba(0,0,0,0.06); overflow:hidden; }
    .header { padding:24px; text-align:center; background:linear-gradient(90deg,#0ea5a4,#06b6d4); color:white; }
    .content { padding:24px; line-height:1.5; color:#111827; }
    .btn { display:inline-block; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; background:#374151; color:#fff; margin-top:12px; }
    .small { font-size:13px; color:#6b7280; }
    .footer { padding:18px 24px; font-size:13px; color:#9ca3af; text-align:center; }
    a.link { color:#0ea5a4; word-break:break-all; }
    @media (max-width:420px){ .container{ margin:12px; } .header{ padding:18px } .content{ padding:18px } }
  </style>
</head>
<body>
  <div class="container" role="article" aria-labelledby="title">
    <div class="header">
      <h1 id="title" style="margin:0;font-size:20px;">Password reset request</h1>
    </div>

    <div class="content">
      <p>Hello <strong>${email}</strong>,</p>

      <p>We received a request to reset the password for your account. Click the button below to create a new password. This link will expire in <strong>${expireMinutes} minutes</strong>.</p>

      <p style="text-align:center;">
        <a href="${resetUrl}" class="btn" target="_blank" rel="noopener noreferrer">Reset password</a>
      </p>

      <p class="small">If the button above doesn’t work, you can copy and paste the link below into your browser:</p>
      <p class="small"><a class="link" href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>

      <hr style="border:none;border-top:1px solid #eef2f7;margin:18px 0;" />

      <p class="small">If you didn’t request a password reset, you can safely ignore this email — your current password will remain unchanged. For assistance, contact us at: <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Company Name — Keep your account secure.
    </div>
  </div>
</body>
</html>
  `;

  return html;
}
