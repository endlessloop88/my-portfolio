import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const website = typeof body.website === 'string' ? body.website : '';

    // Honeypot: gerçek kullanıcı bu gizli alanı doldurmaz, botlar doldurur.
    // Başarılıymış gibi yanıt verip sessizce yok sayıyoruz.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Ad ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: 'Girilen metin çok uzun.' }, { status: 400 });
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !toEmail) {
      console.error('RESEND_API_KEY veya CONTACT_TO_EMAIL tanımlı değil.');
      return NextResponse.json(
        { error: 'Mesaj servisi şu anda yapılandırılmamış.' },
        { status: 500 }
      );
    }

    // Konu satırına satır sonu karakteri sızmasın
    const safeName = name.replace(/[\r\n]+/g, ' ');

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Portfolyo Site <onboarding@resend.dev>',
      to: toEmail,
      replyTo: email || undefined,
      subject: `Yeni mesaj: ${safeName}`,
      text: `Ad: ${safeName}\nE-posta: ${email || '(belirtilmedi)'}\n\n${message}`,
    });

    if (error) {
      console.error('Resend hatası:', error);
      return NextResponse.json(
        { error: 'Mesaj gönderilemedi, lütfen daha sonra tekrar deneyin.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('İletişim formu hatası:', err);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}