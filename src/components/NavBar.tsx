'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User } from 'lucide-react'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const isAuthPage = pathname.includes('/auth/')

  if (isAuthPage) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Skill Intelligence
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
              </Link>
              {user && (
                <Link 
                  href="/onboarding" 
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/onboarding' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Career Path
                </Link>
              )}
              {user && (
                <Link 
                  href="/profile" 
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${pathname === '/profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Profile
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {loading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/dashboard' ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user && (
              <Link
                href="/onboarding"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/onboarding' ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Career Path
              </Link>
            )}
            {user && (
              <Link
                href="/profile"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/profile' ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {!loading && !user ? (
              <>
                <Link
                  href="/auth/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            ) : user ? (
              <button
                onClick={() => {
                  handleSignOut()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}