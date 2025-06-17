import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/site', 
  '/api/uploadthing'
])

export default clerkMiddleware(async (auth, req) => {
  //rewrite for domains
  const url = req.nextUrl
  const searchParams = url.searchParams.toString()
  let hostname = req.headers

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`

  // if subdomain exists
  const host = hostname.get('host') || ''
  const domain = process.env.NEXT_PUBLIC_DOMAIN || ''
  console.log(host, domain)
  // Handle localhost with port correctly
  let customSubDomain = ''
  if (host && domain) {
    // For localhost:3000, we need to check against 'localhost' without port
    const hostWithoutPort = host.split(':')[0]
    if (hostWithoutPort !== domain && host.includes(domain)) {
      customSubDomain = host.split(domain)[0].replace('.', '')
    }
  }

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    )
  }

  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
  }

  if (
    url.pathname === '/' ||
    (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL('/site', req.url))
  }

  if (
    url.pathname.startsWith('/agency') ||
    url.pathname.startsWith('/subaccount')
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
