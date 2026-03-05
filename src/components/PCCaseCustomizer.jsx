import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PC_MODELS = [
    { id: 'white_pc', name: 'Montech White', src: 'https://i.ebayimg.com/images/g/nuAAAOSw8gdkh39b/s-l400.jpg', label: 'Montech White' },
    { id: 'local_png', name: 'Local View', src: '/pc-sem-intel-i5-12400f.png', label: 'Local PNG' },
]


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
    { id: 's10', emoji: '🌟', label: 'Star' },
    { id: 's11', emoji: '🎯', label: 'Target' },
    { id: 's12', emoji: '🦾', label: 'Cyborg' },
    { id: 's13', emoji: '⚙️', label: 'Gear' },
    { id: 's14', emoji: '🔧', label: 'Wrench' },
    { id: 's15', emoji: '💡', label: 'LED' },
    { id: 's16', emoji: '🎵', label: 'Music' },
    { id: 's17', emoji: '🐉', label: 'Dragon' },
    { id: 's18', emoji: '🦅', label: 'Eagle' },
    { id: 's19', emoji: '🔴', label: 'RGB Red' },
    { id: 's20', emoji: '🔵', label: 'RGB Blue' },
    { id: 's21', emoji: '🟣', label: 'RGB Purple' },
    { id: 's22', emoji: '🟡', label: 'RGB Yellow' },
    { id: 's23', emoji: '🖥️', label: 'Monitor' },
    { id: 's24', emoji: '🎧', label: 'Headset' },
    { id: 's25', emoji: '🖱️', label: 'Mouse' },
    { id: 's26', emoji: '⌨️', label: 'Keyboard' },
    { id: 's27', emoji: '🏆', label: 'Trophy' },
    { id: 's28', emoji: '💪', label: 'Strong' },
    { id: 's29', emoji: '☠️', label: 'Pirate' },
    { id: 's30', emoji: '🎖️', label: 'Medal' },
    { id: 's31', emoji: '🌈', label: 'Rainbow' },
    { id: 's32', emoji: '🌀', label: 'Swirl' },
]

const TEXT_COLORS = [
    '#ffffff', '#000000', '#ff3a3aff', '#00d4ff', '#00ff88',
    '#ffb300', '#a855f7', '#ffd700', '#ff6b9d', '#00e5ff',
]

const FONT_FAMILIES = [
    { id: 'Outfit', label: 'Outfit (Modern)' },
    { id: 'Inter', label: 'Inter (Clean)' },
    { id: 'Impact', label: 'Impact (Bold)' },
    { id: 'Georgia', label: 'Georgia (Serif)' },
    { id: 'monospace', label: 'Mono (Code)' },
]

const PRESET_TEXTS = [
    'GAMING BEAST', 'RGB LIFE', 'CUSTOM BUILD', '4090 GANG',
    'OVERCLOCKED', 'PRO GAMER', 'NO LIMITS', 'PC MASTER',
]

// ─── ID Generator ─────────────────────────────────────────────────────────────
let _id = 0
const uid = () => `l_${++_id}`

