import { useState, useRef, useCallback, useEffect } from 'react'

const STICKERS = [
    { id: 's1', emoji: '⚡', label: 'Lightning' },
    { id: 's2', emoji: '🔥', label: 'Fire' },
    { id: 's3', emoji: '💎', label: 'Diamond' },
    { id: 's4', emoji: '🎮', label: 'Gaming' },
    { id: 's5', emoji: '🚀', label: 'Rocket' },
    { id: 's6', emoji: '💀', label: 'Skull' },
    { id: 's7', emoji: '🤖', label: 'Robot' },
    { id: 's8', emoji: '👑', label: 'Crown' },
    { id: 's9', emoji: '❄️', label: 'Ice' },
    { id: 's10', emoji: '🌈', label: 'Rainbow' },
    { id: 's11', emoji: '🎯', label: 'Target' },
    { id: 's12', emoji: '💻', label: 'Laptop' },
    { id: 's13', emoji: '🎵', label: 'Music' },
    { id: 's14', emoji: '🦅', label: 'Eagle' },
    { id: 's15', emoji: '🌟', label: 'Star' },
    { id: 's16', emoji: '🐉', label: 'Dragon' },
]

const PRESET_TEXTS = [
    'GAMING BEAST', 'RGB LIFE', 'CUSTOM BUILD', 'POWER USER',
    'PRO GAMER', '4090 GANG', 'OVERCLOCKED', 'NO LIMITS',
]

const TEXT_COLORS = [
    '#ffffff', '#ff3a3a', '#00d4ff', '#00ff88',
    '#ffb300', '#a855f7', '#ff6b6b', '#ffd700',
]

const TEXT_SIZES = [14, 18, 22, 28, 36, 48]

let nextId = 1
function genId() { return `item_${nextId++}` }

