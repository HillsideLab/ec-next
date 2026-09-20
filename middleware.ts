import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// 保護したいルートのパターン
const protectedPaths = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 未ログインで保護ルートにアクセスしていないかチェック
  const session = getSessionCookie(request);
  const isProtected = protectedPaths.some((p) => p.test(pathname));

  if (!session && isProtected) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. sessionCartId Cookieの発行（既存のロジック）
  if (request.cookies.get('sessionCartId')) {
    return NextResponse.next();
  }

  const sessionCartId = crypto.randomUUID();
  const response = NextResponse.next();
  response.cookies.set('sessionCartId', sessionCartId);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};