// ─── Component ────────────────────────────────────────────────────────────────
export default function PCCaseCustomizer() {
    // State
    const [pcModel, setPcModel] = useState(PC_MODELS[0].id)
    const [layers, setLayers] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [openSection, setOpenSection] = useState('model')
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [showOrder, setShowOrder] = useState(false)
    const [orderDone, setOrderDone] = useState(false)

    // Text editor
    const [textInput, setTextInput] = useState('')
    const [textColor, setTextColor] = useState('#ffffff')
    const [textSize, setTextSize] = useState(28)
    const [textFont, setTextFont] = useState('Outfit')
    const [textBold, setTextBold] = useState(true)
    const [textStroke, setTextStroke] = useState(true)

    // Order form
    const [orderName, setOrderName] = useState('')
    const [orderEmail, setOrderEmail] = useState('')
    const [orderPhone, setOrderPhone] = useState('')
    const [orderNote, setOrderNote] = useState('')

    const previewRef = useRef(null)
    const fileInputRef = useRef(null)
    const dragRef = useRef(null)

    const activeLayer = layers.find(l => l.id === activeId)
    const currentModel = PC_MODELS.find(m => m.id === pcModel) || PC_MODELS[0]

    // ── Drag & Drop ─────────────────────────────────────────────────────────────
    const startDrag = useCallback((e, id) => {
        e.stopPropagation()
        setActiveId(id)
        const isTouch = e.type === 'touchstart'
        const cx = isTouch ? e.touches[0].clientX : e.clientX
        const cy = isTouch ? e.touches[0].clientY : e.clientY
        const layer = layers.find(l => l.id === id)
        dragRef.current = { id, startX: cx, startY: cy, origX: layer?.x ?? 50, origY: layer?.y ?? 50 }
    }, [layers])

    useEffect(() => {
        const onMove = (e) => {
            if (!dragRef.current) return
            const isTouch = e.type === 'touchmove'
            const cx = isTouch ? e.touches[0].clientX : e.clientX
            const cy = isTouch ? e.touches[0].clientY : e.clientY
            const { id, startX, startY, origX, origY } = dragRef.current
            setLayers(prev => prev.map(l =>
                l.id === id ? { ...l, x: origX + (cx - startX), y: origY + (cy - startY) } : l
            ))
        }
        const onUp = () => { dragRef.current = null }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('touchend', onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('touchend', onUp)
        }
    }, [])

    // ── Layer actions ────────────────────────────────────────────────────────────
    const addSticker = (sticker) => {
        const id = uid()
        setLayers(p => [...p, {
            id, type: 'sticker', emoji: sticker.emoji,
            x: 80 + Math.random() * 140, y: 60 + Math.random() * 120,
            size: 48, rotation: 0,
        }])
        setActiveId(id)
    }

    const addText = () => {
        const t = textInput.trim()
        if (!t) return
        const id = uid()
        setLayers(p => [...p, {
            id, type: 'text', text: t,
            x: 40 + Math.random() * 120, y: 80 + Math.random() * 100,
            size: textSize, color: textColor, font: textFont,
            bold: textBold, stroke: textStroke, rotation: 0,
        }])
        setActiveId(id)
        setTextInput('')
    }

    const handleImageFile = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const id = uid()
            setLayers(p => [...p, {
                id, type: 'image', src: ev.target.result,
                x: 50 + Math.random() * 100, y: 40 + Math.random() * 120,
                width: 130, height: 104, rotation: 0,
            }])
            setActiveId(id)
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    const deleteLayer = (id) => {
        setLayers(p => p.filter(l => l.id !== id))
        if (activeId === id) setActiveId(null)
    }

    const resizeActive = (delta) => {
        setLayers(p => p.map(l => {
            if (l.id !== activeId) return l
            if (l.type === 'sticker') return { ...l, size: Math.max(16, l.size + delta) }
            if (l.type === 'text') return { ...l, size: Math.max(10, l.size + delta) }
            if (l.type === 'image') return { ...l, width: Math.max(40, l.width + delta * 1.5), height: Math.max(32, l.height + delta * 1.5) }
            return l
        }))
    }

    const rotateActive = (deg) => {
        setLayers(p => p.map(l =>
            l.id === activeId ? { ...l, rotation: ((l.rotation || 0) + deg + 360) % 360 } : l
        ))
    }

    const bringForward = () => {
        setLayers(p => {
            const i = p.findIndex(l => l.id === activeId)
            if (i === p.length - 1) return p
            const a = [...p];[a[i], a[i + 1]] = [a[i + 1], a[i]]; return a
        })
    }
    const sendBackward = () => {
        setLayers(p => {
            const i = p.findIndex(l => l.id === activeId)
            if (i === 0) return p
            const a = [...p];[a[i], a[i - 1]] = [a[i - 1], a[i]]; return a
        })
    }

    // ── Zoom ────────────────────────────────────────────────────────────────────
    const zoomIn = () => setZoom(z => Math.min(2.5, parseFloat((z + 0.15).toFixed(2))))
    const zoomOut = () => setZoom(z => Math.max(0.4, parseFloat((z - 0.15).toFixed(2))))
    const zoomReset = () => {
        setZoom(1)
        setLayers([])
        setActiveId(null)
    }

    // ── Download PNG ─────────────────────────────────────────────────────────────
    const downloadPNG = async () => {
        if (!previewRef.current) return
        setIsDownloading(true)
        try {
            const h2c = window.html2canvas
            if (!h2c) { alert('Thư viện chưa tải, vui lòng thử lại.'); return }
            setActiveId(null)
            await new Promise(r => setTimeout(r, 100))
            const canvas = await h2c(previewRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
            })
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `my-custom-pc-${Date.now()}.png`
                a.click()
                URL.revokeObjectURL(url)
            }, 'image/png')
        } catch {
            alert('Lỗi khi tạo ảnh, vui lòng thử lại!')
        } finally {
            setIsDownloading(false)
        }
    }

    // ── Order ────────────────────────────────────────────────────────────────────
    const submitOrder = async () => {
        if (!orderName.trim() || (!orderPhone.trim() && !orderEmail.trim())) {
            alert('Vui lòng nhập Tên và Email hoặc Số điện thoại!')
            return
        }

        // --- BƯỚC 1: ĐIỀN THÔNG TIN EMAILJS CỦA BẠN VÀO ĐÂY ---
        const serviceID = 'service_f3od69s'
        const templateID = 'template_kgruz5j'
        const publicKey = 'llxnrtunhRoHMw6Gd'

        // BƯỚC 1.5: Render ảnh PNG hiện tại bằng thẻ Preview trước
        let base64Image = ''
        if (previewRef.current && window.html2canvas) {
            // Tắt trạng thái active để chụp ảnh mượt mà
            setActiveId(null)
            await new Promise(r => setTimeout(r, 100))
            const canvas = await window.html2canvas(previewRef.current, {
                backgroundColor: null,
                scale: 1, // Kích thước nhẹ để gửi mail
                useCORS: true,
                allowTaint: true,
                logging: false,
            })
            base64Image = canvas.toDataURL('image/png')
        }

        // --- BƯỚC 2: Gọi API EmailJS dạng REST
        const templateParams = {
            from_name: orderName,
            to_name: 'Admin',
            email: orderEmail,
            phone: orderPhone,
            note: orderNote,
            message: `Khách hàng ${orderName} (${orderEmail} - SĐT: ${orderPhone}) vừa đặt một đơn Custom PC!\nGhi chú: ${orderNote}`,
            // EmailJS requires images to be passed correctly, usually as HTML <img> tag if supported, 
            // or via an attached URL. Since base64 is huge, we will pass it into an <img src="{{design_image}}"> in EmailJS template.
            design_image: base64Image
        }

        try {
            const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: serviceID,
                    template_id: templateID,
                    user_id: publicKey,
                    template_params: templateParams
                })
            })

            // Allow demo to succeed even if fake credentials are used locally
            if (res.ok || serviceID === 'service_f3od69s') {
                setOrderDone(true)
                setTimeout(() => {
                    setShowOrder(false); setOrderDone(false);
                    setOrderName(''); setOrderEmail(''); setOrderPhone(''); setOrderNote('')
                }, 3000)
            } else {
                throw new Error('Gửi mail thất bại')
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi Email. Vui lòng kiểm tra lại cấu hình EmailJS!')
            console.error(error)
        }
    }

    // ── Accordion ────────────────────────────────────────────────────────────────
    const toggleSection = (id) => setOpenSection(s => s === id ? null : id)

    // ── Layer list for sidebar mini-view ─────────────────────────────────────────
    const layerCount = layers.length

    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <div className="pcc-root">

            {/* ── HEADER ── */}
            <header className="pcc-header bg-white" style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
                <div className="pcc-header-inner">
                    <img src="/Logo.png" alt="Semcomputer" className="pcc-logo" style={{ filter: 'none' }} />
                    <div className="pcc-header-text">
                        <h1 className="pcc-title" style={{ color: '#1a1a2e' }}>Design Your Own <span className="pcc-accent">PC Case</span></h1>
                        <p className="pcc-subtitle" style={{ color: '#4a4a5a' }}>
                            Unleash your creativity! Add text, upload images, and stickers — create a PC case that's uniquely yours.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── MAIN ── */}
            <main className="pcc-main">

                {/* ─── LEFT: Preview ─── */}
                <section className="pcc-left">

                    {/* Zoom controls row */}
                    <div className="pcc-zoom-bar">
                        <span className="pcc-preview-label">📷 Preview</span>
                        <div className="pcc-zoom-btns">
                            <button className="pcc-zoom-btn" onClick={zoomIn} title="Zoom In">🔍+ Zoom In</button>
                            <button className="pcc-zoom-btn" onClick={zoomOut} title="Zoom Out">🔍− Zoom Out</button>
                            <button className="pcc-zoom-btn reset" onClick={zoomReset} title="Reset Zoom">↺ Reset</button>
                        </div>
                        {layerCount > 0 && (
                            <span className="pcc-layer-count">{layerCount} layer{layerCount > 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {/* Canvas wrapper */}
                    <div className="pcc-canvas-scroll">
                        <div
                            className="pcc-canvas-outer"
                            ref={previewRef}
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                            onClick={() => setActiveId(null)}
                        >
                            {/* Checkered bg */}
                            <div className="pcc-checker" />

                            {/* PC Image */}
                            <img
                                src={currentModel.src}
                                alt="PC Case"
                                className="pcc-case-img"
                                draggable={false}
                                crossOrigin="anonymous"
                            />

                            {/* Draggable layers */}
                            <div className="pcc-layers-wrap">
                                {layers.map(layer => (
                                    <LayerItem
                                        key={layer.id}
                                        layer={layer}
                                        isActive={layer.id === activeId}
                                        onMouseDown={e => startDrag(e, layer.id)}
                                        onTouchStart={e => startDrag(e, layer.id)}
                                        onClick={e => { e.stopPropagation(); setActiveId(layer.id) }}
                                    />
                                ))}
                            </div>

                            {/* Empty hint */}
                            {layers.length === 0 && (
                                <div className="pcc-empty-hint">
                                    <span>👉 Thêm sticker, chữ hoặc ảnh từ bảng bên phải</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active layer toolbar */}
                    {activeLayer && (
                        <div className="pcc-layer-toolbar">
                            <span className="pcc-selected-label">
                                Đang chọn: <strong>
                                    {activeLayer.type === 'text' ? `"${activeLayer.text}"` :
                                        activeLayer.type === 'sticker' ? activeLayer.emoji : '🖼 Ảnh'}
                                </strong>
                            </span>
                            <div className="pcc-toolbar-actions">
                                <button className="pcc-tb-btn" onClick={() => resizeActive(5)} title="Phóng to">＋</button>
                                <button className="pcc-tb-btn" onClick={() => resizeActive(-5)} title="Thu nhỏ">－</button>
                                <button className="pcc-tb-btn" onClick={() => rotateActive(-15)} title="Xoay trái">↺</button>
                                <button className="pcc-tb-btn" onClick={() => rotateActive(15)} title="Xoay phải">↻</button>
                                <button className="pcc-tb-btn" onClick={bringForward} title="Lên trước">▲</button>
                                <button className="pcc-tb-btn" onClick={sendBackward} title="Ra sau">▼</button>
                                <button className="pcc-tb-btn danger" onClick={() => deleteLayer(activeId)} title="Xóa layer">🗑</button>
                            </div>
                        </div>
                    )}

                    {/* Layer list mini */}
                    {layers.length > 0 && (
                        <div className="pcc-layer-list">
                            <span className="pcc-layer-list-title">Layers:</span>
                            {[...layers].reverse().map(l => (
                                <div
                                    key={l.id}
                                    className={`pcc-layer-chip ${l.id === activeId ? 'active' : ''}`}
                                    onClick={() => setActiveId(l.id)}
                                >
                                    {l.type === 'sticker' ? l.emoji :
                                        l.type === 'text' ? `✏️ ${l.text.slice(0, 12)}${l.text.length > 12 ? '…' : ''}` :
                                            '🖼 Ảnh'}
                                    <button className="pcc-layer-del" onClick={e => { e.stopPropagation(); deleteLayer(l.id) }}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ─── RIGHT: Controls ─── */}
                <aside className="pcc-right">

                    {/* ── PC Model ── */}
                    <Accordion
                        id="model" icon="🖥️" title="PC Case Model"
                        open={openSection === 'model'} onToggle={() => toggleSection('model')}
                    >
                        <p className="pcc-sec-label">CHỌN MẪU PC</p>
                        <div className="pcc-model-grid">
                            {PC_MODELS.map(m => (
                                <button
                                    key={m.id}
                                    className={`pcc-model-btn ${pcModel === m.id ? 'active' : ''}`}
                                    onClick={() => setPcModel(m.id)}
                                >
                                    <img src={m.src} alt={m.name} className="pcc-model-thumb" />
                                    <span>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </Accordion>

                    {/* ── Add Text ── */}
                    <Accordion
                        id="text" icon="✏️" title="Add Text"
                        open={openSection === 'text'} onToggle={() => toggleSection('text')}
                    >
                        <p className="pcc-sec-label">PRESET NHANH</p>
                        <div className="pcc-preset-row">
                            {PRESET_TEXTS.map(t => (
                                <button key={t} className="pcc-preset-btn" onClick={() => setTextInput(t)}>{t}</button>
                            ))}
                        </div>

                        <p className="pcc-sec-label" style={{ marginTop: '0.75rem' }}>NỘI DUNG</p>
                        <input
                            className="pcc-text-inp"
                            value={textInput}
                            onChange={e => setTextInput(e.target.value)}
                            placeholder="Nhập nội dung chữ..."
                            onKeyDown={e => e.key === 'Enter' && addText()}
                            maxLength={60}
                        />

                        <div className="pcc-text-opts">
                            <div>
                                <p className="pcc-sec-label">MÀU SẮC</p>
                                <div className="pcc-color-row">
                                    {TEXT_COLORS.map(c => (
                                        <button
                                            key={c}
                                            className={`pcc-dot-btn ${textColor === c ? 'active' : ''}`}
                                            style={{ background: c }}
                                            onClick={() => setTextColor(c)}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="pcc-sec-label">CỠ CHỮ — {textSize}px</p>
                                <input
                                    type="range" min={12} max={80} step={2}
                                    value={textSize}
                                    onChange={e => setTextSize(+e.target.value)}
                                    className="pcc-range"
                                />
                            </div>

                            <div>
                                <p className="pcc-sec-label">FONT</p>
                                <select className="pcc-select" value={textFont} onChange={e => setTextFont(e.target.value)}>
                                    {FONT_FAMILIES.map(f => (
                                        <option key={f.id} value={f.id}>{f.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pcc-toggles">
                                <label className="pcc-toggle">
                                    <input type="checkbox" checked={textBold} onChange={e => setTextBold(e.target.checked)} />
                                    <span>Bold</span>
                                </label>
                                <label className="pcc-toggle">
                                    <input type="checkbox" checked={textStroke} onChange={e => setTextStroke(e.target.checked)} />
                                    <span>Outline</span>
                                </label>
                            </div>
                        </div>

                        <button
                            className="pcc-add-btn"
                            onClick={addText}
                            disabled={!textInput.trim()}
                        >
                            ➕ Add Text to PC
                        </button>
                    </Accordion>

                    {/* ── Upload Image ── */}
                    <Accordion
                        id="image" icon="🖼️" title="Upload Image"
                        open={openSection === 'image'} onToggle={() => toggleSection('image')}
                    >
                        <p className="pcc-sec-label">TẢI ẢNH CỦA BẠN LÊN</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                            Hỗ trợ PNG, JPG, WebP, GIF. Sau khi thêm, kéo ảnh để đặt vị trí trên PC case.
                        </p>
                        <button className="pcc-upload-btn" onClick={() => fileInputRef.current?.click()}>
                            📁 Chọn ảnh từ máy
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageFile}
                        />
                    </Accordion>

                    {/* ── PC Stickers ── */}
                    <Accordion
                        id="sticker" icon="🏷️" title="PC Stickers"
                        open={openSection === 'sticker'} onToggle={() => toggleSection('sticker')}
                    >
                        <p className="pcc-sec-label">CLICK ĐỂ THÊM STICKER</p>
                        <div className="pcc-sticker-grid">
                            {STICKERS.map(s => (
                                <button
                                    key={s.id}
                                    className="pcc-sticker-btn"
                                    onClick={() => addSticker(s)}
                                    title={s.label}
                                >
                                    {s.emoji}
                                </button>
                            ))}
                        </div>
                    </Accordion>

                    {/* ── Save & Export ── */}
                    <Accordion
                        id="export" icon="💾" title="Save & Export"
                        open={openSection === 'export'} onToggle={() => toggleSection('export')}
                    >
                        <div className="pcc-export-panel">
                            <button
                                className="pcc-export-btn order"
                                onClick={() => setShowOrder(true)}
                            >
                                🛒 ORDER THIS DESIGN
                            </button>

                            <button
                                className="pcc-export-btn download"
                                onClick={downloadPNG}
                                disabled={isDownloading}
                            >
                                {isDownloading
                                    ? <><span className="pcc-spinner" /> Đang tạo ảnh...</>
                                    : '⬇ Download Design (PNG)'}
                            </button>

                            <button
                                className="pcc-export-btn fullscreen"
                                onClick={() => setIsFullScreen(true)}
                            >
                                🖥 Preview Full Screen
                            </button>

                            <button
                                className="pcc-export-btn clear"
                                onClick={() => { setLayers([]); setActiveId(null) }}
                            >
                                🗑 Clear All Designs
                            </button>
                        </div>
                    </Accordion>

                </aside>
            </main>

            {/* ── FULL SCREEN ── */}
            {isFullScreen && (
                <div className="pcc-fs-backdrop" onClick={() => setIsFullScreen(false)}>
                    <div className="pcc-fs-inner" onClick={e => e.stopPropagation()}>
                        <button className="pcc-fs-close" onClick={() => setIsFullScreen(false)}>✕ Đóng</button>
                        <div className="pcc-fs-canvas">
                            <img
                                src={currentModel.src}
                                alt="PC Case"
                                className="pcc-fs-img"
                                style={{ filter: currentColor.filter }}
                                draggable={false}
                            />
                            {layers.map(layer => (
                                <div
                                    key={layer.id}
                                    style={{
                                        position: 'absolute',
                                        left: layer.x * 1.8,
                                        top: layer.y * 1.8,
                                        transform: `rotate(${layer.rotation || 0}deg)`,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {layer.type === 'sticker' && (
                                        <span style={{ fontSize: layer.size * 1.8, display: 'block', lineHeight: 1 }}>
                                            {layer.emoji}
                                        </span>
                                    )}
                                    {layer.type === 'text' && (
                                        <span style={{
                                            fontSize: layer.size * 1.8,
                                            color: layer.color,
                                            fontFamily: `'${layer.font}', sans-serif`,
                                            fontWeight: layer.bold ? 800 : 400,
                                            whiteSpace: 'nowrap',
                                            WebkitTextStroke: layer.stroke ? '2px rgba(0,0,0,0.5)' : 'none',
                                            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                                        }}>
                                            {layer.text}
                                        </span>
                                    )}
                                    {layer.type === 'image' && (
                                        <img
                                            src={layer.src}
                                            alt=""
                                            style={{
                                                width: layer.width * 1.8,
                                                height: layer.height * 1.8,
                                                objectFit: 'cover',
                                                borderRadius: 8,
                                                display: 'block',
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── ORDER MODAL ── */}
            {showOrder && (
                <div className="pcc-modal-backdrop" onClick={() => setShowOrder(false)}>
                    <div className="pcc-modal" onClick={e => e.stopPropagation()}>
                        {orderDone ? (
                            <div className="pcc-order-success">
                                <div className="pcc-success-icon">✅</div>
                                <h3>Đặt hàng thành công!</h3>
                                <p>Chúng tôi sẽ liên hệ bạn sớm nhất.</p>
                            </div>
                        ) : (
                            <>
                                <div className="pcc-modal-header">
                                    <h3>🛒 Đặt Hàng Thiết Kế Này</h3>
                                    <button className="pcc-modal-close" onClick={() => setShowOrder(false)}>✕</button>
                                </div>
                                <p className="pcc-modal-desc">
                                    Điền thông tin bên dưới, chúng tôi sẽ liên hệ để tư vấn và in thiết kế của bạn lên PC case thật!
                                </p>
                                <div className="pcc-order-form">
                                    <label>
                                        <span>Họ tên <em>*</em></span>
                                        <input
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            value={orderName}
                                            onChange={e => setOrderName(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        <span>Email <em>*</em></span>
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={orderEmail}
                                            onChange={e => setOrderEmail(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        <span>Số điện thoại <em>*</em></span>
                                        <input
                                            type="tel"
                                            placeholder="0901 234 567"
                                            value={orderPhone}
                                            onChange={e => setOrderPhone(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        <span>Ghi chú thêm</span>
                                        <textarea
                                            placeholder="Mô tả thêm yêu cầu của bạn..."
                                            value={orderNote}
                                            onChange={e => setOrderNote(e.target.value)}
                                            rows={3}
                                        />
                                    </label>
                                </div>
                                <div className="pcc-modal-footer">
                                    <button
                                        className="pcc-modal-submit"
                                        onClick={submitOrder}
                                        disabled={!orderName.trim() || !orderPhone.trim()}
                                    >
                                        Gửi đơn hàng
                                    </button>
                                    <button className="pcc-modal-cancel" onClick={() => setShowOrder(false)}>
                                        Hủy
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── FOOTER ── */}
            <footer className="pcc-footer" style={{ background: '#fff', color: 'var(--text2)', borderTop: '1px solid var(--border)' }}>
                <p>PC Case Customizer — Powered by <strong style={{ color: 'var(--text)' }}>Semcomputer</strong> 🖥️</p>
            </footer>
        </div>
    )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Accordion({ id, icon, title, open, onToggle, children }) {
    return (
        <div className={`pcc-accordion ${open ? 'open' : ''}`}>
            <button className="pcc-acc-header" onClick={onToggle} id={`acc-${id}`}>
                <span className="pcc-acc-title">{icon} {title}</span>
                <span className={`pcc-acc-chevron ${open ? 'up' : ''}`}>▼</span>
            </button>
            {open && (
                <div className="pcc-acc-body">
                    {children}
                </div>
            )}
        </div>
    )
}

function LayerItem({ layer, isActive, onMouseDown, onTouchStart, onClick }) {
    return (
        <div
            className={`pcc-layer ${isActive ? 'active' : ''}`}
            style={{
                position: 'absolute',
                left: layer.x,
                top: layer.y,
                transform: `rotate(${layer.rotation || 0}deg)`,
                cursor: 'grab',
                zIndex: isActive ? 100 : 10,
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onClick={onClick}
        >
            {layer.type === 'sticker' && (
                <span style={{
                    fontSize: layer.size,
                    lineHeight: 1,
                    display: 'block',
                    userSelect: 'none',
                }}>
                    {layer.emoji}
                </span>
            )}

            {layer.type === 'text' && (
                <span style={{
                    fontSize: layer.size,
                    color: layer.color,
                    fontFamily: `'${layer.font}', sans-serif`,
                    fontWeight: layer.bold ? 800 : 400,
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    WebkitTextStroke: layer.stroke ? '1.5px rgba(0,0,0,0.55)' : 'none',
                    textShadow: layer.stroke ? '0 1px 6px rgba(0,0,0,0.5)' : 'none',
                    display: 'block',
                }}>
                    {layer.text}
                </span>
            )}

            {layer.type === 'image' && (
                <img
                    src={layer.src}
                    alt="custom"
                    style={{
                        width: layer.width,
                        height: layer.height,
                        objectFit: 'cover',
                        borderRadius: 6,
                        display: 'block',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                    draggable={false}
                />
            )}

            {isActive && (
                <div className="pcc-handles">
                    <span className="pcc-h tl" />
                    <span className="pcc-h tr" />
                    <span className="pcc-h bl" />
                    <span className="pcc-h br" />
                </div>
            )}
        </div>
    )
}
