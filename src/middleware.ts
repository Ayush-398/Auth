import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request:NextRequest){
   const path = request.nextUrl.pathname

   const isPublicPath = path === '/login' || path === '/signup'
   const token = request.cookies.get('token')?.value || ''

   // If user is logged in and tries to access login/signup, redirect to profile
   if(isPublicPath && token){
       return NextResponse.redirect(new URL('/profile', request.nextUrl))
   }
   
   // If user is not logged in and tries to access protected route, redirect to login
   if (!isPublicPath && !token){
       return NextResponse.redirect(new URL('/login', request.nextUrl))
   }
   
   // Allow the request to continue
   return NextResponse.next()
}

export const config = {
    matcher:[
        '/profile/:path*',
        '/login',
        '/signup',
    ]
}