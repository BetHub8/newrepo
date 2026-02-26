import { useMemo, useState, useEffect, useRef } from 'react'
import { formatPrice } from '../utils/compatibilityEngine'
import { ErrorIcon, AlertIcon, CheckIcon, CopyIcon, RefreshIcon, LightningIcon, CategoryIcon } from './Icons'
import PCCustomizer from './PCCustomizer'

export default function CompatibilityPanel({
    compatibility,
    totalPrice,
    suggestions,
    selectedComponents,
    onSelectSuggestion,
    onReset,
    onCheckout,
}) {
    const { score, issues, warnings, strengths, selectedCount } = compatibility
    const [animateScore, setAnimateScore] = useState(false)
    const prevScore = useRef(score)

    useEffect(() => {
        if (prevScore.current !== score) {
            setAnimateScore(true)
            const t = setTimeout(() => setAnimateScore(false), 350)
            prevScore.current = score
            return () => clearTimeout(t)
        }
    }, [score])

    const gaugeRadius = 80
    const gaugeCircumference = Math.PI * gaugeRadius
    const gaugeFill = (Math.min(score, 95) / 95) * gaugeCircumference

    const scoreColor = useMemo(() => {
        if (score >= 80) return '#00e676'
        if (score >= 60) return '#ffb300'
        if (score >= 40) return '#f97316'
        return '#ff3d3d'
    }, [score])

    const perfLevel = useMemo(() => {
        if (score >= 90) return 'Excellent'
        if (score >= 75) return 'Good'
        if (score >= 50) return 'Average'
        if (score >= 25) return 'Needs Improvement'
        return 'Insufficient Data'
    }, [score])

    // Determine glow class
    const glowClass = useMemo(() => {
        if (selectedCount < 2) return ''
        if (issues.length > 0) return 'glow-red'
        if (score >= 70) return 'glow-green'
        return ''
    }, [issues, score, selectedCount])

    const pcImageGlow = useMemo(() => {
        if (selectedCount < 2) return ''
        if (issues.length > 0) return 'glow-red'
        if (score >= 70) return 'glow-green'
        return ''
    }, [issues, score, selectedCount])

    return (
        <div className="compat-panel">
            {/* Score Card */}
            <div className={`score-card ${glowClass}`}>
                <h3>Compatibility</h3>

                {/* PC Customizer */}
                <PCCustomizer pcImageSrc="/PIC1.jpg" />

                <div className={`gauge-container ${animateScore ? 'score-animate' : ''}`}>
                    <svg className="gauge-svg" viewBox="0 0 200 120">
                        <path className="gauge-bg" d="M 20 110 A 80 80 0 0 1 180 110" />
                        <path
                            className="gauge-fill"
                            d="M 20 110 A 80 80 0 0 1 180 110"
                            style={{
                                stroke: scoreColor,
                                strokeDasharray: `${gaugeCircumference}`,
                                strokeDashoffset: `${gaugeCircumference - gaugeFill}`,
                            }}
                        />
                        <text x="100" y="88" textAnchor="middle" className="gauge-score" style={{ fill: scoreColor }}>
                            {selectedCount >= 2 ? `${score}%` : '—'}
                        </text>
                        <text x="100" y="106" textAnchor="middle" className="gauge-label">
                            Compatibility Rating
                        </text>
                    </svg>
                </div>

                <div className="perf-bar-section">
                    <div className="perf-bar-header">
                        <span>Performance potential</span>
                        <span className="perf-level">{perfLevel}</span>
                    </div>
                    <div className="perf-bar-track">
                        <div
                            className="perf-bar-fill"
                            style={{
                                width: `${selectedCount >= 2 ? Math.min(score, 95) / 0.95 : 0}%`,
                                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                            }}
                        />
                    </div>
                </div>

                <div className="price-total">
                    <div className="label">Estimate Total</div>
                    <div className="amount">{formatPrice(totalPrice)}</div>
                </div>

                <div className="action-buttons">
                    <button className="btn-primary" onClick={onCheckout} disabled={selectedCount === 0}>
                        <CopyIcon size={14} /> Fill Information & Confirm
                    </button>
                    <button className="btn-secondary" onClick={onReset}>
                        <RefreshIcon size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Issues */}
            {(issues.length > 0 || warnings.length > 0 || strengths.length > 0) && (
                <div className="issues-panel">
                    {issues.length > 0 && (
                        <>
                            <h4><ErrorIcon size={14} /> Incompatible ({issues.length})</h4>
                            {issues.map((issue, i) => (
                                <div key={`issue-${i}`} className="issue-item error">
                                    <span className="issue-icon error"><ErrorIcon size={14} /></span>
                                    <div className="issue-content">
                                        <div className="issue-title">{issue.title}</div>
                                        <div className="issue-detail">{issue.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {warnings.length > 0 && (
                        <>
                            <h4 style={{ marginTop: issues.length > 0 ? '0.75rem' : 0 }}>
                                <AlertIcon size={14} /> Warnings ({warnings.length})
                            </h4>
                            {warnings.map((warning, i) => (
                                <div key={`warn-${i}`} className="issue-item warning">
                                    <span className="issue-icon warning"><AlertIcon size={14} /></span>
                                    <div className="issue-content">
                                        <div className="issue-title">{warning.title}</div>
                                        <div className="issue-detail">{warning.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {strengths.length > 0 && (
                        <>
                            <h4 style={{ marginTop: (issues.length > 0 || warnings.length > 0) ? '0.75rem' : 0 }}>
                                <CheckIcon size={14} /> Compatible ({strengths.length})
                            </h4>
                            {strengths.map((str, i) => (
                                <div key={`str-${i}`} className="issue-item strength">
                                    <span className="issue-icon success"><CheckIcon size={14} /></span>
                                    <div className="issue-content">
                                        <div className="issue-title">{str.title}</div>
                                        <div className="issue-detail">{str.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
                <div className="suggestions-panel">
                    <h4><LightningIcon size={14} /> Smart Suggestions</h4>
                    {suggestions.map((sg, i) => (
                        <div key={`sg-${i}`} className="suggestion-group">
                            <div className="suggestion-group-header">
                                <span className="sg-icon"><CategoryIcon categoryId={sg.category} size={14} /></span>
                                <span className="sg-title">{sg.title}</span>
                                <span className="sg-detail">{sg.detail}</span>
                            </div>
                            {sg.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="suggestion-item"
                                    onClick={() => onSelectSuggestion(sg.category, item)}
                                >
                                    <span className="si-name">{item.name}</span>
                                    <span className="si-price">{formatPrice(item.price)}</span>
                                    <span className="si-add">+</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