export default function PCCustomizer({ pcImageSrc }) {
    const [layers, setLayers] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [tab, setTab] = useState('sticker') // 'sticker' | 'text' | 'image'

    // Text editor state
    const [textInput, setTextInput] = useState('')
    const [textColor, setTextColor] = useState('#ffffff')
    const [textSize, setTextSize] = useState(22)
    const [textBold, setTextBold] = useState(true)
    const [textStroke, setTextStroke] = useState(true)

    const canvasRef = useRef(null)
    const dragState = useRef(null)
    const fileInputRef = useRef(null)

    const activeLayer = layers.find(l => l.id === activeId)

    // --- Drag logic ---
    const onMouseDown = useCallback((e, id) => {
        e.stopPropagation()
        setActiveId(id)
        const rect = canvasRef.current.getBoundingClientRect()
        dragState.current = {
            id,
            startX: e.clientX,
            startY: e.clientY,
            origX: layers.find(l => l.id === id)?.x ?? 0,
            origY: layers.find(l => l.id === id)?.y ?? 0,
            rect,
        }
    }, [layers])

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragState.current) return
            const { id, startX, startY, origX, origY } = dragState.current
            const dx = e.clientX - startX
            const dy = e.clientY - startY
            setLayers(prev => prev.map(l => l.id === id ? { ...l, x: origX + dx, y: origY + dy } : l))
        }
        const onMouseUp = () => { dragState.current = null }
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    // Touch drag
    useEffect(() => {
        const onTouchMove = (e) => {
            if (!dragState.current || !e.touches[0]) return
            const touch = e.touches[0]
            const { id, startX, startY, origX, origY } = dragState.current
            const dx = touch.clientX - startX
            const dy = touch.clientY - startY
            setLayers(prev => prev.map(l => l.id === id ? { ...l, x: origX + dx, y: origY + dy } : l))
        }
        const onTouchEnd = () => { dragState.current = null }
        window.addEventListener('touchmove', onTouchMove, { passive: false })
        window.addEventListener('touchend', onTouchEnd)
        return () => {
            window.removeEventListener('touchmove', onTouchMove)
            window.removeEventListener('touchend', onTouchEnd)
        }
    }, [])

    const onTouchStart = useCallback((e, id) => {
        e.stopPropagation()
        setActiveId(id)
        const touch = e.touches[0]
        dragState.current = {
            id,
            startX: touch.clientX,
            startY: touch.clientY,
            origX: layers.find(l => l.id === id)?.x ?? 0,
            origY: layers.find(l => l.id === id)?.y ?? 0,
        }
    }, [layers])

    // --- Add sticker ---
    const addSticker = (sticker) => {
        const id = genId()
        setLayers(prev => [...prev, {
            id, type: 'sticker', emoji: sticker.emoji,
            x: 60 + Math.random() * 120, y: 60 + Math.random() * 80,
            size: 40, rotation: 0,
        }])
        setActiveId(id)
    }

    // --- Add text ---
    const addText = () => {
        const t = textInput.trim() || 'CUSTOM TEXT'
        const id = genId()
        setLayers(prev => [...prev, {
            id, type: 'text', text: t,
            x: 30 + Math.random() * 100, y: 80 + Math.random() * 60,
            color: textColor, size: textSize, bold: textBold, stroke: textStroke, rotation: 0,
        }])
        setActiveId(id)
        setTextInput('')
    }

    // --- Add image ---
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const id = genId()
            setLayers(prev => [...prev, {
                id, type: 'image', src: ev.target.result,
                x: 40 + Math.random() * 80, y: 30 + Math.random() * 100,
                width: 100, height: 80, rotation: 0,
            }])
            setActiveId(id)
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    // --- Delete / z-order ---
    const deleteActive = () => {
        if (!activeId) return
        setLayers(prev => prev.filter(l => l.id !== activeId))
        setActiveId(null)
    }

    const bringForward = () => {
        if (!activeId) return
        setLayers(prev => {
            const idx = prev.findIndex(l => l.id === activeId)
            if (idx === prev.length - 1) return prev
            const arr = [...prev]
                ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
            return arr
        })
    }

    const sendBackward = () => {
        if (!activeId) return
        setLayers(prev => {
            const idx = prev.findIndex(l => l.id === activeId)
            if (idx === 0) return prev
            const arr = [...prev]
                ;[arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]]
            return arr
        })
    }

    // --- Resize active ---
    const resizeActive = (delta) => {
        if (!activeLayer) return
        setLayers(prev => prev.map(l => {
            if (l.id !== activeId) return l
            if (l.type === 'sticker') return { ...l, size: Math.max(16, (l.size || 40) + delta) }
            if (l.type === 'text') return { ...l, size: Math.max(10, (l.size || 22) + delta) }
            if (l.type === 'image') return {
                ...l,
                width: Math.max(30, (l.width || 100) + delta * 1.5),
                height: Math.max(24, (l.height || 80) + delta * 1.5),
            }
            return l
        }))
    }

    // --- Rotate active ---
    const rotateActive = (deg) => {
        if (!activeLayer) return
        setLayers(prev => prev.map(l => l.id === activeId ? { ...l, rotation: ((l.rotation || 0) + deg + 360) % 360 } : l))
    }

    // --- Reset ---
    const resetAll = () => {
        setLayers([])
        setActiveId(null)
    }

    return (
        <div className="pc-customizer">
            <div className="pc-customizer-header">
                <span className="pc-customizer-title">🎨 Customize Your PC</span>
                <button className="btn-reset-custom" onClick={resetAll} title="Clear all">
                    ↺ Reset
                </button>
            </div>

            {/* Canvas */}
            <div
                className="pc-canvas-wrap"
                ref={canvasRef}
                onClick={() => setActiveId(null)}
            >
                <img
                    src={pcImageSrc}
                    alt="PC Case"
                    className="pc-canvas-base"
                    draggable={false}
                />

                {/* Layers */}
                {layers.map(layer => (
                    <div
                        key={layer.id}
                        className={`pc-layer ${layer.id === activeId ? 'pc-layer-active' : ''}`}
                        style={{
                            left: layer.x,
                            top: layer.y,
                            transform: `rotate(${layer.rotation || 0}deg)`,
                            cursor: 'grab',
                        }}
                        onMouseDown={(e) => onMouseDown(e, layer.id)}
                        onTouchStart={(e) => onTouchStart(e, layer.id)}
                        onClick={(e) => { e.stopPropagation(); setActiveId(layer.id) }}
                    >
                        {layer.type === 'sticker' && (
                            <span style={{ fontSize: layer.size, lineHeight: 1, display: 'block', userSelect: 'none' }}>
                                {layer.emoji}
                            </span>
                        )}
                        {layer.type === 'text' && (
                            <span style={{
                                fontSize: layer.size,
                                color: layer.color,
                                fontWeight: layer.bold ? 800 : 400,
                                fontFamily: "'Outfit', sans-serif",
                                whiteSpace: 'nowrap',
                                userSelect: 'none',
                                WebkitTextStroke: layer.stroke ? `1.5px rgba(0,0,0,0.7)` : 'none',
                                textShadow: layer.stroke ? '0 1px 4px rgba(0,0,0,0.6)' : 'none',
                            }}>
                                {layer.text}
                            </span>
                        )}
                        {layer.type === 'image' && (
                            <img
                                src={layer.src}
                                alt="custom"
                                style={{ width: layer.width, height: layer.height, objectFit: 'cover', borderRadius: 6, display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                                draggable={false}
                            />
                        )}
                        {layer.id === activeId && (
                            <div className="pc-layer-handles">
                                <span className="pc-handle tl" />
                                <span className="pc-handle tr" />
                                <span className="pc-handle bl" />
                                <span className="pc-handle br" />
                            </div>
                        )}
                    </div>
                ))}

                {layers.length === 0 && (
                    <div className="pc-canvas-hint">
                        <span>👇 Thêm sticker, chữ hoặc ảnh bên dưới</span>
                    </div>
                )}
            </div>

            {/* Active layer controls */}
            {activeLayer && (
                <div className="pc-layer-controls">
                    <button className="lc-btn" onClick={() => resizeActive(4)} title="Phóng to">＋</button>
                    <button className="lc-btn" onClick={() => resizeActive(-4)} title="Thu nhỏ">－</button>
                    <button className="lc-btn" onClick={() => rotateActive(-15)} title="Xoay trái">↺</button>
                    <button className="lc-btn" onClick={() => rotateActive(15)} title="Xoay phải">↻</button>
                    <button className="lc-btn" onClick={bringForward} title="Lên trước">▲</button>
                    <button className="lc-btn" onClick={sendBackward} title="Ra sau">▼</button>
                    <button className="lc-btn danger" onClick={deleteActive} title="Xóa">🗑</button>
                </div>
            )}

            {/* Tab bar */}
            <div className="pc-tab-bar">
                <button className={`pc-tab ${tab === 'sticker' ? 'active' : ''}`} onClick={() => setTab('sticker')}>
                    😀 Sticker
                </button>
                <button className={`pc-tab ${tab === 'text' ? 'active' : ''}`} onClick={() => setTab('text')}>
                    ✏️ Chữ
                </button>
                <button className={`pc-tab ${tab === 'image' ? 'active' : ''}`} onClick={() => setTab('image')}>
                    🖼 Ảnh
                </button>
            </div>

            {/* Sticker panel */}
            {tab === 'sticker' && (
                <div className="pc-panel">
                    <div className="sticker-grid">
                        {STICKERS.map(s => (
                            <button key={s.id} className="sticker-btn" onClick={() => addSticker(s)} title={s.label}>
                                {s.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Text panel */}
            {tab === 'text' && (
                <div className="pc-panel">
                    <div className="text-preset-wrap">
                        {PRESET_TEXTS.map(t => (
                            <button key={t} className="text-preset-btn" onClick={() => setTextInput(t)}>{t}</button>
                        ))}
                    </div>
                    <input
                        className="text-input"
                        value={textInput}
                        onChange={e => setTextInput(e.target.value)}
                        placeholder="Nhập nội dung..."
                        onKeyDown={e => e.key === 'Enter' && addText()}
                        maxLength={40}
                    />
                    <div className="text-options">
                        <div className="color-row">
                            {TEXT_COLORS.map(c => (
                                <button
                                    key={c}
                                    className={`color-dot ${textColor === c ? 'active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setTextColor(c)}
                                />
                            ))}
                        </div>
                        <div className="size-row">
                            {TEXT_SIZES.map(s => (
                                <button
                                    key={s}
                                    className={`size-btn ${textSize === s ? 'active' : ''}`}
                                    onClick={() => setTextSize(s)}
                                >{s}</button>
                            ))}
                        </div>
                        <div className="toggle-row">
                            <label className="toggle-label">
                                <input type="checkbox" checked={textBold} onChange={e => setTextBold(e.target.checked)} />
                                <span>Bold</span>
                            </label>
                            <label className="toggle-label">
                                <input type="checkbox" checked={textStroke} onChange={e => setTextStroke(e.target.checked)} />
                                <span>Outline</span>
                            </label>
                        </div>
                    </div>
                    <button className="add-text-btn" onClick={addText}>
                        ➕ Add Text
                    </button>
                </div>
            )}

            {/* Image panel */}
            {tab === 'image' && (
                <div className="pc-panel" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Tải ảnh từ thiết bị (PNG, JPG, WebP...)
                    </p>
                    <button className="upload-img-btn" onClick={() => fileInputRef.current?.click()}>
                        📁 Chọn ảnh từ máy
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Sau khi thêm, kéo để đặt vị trí trên PC
                    </p>
                </div>
            )}
        </div>
    )
}
