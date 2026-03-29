

export const emailTempalet = (otp)=>
{
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>New Message</title>
</head>

<body style="margin:0; padding:0; background:#eef2f7; font-family: 'Segoe UI', Tahoma, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="margin:40px 0; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td style="background:linear-gradient(135deg,#6C63FF,#4A47D5); padding:30px; text-align:center; color:white;">
  <h1 style="margin:0; font-size:26px;">📩 New Anonymous Message</h1>
  <p style="margin-top:10px; font-size:14px; opacity:0.9;">
    Someone just sent you a message
  </p>
</td>
</tr>

<!-- Avatar / Icon -->
<tr>
<td align="center" style="padding:25px;">
  <div style="width:70px; height:70px; background:#6C63FF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:30px;">
    💬
  </div>
</td>
</tr>

<!-- Message -->
<tr>
<td style="padding:0 40px 20px 40px; text-align:center;">

  <div style="
    background:#f5f7fb;
    padding:20px;
    border-radius:12px;
    font-size:16px;
    color:#444;
    line-height:1.6;
    border:1px solid #eee;
  ">
    code : ${otp}
  </div>

  <p style="margin-top:20px; font-size:13px; color:#999;">
    Sent anonymously • {{time}}
  </p>

</td>
</tr>

<!-- CTA -->
<tr>
<td align="center" style="padding:20px 40px 40px 40px;">

  <a href="{{link}}" 
     style="
     display:inline-block;
     background:linear-gradient(135deg,#6C63FF,#4A47D5);
     color:white;
     padding:14px 30px;
     border-radius:30px;
     text-decoration:none;
     font-size:16px;
     font-weight:bold;
     box-shadow:0 5px 15px rgba(108,99,255,0.4);
     ">
     View Your Messages
  </a>

</td>
</tr>

<!-- Divider -->
<tr>
<td style="padding:0 40px;">
  <hr style="border:none; border-top:1px solid #eee;">
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:25px 40px; text-align:center; font-size:12px; color:#aaa;">

  <p style="margin:0;">
    You received this email because someone sent you a message.
  </p>

  <p style="margin:8px 0;">
    Don't like these emails?
    <a href="{{unsubscribe}}" style="color:#6C63FF; text-decoration:none;">
      Unsubscribe
    </a>
  </p>

  <p style="margin-top:10px;">
    © 2026 Saraha App
  </p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
}