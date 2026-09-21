import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, surname, email, password } = body;

    if (!email || !password || !name || !surname) {
      return NextResponse.json(
        { error: 'Tüm alanların doldurulması zorunludur.' },
        { status: 400 }
      );
    }

    // Burada normalde veritabanına (Prisma, MongoDB, PostgreSQL vb.) kayıt işlemi yapılır.
    // Şimdilik başarılı yanıt dönüyoruz.

    return NextResponse.json(
      { 
        success: true, 
        message: 'Üyelik başarıyla oluşturuldu.',
        user: { name, surname, email } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}