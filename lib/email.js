import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendVerificationEmail(to, code) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Verifica tu cuenta',
    html: `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;background:#0a0a0a;color:#fff;border-radius:12px;">
        <h1 style="font-size:28px;margin-bottom:8px;letter-spacing:-1px;">Verifica tu cuenta</h1>
        <p style="color:#aaa;margin-bottom:32px;">Ingresa este código en la aplicación para confirmar tu correo electrónico.</p>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:24px;text-align:center;margin-bottom:32px;">
          <span style="font-size:42px;font-weight:700;letter-spacing:12px;color:#e8ff47;">${code}</span>
        </div>
        <p style="color:#666;font-size:13px;">Este código expira en 15 minutos. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  }
  await sgMail.send(msg)
}

export async function sendPasswordResetEmail(to, code) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Recupera tu contraseña',
    html: `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;background:#0a0a0a;color:#fff;border-radius:12px;">
        <h1 style="font-size:28px;margin-bottom:8px;letter-spacing:-1px;">Recuperar contraseña</h1>
        <p style="color:#aaa;margin-bottom:32px;">Ingresa este código para restablecer tu contraseña.</p>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:24px;text-align:center;margin-bottom:32px;">
          <span style="font-size:42px;font-weight:700;letter-spacing:12px;color:#ff6b47;">${code}</span>
        </div>
        <p style="color:#666;font-size:13px;">Este código expira en 15 minutos. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  }
  await sgMail.send(msg)
}
