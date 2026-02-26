import { LightningIcon } from './Icons'

export default function PresetBuilds({ presets, onApplyPreset }) {
    return (
        <section className="presets-section">
            <div className="presets-header-main">
                <LightningIcon size={18} />
                <h2>Quick Configurations</h2>
            </div>

            {presets.map((categoryGroup, index) => (
                <div key={index} className="preset-category-block">
                    <h3 className="category-title">+ {categoryGroup.category}</h3>
                    <div className="preset-grid">
                        {categoryGroup.items.map((preset) => (
                            <div
                                key={preset.id}
                                className="preset-card-new"
                                onClick={() => onApplyPreset(preset)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && onApplyPreset(preset)}
                            >
                                <div className="card-image-wrapper">
                                    <div className="discount-badge">ON SALE</div>
                                    <img src={preset.image} alt={preset.name} />
                                    <div className="card-overlay">
                                        <div className="overlay-btn">Get Build</div>
                                    </div>
                                </div>
                                <div className="card-info">
                                    <h4 className="card-name">{preset.name}</h4>
                                    <p className="card-desc">{preset.description}</p>
                                    <div className="price-container">
                                        <span className="old-price">{preset.originalPrice}</span>
                                        <span className="new-price">{preset.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
