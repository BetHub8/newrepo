// Clean SVG icons for each PC component category
// No emoji - professional SVG only

export function CategoryIcon({ categoryId, size = 20, className = '' }) {
    const icons = {
        cpu: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
                <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
                <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
            </svg>
        ),
        vga: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="7" cy="12" r="2.5" />
                <circle cx="14" cy="12" r="2.5" />
                <line x1="19" y1="9" x2="19" y2="15" />
                <line x1="5" y1="3" x2="5" y2="6" /><line x1="9" y1="3" x2="9" y2="6" />
            </svg>
        ),
        mainboard: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <rect x="7" y="7" width="5" height="5" rx="0.5" />
                <line x1="15" y1="8" x2="18" y2="8" /><line x1="15" y1="11" x2="18" y2="11" />
                <line x1="7" y1="15" x2="10" y2="15" /><line x1="7" y1="17" x2="10" y2="17" />
                <circle cx="16" cy="16" r="1.5" />
            </svg>
        ),
        ram: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="2" y="6" width="20" height="12" rx="1" />
                <line x1="6" y1="10" x2="6" y2="14" /><line x1="9" y1="10" x2="9" y2="14" />
                <line x1="12" y1="10" x2="12" y2="14" /><line x1="15" y1="10" x2="15" y2="14" />
                <line x1="18" y1="10" x2="18" y2="14" />
                <line x1="5" y1="18" x2="5" y2="20" /><line x1="8" y1="18" x2="8" y2="20" />
                <line x1="11" y1="18" x2="11" y2="20" /><line x1="14" y1="18" x2="14" y2="20" />
                <line x1="17" y1="18" x2="17" y2="20" /><line x1="20" y1="18" x2="20" y2="20" />
            </svg>
        ),
        ssd: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M7 10h2v4H7z" /><path d="M11 10h2v4h-2z" />
                <circle cx="17" cy="12" r="1" />
            </svg>
        ),
        hdd: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                <line x1="18" y1="9" x2="18" y2="9.01" strokeWidth="2" />
            </svg>
        ),
        psu: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="12" cy="12" r="4" />
                <path d="M12 9v6M9 12h6" />
                <line x1="7" y1="4" x2="7" y2="2" /><line x1="12" y1="4" x2="12" y2="2" /><line x1="17" y1="4" x2="17" y2="2" />
            </svg>
        ),
        cooling: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="2" />
                <path d="M12 5v2M12 17v2M5 12h2M17 12h2M7.05 7.05l1.41 1.41M15.54 15.54l1.41 1.41M7.05 16.95l1.41-1.41M15.54 8.46l1.41-1.41" />
            </svg>
        ),
        case: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <circle cx="12" cy="7" r="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="15" x2="16" y2="15" />
                <circle cx="12" cy="19" r="0.5" fill="currentColor" />
            </svg>
        ),
    }

    return icons[categoryId] || null
}

// Status icons (no emoji)
export function CheckIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

export function AlertIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12" y2="17.01" />
        </svg>
    )
}

export function ErrorIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    )
}

export function CloseIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    )
}

export function PlusIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}

export function SearchIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    )
}

export function TrashIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
    )
}

export function CopyIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
    )
}

export function RefreshIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
    )
}

export function LightningIcon({ size = 16, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}

export function MenuIcon({ size = 20, className = '' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    )
}
