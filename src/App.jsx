import { useState, useMemo, useCallback, useEffect } from 'react'
import { componentCategories, allComponents, presetBuilds } from './data/components'
import { checkCompatibility, getSmartSuggestions, formatPrice, calculateTotalPrice } from './utils/compatibilityEngine'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PresetBuilds from './components/PresetBuilds'
import ComponentRow from './components/ComponentRow'
import CompatibilityPanel from './components/CompatibilityPanel'
import ComponentModal from './components/ComponentModal'
import CheckoutModal from './components/CheckoutModal'
import Footer from './components/Footer'
import './index.css'

function App() {
  const [isDark, setIsDark] = useState(false) // Default: light theme
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null, vga: null, mainboard: null, ram: null,
    ssd: null, hdd: null, psu: null, cooling: null, case: null,
  })
  const [modalCategory, setModalCategory] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  const compatibility = useMemo(() => checkCompatibility(selectedComponents), [selectedComponents])
  const suggestions = useMemo(() => getSmartSuggestions(selectedComponents, allComponents), [selectedComponents])
  const totalPrice = useMemo(() => calculateTotalPrice(selectedComponents), [selectedComponents])

  const heroGlowState = useMemo(() => {
    if (compatibility.selectedCount < 2) return 'neutral'
    if (compatibility.issues.length > 0) return 'red'
    if (compatibility.score >= 70) return 'green'
    return 'neutral'
  }, [compatibility])

  const handleSelectComponent = useCallback((category, component) => {
    setSelectedComponents(prev => ({ ...prev, [category]: component }))
    setModalCategory(null)
  }, [])

  const handleRemoveComponent = useCallback((category) => {
    setSelectedComponents(prev => ({ ...prev, [category]: null }))
  }, [])

  const handleOpenModal = useCallback((category) => { setModalCategory(category) }, [])
  const handleCloseModal = useCallback(() => { setModalCategory(null) }, [])

  const handleApplyPreset = useCallback((preset) => {
    const newComponents = {}
    for (const [category, componentId] of Object.entries(preset.components)) {
      const componentList = allComponents[category]
      newComponents[category] = componentList?.find(c => c.id === componentId) || null
    }
    for (const cat of componentCategories) {
      if (!(cat.id in newComponents)) newComponents[cat.id] = null
    }
    setSelectedComponents(newComponents)
  }, [])

  const handleReset = useCallback(() => {
    setSelectedComponents({
      cpu: null, vga: null, mainboard: null, ram: null,
      ssd: null, hdd: null, psu: null, cooling: null, case: null,
    })
  }, [])

  const getComponentStatus = useCallback((categoryId) => {
    const hasIssue = compatibility.issues.some(i => i.components?.includes(categoryId))
    const hasWarning = compatibility.warnings.some(w => w.components?.includes(categoryId))
    return { hasIssue, hasWarning }
  }, [compatibility])

  return (
    <>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />
      <Hero glowState={heroGlowState} />
      <PresetBuilds presets={presetBuilds} onApplyPreset={handleApplyPreset} />

      <div className="builder-layout">
        <div className="selector-panel">
          <div className="selector-panel-header">
            <h2>Technical Specs</h2>
          </div>
          {componentCategories.map((cat) => {
            const status = getComponentStatus(cat.id)
            return (
              <ComponentRow
                key={cat.id}
                category={cat}
                selected={selectedComponents[cat.id]}
                onSelect={() => handleOpenModal(cat.id)}
                onRemove={() => handleRemoveComponent(cat.id)}
                hasIssue={status.hasIssue}
                hasWarning={status.hasWarning}
              />
            )
          })}
        </div>

        <CompatibilityPanel
          compatibility={compatibility}
          totalPrice={totalPrice}
          suggestions={suggestions}
          selectedComponents={selectedComponents}
          onSelectSuggestion={handleSelectComponent}
          onReset={handleReset}
          onCheckout={() => setIsCheckoutOpen(true)}
        />
      </div>

      {modalCategory && (
        <ComponentModal
          category={modalCategory}
          components={allComponents[modalCategory] || []}
          selectedComponents={selectedComponents}
          onSelect={(component) => handleSelectComponent(modalCategory, component)}
          onClose={handleCloseModal}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          selectedComponents={selectedComponents}
          totalPrice={totalPrice}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      <Footer />
    </>
  )
}

export default App
