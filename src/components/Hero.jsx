export default function Hero({ glowState }) {
    // glowState: 'neutral' | 'green' | 'red'
    const glowClass = glowState === 'green' ? 'glow-green' : glowState === 'red' ? 'glow-red' : ''

    return (
        <section className="hero">
            <div className={`hero-bg ${glowClass}`} />
            <div className={`hero-glow-overlay ${glowState === 'green' ? 'glow-green' : glowState === 'red' ? 'glow-red' : 'glow-neutral'}`} />
            <div className="hero-pc-image" />
            <div className="hero-content">
                <span className="hero-badge">PC Builder Tool</span>
                <h1>
                    Build & Score <span className="accent">PC</span>
                </h1>
                <p>
                    Check component compatibility and build the perfect PC configuration
                    with smart suggestions from our system.
                </p>
            </div>
        </section>
    )
}
