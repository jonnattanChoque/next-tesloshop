import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
 
// TODO ni funciona el midleware ni el token, redirecciona siempre al login
export async function middleware(req: NextRequest) {
    const token = req.cookies.get('tokenAuth');
    let isValidToken = false;
    // try {
    //     await jose.jwtVerify(token as unknown as string, new TextEncoder().encode(process.env.JWT_SECRET_SEED || "") );
    //     isValidToken = true;
    //     return NextResponse.next();
    // } catch (error) {
    //     console.error(`JWT Invalid or not signed in`, { error });
    //     isValidToken = false;
    // }
 
    // if (!token) {
    //     const { pathname } = req.nextUrl;
    //     return NextResponse.redirect(
    //         new URL(`/auth/login?p=${pathname}`, req.url)
    //     );
    // }
 
}
 
// export const config = {
//     matcher: ['/checkout/:path*'],
// };