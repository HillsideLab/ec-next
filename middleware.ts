import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // すでに sessionCartId があれば何もしない
  if (request.cookies.get('sessionCartId')) {
    return NextResponse.next();
  }

  // 無ければ生成してレスポンスのCookieにセット
  const sessionCartId = crypto.randomUUID();
  const response = NextResponse.next();
  response.cookies.set('sessionCartId', sessionCartId);

  return response;
}

export const config = {
  matcher: [
    // 静的ファイルやAPIルートは除外
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};