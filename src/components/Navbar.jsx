import { MenuIcon } from './Icons'

export default function Navbar({ isDark, onToggleTheme }) {
    return (
        <nav className="navbar">
            <div className="navbar-spacer"></div>

            <div className="navbar-center">
                <a href="https://semcomputer.com/" className="navbar-brand" target="_blank" rel="noreferrer">
                    <img src="/Logo.png" alt="Semcomputer" className="navbar-logo" />
                </a>

                <ul className="navbar-nav">
                    <li><a href="https://semcomputer.com/" target="_blank" rel="noreferrer">Home</a></li>
                    <li><a href="https://semcomputer.com/shop/" target="_blank" rel="noreferrer">Shop</a></li>
                    <li><a href="https://semcomputer.com/about/" target="_blank" rel="noreferrer">About</a></li>
                    <li><a href="https://semcomputer.com/contact/" target="_blank" rel="noreferrer">Contact</a></li>
                    <li><a href="https://semcomputer.com/terms-of-use/" target="_blank" rel="noreferrer">Terms of use</a></li>
                    <li><a href="https://semcomputer.com/blog/" target="_blank" rel="noreferrer">Blog</a></li>
                    <li><a href="#" className="active">Compatibility</a></li>
                </ul>
            </div>

            <div className="navbar-actions">
                {/* Theme Toggle */}
                <button
                    className="theme-toggle"
                    onClick={onToggleTheme}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle theme"
                >
                    {isDark ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Nav icons matching reference */}
                <a href="https://semcomputer.com/" className="nav-icon" target="_blank" rel="noreferrer" title="Search">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </a>
                <a href="https://semcomputer.com/my-account/" className="nav-icon" target="_blank" rel="noreferrer" title="Account">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                </a>
                <button className="menu-toggle" aria-label="Menu">
                    <MenuIcon size={24} />
                </button>
            </div>
        </nav>
    )
}
