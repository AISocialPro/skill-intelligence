// /app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if user is trying to access profile without onboarding
  if (path === '/profile') {
    const onboardingCompleted = request.cookies.get('onboarding_completed')?.value;
    
    if (!onboardingCompleted || onboardingCompleted !== 'true') {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }
  
  // Check if user is trying to access onboarding after completion
  if (path === '/onboarding') {
    const onboardingCompleted = request.cookies.get('onboarding_completed')?.value;
    
    if (onboardingCompleted === 'true') {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/onboarding'],
};