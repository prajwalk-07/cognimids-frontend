'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { AuthContext } from "../context/AuthContext"
import { useContext, useState } from "react"

function Header() {
  const {logout, token, userId, role} = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Helper function to check if link is active
  const isActive = (path) => pathname === path

  // Desktop link classes with active state
  const linkClasses = (path) => `
    text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${isActive(path) ? 'bg-gray-900 text-white' : 'hover:bg-gray-700'}
  `

  // Mobile link classes with active state and centered text
  const mobileLinkClasses = (path) => `
    w-full text-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors
    ${isActive(path) ? 'bg-gray-900 text-white' : 'hover:bg-gray-700'}
  `

  return (
    <nav className="bg-black border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
              CogniMinds
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!token && (
              <Link href="/login" className={linkClasses('/login')}>
                Login
              </Link>
            )}
            {role === "Admin" && (
              <>
                <Link href="/admin/users" className={linkClasses('/admin/users')}>
                  Users
                </Link>
                <Link href="/admin/user-signup" className={linkClasses('/admin/user-signup')}>
                  User-Signup
                </Link>
              </>
            )}
            {token && (
              <>
                <Link href={`/${userId}/logs`} className={linkClasses(`/${userId}/logs`)}>
                  Logs
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`}
        aria-label="Mobile menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-2 flex flex-col items-center">
          {!token && (
            <Link 
              href="/login"
              className={mobileLinkClasses('/login')}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
          {role === "Admin" && (
            <>
              <Link 
                href="/admin/users"
                className={mobileLinkClasses('/admin/users')}
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
              <Link 
                href="/admin/user-signup"
                className={mobileLinkClasses('/admin/user-signup')}
                onClick={() => setIsMenuOpen(false)}
              >
                User-Signup
              </Link>
            </>
          )}
          {token && (
            <>
              <Link 
                href={`/${userId}/logs`}
                className={mobileLinkClasses(`/${userId}/logs`)}
                onClick={() => setIsMenuOpen(false)}
              >
                Logs
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-center text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header