import { formatPrice } from '../utils/compatibilityEngine'
import { CategoryIcon, CloseIcon } from './Icons'

export default function ComponentRow({ category, selected, onSelect, onRemove, hasIssue, hasWarning }) {
    let rowClass = 'component-row'
    if (hasIssue) rowClass += ' has-issue'
    else if (hasWarning) rowClass += ' has-warning'
    else if (selected) rowClass += ' selected'

    return (
        <div className={rowClass}>
            <div className="component-number">{category.order}</div>
            <div className="component-info">
                <div className="component-icon-wrap">
                    <CategoryIcon categoryId={category.id} size={22} />
                </div>
                <div className="component-label">
                    <div className="category-name">{category.name}</div>
                    {selected ? (
                        <>
                            <div className="selected-name">
                                {selected.name}
                                {hasIssue && <span className="status-dot error" />}
                                {hasWarning && !hasIssue && <span className="status-dot warning" />}
                            </div>
                            <div className="selected-price">{formatPrice(selected.price)}</div>
                        </>
                    ) : (
                        <div className="placeholder">Select component</div>
                    )}
                </div>
            </div>
            <div className="component-actions">
                {selected && (
                    <button className="btn-remove" onClick={onRemove} title="Remove">
                        <CloseIcon size={12} />
                    </button>
                )}
                <button className="btn-select" onClick={onSelect}>
                    SELECT
                </button>
            </div>
        </div>
    )
}
