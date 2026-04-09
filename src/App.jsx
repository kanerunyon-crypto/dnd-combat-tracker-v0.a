import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('setup')
  const [combatants, setCombatants] = useState([])
  const [tempCombatants, setTempCombatants] = useState([])
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0)
  const [roundNum, setRoundNum] = useState(1)
  const [totalDamage, setTotalDamage] = useState(0)
  const [actionHistory, setActionHistory] = useState([])
  const [timerRunning, setTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [currentTurnId, setCurrentTurnId] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [newCombatant, setNewCombatant] = useState({ name: '', initiative: 0, maxHp: 0, isPlayer: true })
  const [newInitiative, setNewInitiative] = useState('')
  const [damageType, setDamageType] = useState('Fire')
  const [presets, setPresets] = useState({})
  const [editingPresetKey, setEditingPresetKey] = useState(null)
  const [editingPreset, setEditingPreset] = useState(null)
  const [selectedCombatants, setSelectedCombatants] = useState([])
  const [damageByType, setDamageByType] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDeadOnly, setFilterDeadOnly] = useState(false)

  const damageTypes = ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning",
    "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"]
  
  const conditions = [
    "Prone", "Poisoned", "Concentrating", "Restrained", "Blinded", 
    "Incapacitated", "Stunned", "Paralyzed", "Charmed", "Frightened", "Invisible", "Grappled"
  ]

  const [selectedCondition, setSelectedCondition] = useState(conditions[0])

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dnd_presets')
    if (saved) {
      try {
        setPresets(JSON.parse(saved))
      } catch (e) {
        setPresets(getDefaultPresets())
      }
    } else {
      setPresets(getDefaultPresets())
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (!timerRunning || !startTime) return
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [timerRunning, startTime])

  const getDefaultPresets = () => ({
    "PC1": { name: "Elara Moonwhisper", ac: "15", speed: "30 ft", maxHp: 38, isPlayer: true, statblock: "Wizard 5..." },
    "AllyDragon": { name: "Ignarnoth", ac: "20", speed: "50 ft., fly 100 ft.", maxHp: 280, isPlayer: false, statblock: "Huge dragon..." },
    "GlassboundAmethyst": { name: "Glassbound Amethyst", ac: "18", speed: "30 ft", maxHp: 180, isPlayer: false, statblock: "CR 9\nMultiattack: 3 attacks with Thorn-Quadraxis\nThorn-Quadraxis: +14 to hit, 28 (4d8 + 10) slashing + 14 (4d6) poison damage\nRage Echo: Resistance to bludgeoning, piercing, slashing; advantage on Strength saves" },
    "GlassboundJosie": { name: "Glassbound Josie", ac: "19", speed: "30 ft", maxHp: 165, isPlayer: false, statblock: "CR 9\nMultiattack: 4 shots with Thorn-Apex Longbow\nThorn-Apex: +15 to hit, 22 (3d8 + 9) piercing + 11 (2d10) poison damage (ignores cover)\nSpore Volley (Recharge 5-6): 30-ft cone, DC 17 Con save, 55 (10d10) poison damage" },
    "GlassboundNyserra": { name: "Glassbound Nyserra", ac: "17", speed: "30 ft", maxHp: 155, isPlayer: false, statblock: "CR 9\nMultiattack: 2 staff attacks + spell\nVeinstorm Echo: +13 to hit, 18 (3d6 + 8) bludgeoning + 22 (4d10) necrotic\nCorrupted Wild Shape: Can turn into a Huge Vine Drake (as your old drake form but with +50 HP and poison breath)" },
    "GlassboundSmokey": { name: "Glassbound Smokey", ac: "16", speed: "30 ft", maxHp: 210, isPlayer: false, statblock: "CR 8\nMultiattack: Bite + Claws\nBite: +13 to hit, 26 (4d8 + 8) piercing + 18 (4d8) poison\nCorrupting Roar (Recharge 5-6): 60-ft cone, DC 17 Con save, 44 (8d10) poison + frightened" },
    "GlassboundIgnaroth": { name: "Glassbound Ignaroth", ac: "20", speed: "30 ft", maxHp: 280, isPlayer: false, statblock: "CR 11\nMultiattack: Bite + 2 Claws + Tail\nVerdant Breath (Recharge 5-6): 60-ft line, DC 19 Con save, 88 (16d10) poison + 44 (8d10) necrotic" },
    "GlassboundKael": { name: "Glassbound Kael", ac: "19", speed: "30 ft", maxHp: 220, isPlayer: false, statblock: "CR 10\nMultiattack: 2 Draconic Strikes + Dominate attempt\nSovereign Command: DC 18 Wis save or charmed for 1 minute (can command the target)" },
    "GlassboundVineHorrors": { name: "2x Glassbound Vine Horrors", ac: "18", speed: "30 ft", maxHp: 170, isPlayer: false, statblock: "CR 8 each\nConstrict Slam: +13 to hit, 28 (4d10 + 8) bludgeoning + grappled + 22 (4d10) poison" },
    "GlassboundDrowPitFighters": { name: "4x Glassbound Drow Pit Fighters", ac: "17", speed: "30 ft", maxHp: 95, isPlayer: false, statblock: "CR 6 each\nMultiattack: 3 shortsword attacks\nThornblade: +10 to hit, 15 (2d6 + 8) piercing + 7 (2d6) poison" },
    "Goblin": { name: "Goblin", ac: "15", speed: "30 ft", maxHp: 7, isPlayer: false, statblock: "CR 1/8" },
    "OrcWarrior": { name: "Orc Warrior", ac: "13", speed: "30 ft", maxHp: 15, isPlayer: false, statblock: "CR 1/2" },
    "Guard": { name: "Guard", ac: "16", speed: "30 ft", maxHp: 11, isPlayer: false, statblock: "CR 1/8" },
    "Bandit": { name: "Bandit", ac: "12", speed: "30 ft", maxHp: 16, isPlayer: false, statblock: "CR 1/8" },
    "Wolf": { name: "Wolf", ac: "13", speed: "40 ft", maxHp: 11, isPlayer: false, statblock: "CR 1/4" },
    "GiantSpider": { name: "Giant Spider", ac: "14", speed: "30 ft., climb 30 ft", maxHp: 26, isPlayer: false, statblock: "CR 1" },
    "Zombie": { name: "Zombie", ac: "8", speed: "20 ft", maxHp: 22, isPlayer: false, statblock: "CR 1/4" },
    "Skeleton": { name: "Skeleton", ac: "15", speed: "30 ft", maxHp: 13, isPlayer: false, statblock: "CR 1/8" },
    "Troll": { name: "Troll", ac: "15", speed: "30 ft", maxHp: 84, isPlayer: false, statblock: "CR 5" },
    "DragonWyrmling": { name: "Dragon Wyrmling", ac: "17", speed: "30 ft., fly 60 ft", maxHp: 22, isPlayer: false, statblock: "CR 2" }
  })

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const generateId = () => `c_${Date.now()}_${Math.random().toString(16).slice(2)}`
  const sortCombatants = (list, preserveCurrentId, preserveSelectedId) => {
    const sorted = [...list].sort((a, b) => b.initiative - a.initiative)
    const newCurrentIdx = preserveCurrentId ? Math.max(0, sorted.findIndex(c => c.id === preserveCurrentId)) : 0
    const newSelectedIdx = preserveSelectedId ? Math.max(0, sorted.findIndex(c => c.id === preserveSelectedId)) : (sorted.length ? 0 : null)
    return { sorted, newCurrentIdx, newSelectedIdx }
  }

  const syncActiveCombatants = (list, preserveCurrentId, preserveSelectedId) => {
    const activeCombatants = list.filter(combatant => combatant.curHp > 0)

    if (activeCombatants.length === 0) {
      setCombatants([])
      setCurrentTurnIdx(0)
      setCurrentTurnId(null)
      setSelectedIdx(null)
      setSelectedCombatants([])
      return []
    }

    const { sorted, newCurrentIdx, newSelectedIdx } = sortCombatants(activeCombatants, preserveCurrentId, preserveSelectedId)
    setCombatants(sorted)
    setCurrentTurnIdx(newCurrentIdx)
    setCurrentTurnId(sorted[newCurrentIdx]?.id || null)
    setSelectedIdx(newSelectedIdx)
    setSelectedCombatants(prev => prev.filter(id => sorted.some(combatant => combatant.id === id)))
    return sorted
  }

  const addPresetCombatant = (presetKey) => {
    const preset = presets[presetKey]
    if (!preset) return
    const initiative = newInitiative ? parseInt(newInitiative) : 0
    setTempCombatants([...tempCombatants, {
      id: generateId(),
      key: presetKey,
      name: preset.name,
      isPlayer: preset.isPlayer,
      maxHp: preset.maxHp,
      curHp: preset.maxHp,
      tempHp: 0,
      initiative: initiative,
      ac: preset.ac,
      speed: preset.speed,
      status: '',
      statblock: preset.statblock || ''
    }])
    setNewInitiative('')
  }

  const addManualCombatant = () => {
    if (!newCombatant.name || newCombatant.maxHp <= 0) {
      alert('Name and positive HP required')
      return
    }
    setTempCombatants([...tempCombatants, {
      id: generateId(),
      key: null,
      name: newCombatant.name,
      isPlayer: newCombatant.isPlayer,
      maxHp: newCombatant.maxHp,
      curHp: newCombatant.maxHp,
      tempHp: 0,
      initiative: parseInt(newCombatant.initiative) || 0,
      ac: '',
      speed: '',
      status: '',
      statblock: ''
    }])
    setNewCombatant({ name: '', initiative: 0, maxHp: 0, isPlayer: true })
  }

  const removeFromSetup = (idx) => {
    setTempCombatants(tempCombatants.filter((_, i) => i !== idx))
  }

  const startCombat = () => {
    if (tempCombatants.length === 0) {
      alert('Add at least one combatant')
      return
    }
    const sorted = [...tempCombatants].sort((a, b) => b.initiative - a.initiative)
    setCombatants(sorted)
    setCurrentTurnIdx(0)
    setCurrentTurnId(sorted[0]?.id || null)
    setRoundNum(1)
    setTotalDamage(0)
    setActionHistory([])
    setSelectedIdx(0)
    setTempCombatants([])
    setTimerRunning(true)
    setStartTime(Date.now())
    setActiveTab('tracker')
  }

  const applyHpChange = (amount) => {
    if (typeof amount === 'number' && selectedCombatants.length > 0) {
      applyDamageToMultiple(amount)
      return
    }

    if (selectedIdx === null) {
      alert('Select a combatant first')
      return
    }
    const c = [...combatants]
    const target = c[selectedIdx]
    const actor = c[currentTurnIdx].name
    const preserveCurrentId = c[currentTurnIdx]?.id || null
    let entry = ''

    if (amount === 'kill') {
      const old = target.curHp
      target.curHp = 0
      target.tempHp = 0
      entry = `R${roundNum} | ${actor} → ${target.name} | KILLED (HP ${old} → 0)`
    } else if (amount === 'full') {
      const old = target.curHp
      target.curHp = target.maxHp
      entry = `R${roundNum} | ${actor} → ${target.name} | Full Heal (HP ${old} → ${target.maxHp})`
    } else if (amount > 0) {
      const old = target.curHp
      target.curHp = Math.min(target.maxHp, target.curHp + amount)
      entry = `R${roundNum} | ${actor} → ${target.name} | healed ${amount} HP (${old} → ${target.curHp})`
    } else {
      const damage = Math.abs(amount)
      let absorbed = 0
      if (target.tempHp > 0) {
        absorbed = Math.min(target.tempHp, damage)
        target.tempHp -= absorbed
        const remaining = damage - absorbed
        if (remaining > 0) target.curHp = Math.max(0, target.curHp - remaining)
        entry = `R${roundNum} | ${actor} → ${target.name} | damaged ${damage} (${absorbed} temp absorbed)`
      } else {
        target.curHp = Math.max(0, target.curHp - damage)
        entry = `R${roundNum} | ${actor} → ${target.name} | damaged ${damage} HP`
      }
      setTotalDamage(prev => prev + damage)
    }

    const preserveSelectedId = target.curHp > 0 ? target.id : preserveCurrentId
    syncActiveCombatants(c, preserveCurrentId, preserveSelectedId)
    setActionHistory([...actionHistory, entry])
  }

  const applyTempHp = (amount) => {
    if (selectedIdx === null) {
      alert('Select a combatant first')
      return
    }
    const c = [...combatants]
    const target = c[selectedIdx]
    const old = target.tempHp
    target.tempHp += amount
    const actor = c[currentTurnIdx].name
    const entry = `R${roundNum} | ${actor} → ${target.name} | added ${amount} temp HP (now ${target.tempHp})`
    setCombatants(c)
    setActionHistory([...actionHistory, entry])
  }

  const toggleCondition = (condition) => {
    if (selectedIdx === null) {
      alert('Select a combatant first')
      return
    }
    const c = [...combatants]
    const target = c[selectedIdx]
    const statuses = (target.status || '').split(',').map(s => s.trim()).filter(s => s)
    let action = ''
    if (statuses.includes(condition)) {
      statuses.splice(statuses.indexOf(condition), 1)
      action = 'removed'
    } else {
      statuses.push(condition)
      action = 'applied'
    }
    target.status = statuses.join(', ')
    const actor = c[currentTurnIdx].name
    const entry = `R${roundNum} | ${actor} → ${target.name} | ${action} ${condition}`
    setCombatants(c)
    setActionHistory([...actionHistory, entry])
  }

  const applyConditionToSelected = (condition) => {
    setSelectedCondition(condition)
    if (selectedIdx === null) return
    const c = [...combatants]
    const target = c[selectedIdx]
    if (!target) return
    const statuses = (target.status || '').split(',').map(s => s.trim()).filter(s => s)
    if (statuses.includes(condition)) return
    statuses.push(condition)
    target.status = statuses.join(', ')
    const actor = c[currentTurnIdx]?.name || 'Unknown'
    const entry = `R${roundNum} | ${actor} → ${target.name} | applied ${condition}`
    setCombatants(c)
    setActionHistory([...actionHistory, entry])
  }

  const removeConditionFromCombatant = (combatantIdx, condition) => {
    const c = [...combatants]
    const target = c[combatantIdx]
    if (!target) return
    const statuses = (target.status || '').split(',').map(s => s.trim()).filter(s => s)
    if (!statuses.includes(condition)) return
    target.status = statuses.filter(s => s !== condition).join(', ')
    const actor = c[currentTurnIdx]?.name || 'Unknown'
    const entry = `R${roundNum} | ${actor} → ${target.name} | removed ${condition}`
    setCombatants(c)
    setActionHistory([...actionHistory, entry])
  }

  const nextTurn = () => {
    if (combatants.length === 0) return
    const nextIdx = (currentTurnIdx + 1) % combatants.length
    if (nextIdx === 0) setRoundNum(prev => prev + 1)
    setCurrentTurnIdx(nextIdx)
    setCurrentTurnId(combatants[nextIdx]?.id || null)
    setSelectedIdx(nextIdx)
  }

  const undoLast = () => {
    if (actionHistory.length > 0) {
      setActionHistory(actionHistory.slice(0, -1))
    }
  }

  const stopCombat = () => {
    setTimerRunning(false)
  }

  const resetCombat = () => {
    if (confirm('Return to Setup and clear combat?')) {
      setTimerRunning(false)
      setCombatants([])
      setActionHistory([])
      setTotalDamage(0)
      setActiveTab('setup')
    }
  }

  const savePresets = () => {
    localStorage.setItem('dnd_presets', JSON.stringify(presets))
    alert('Presets saved!')
  }

  const saveCurrentPreset = () => {
    if (!editingPresetKey) return
    setPresets({ ...presets, [editingPresetKey]: editingPreset })
    savePresets()
    alert('Preset saved!')
  }

  const addNewPreset = () => {
    const key = prompt('Enter unique preset ID (e.g., PC1, Boss1):')
    if (!key || presets[key]) return
    const newPreset = { name: 'New Character', ac: '', speed: '', maxHp: 0, isPlayer: false, statblock: '' }
    setPresets({ ...presets, [key]: newPreset })
    setEditingPresetKey(key)
    setEditingPreset(newPreset)
  }

  const deletePreset = () => {
    if (!editingPresetKey || !confirm(`Delete ${editingPresetKey}?`)) return
    const newPresets = { ...presets }
    delete newPresets[editingPresetKey]
    setPresets(newPresets)
    setEditingPresetKey(null)
    setEditingPreset(null)
  }

  const cloneCombatant = (idx) => {
    const original = tempCombatants[idx]
    const clone = { ...original, id: generateId(), name: original.name + ' (Copy)' }
    setTempCombatants([...tempCombatants, clone])
  }

  const toggleMultiSelect = (combatantId) => {
    setSelectedCombatants(prev =>
      prev.includes(combatantId)
        ? prev.filter(id => id !== combatantId)
        : [...prev, combatantId]
    )
  }

  const updateInitiative = (idx, value) => {
    const c = [...combatants]
    if (!c[idx]) return
    const target = c[idx]
    const oldValue = target.initiative
    target.initiative = parseInt(value) || 0
    const actor = c[currentTurnIdx]?.name || 'Unknown'
    const entry = `R${roundNum} | ${actor} → ${target.name} | initiative ${oldValue} → ${target.initiative}`
    const preserveSelectedId = c[selectedIdx]?.id || null
    const { sorted, newCurrentIdx, newSelectedIdx } = sortCombatants(c, currentTurnId, preserveSelectedId)
    setCombatants(sorted)
    setCurrentTurnIdx(newCurrentIdx)
    setCurrentTurnId(sorted[newCurrentIdx]?.id || null)
    setSelectedIdx(newSelectedIdx)
    setActionHistory([...actionHistory, entry])
  }

  const applyDamageToMultiple = (amount) => {
    if (selectedCombatants.length === 0) {
      alert('Select combatants first')
      return
    }
    const c = [...combatants]
    const actor = c[currentTurnIdx]?.name || 'Unknown'
    const preserveCurrentId = c[currentTurnIdx]?.id || null
    const preserveSelectedId = c[selectedIdx]?.curHp > 0 ? c[selectedIdx]?.id || null : preserveCurrentId
    let totalAoEDamage = 0
    selectedCombatants.forEach(targetId => {
      const idx = c.findIndex(item => item.id === targetId)
      if (idx === -1) return
      const target = c[idx]
      if (amount > 0) {
        target.curHp = Math.min(target.maxHp, target.curHp + amount)
      } else {
        const damage = Math.abs(amount)
        if (target.tempHp > 0) {
          const absorbed = Math.min(target.tempHp, damage)
          target.tempHp -= absorbed
          const remaining = damage - absorbed
          if (remaining > 0) target.curHp = Math.max(0, target.curHp - remaining)
        } else {
          target.curHp = Math.max(0, target.curHp - damage)
        }
        totalAoEDamage += damage
      }
    })
    if (totalAoEDamage > 0) {
      setTotalDamage(prev => prev + totalAoEDamage)
    }
    const action = amount > 0 ? 'healing' : 'damage'
    const entry = `R${roundNum} | ${actor} → ${selectedCombatants.length} targets | ${Math.abs(amount)} ${action}`
    syncActiveCombatants(c, preserveCurrentId, preserveSelectedId)
    setActionHistory([...actionHistory, entry])
  }

  const exportSession = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      roundsCompleted: roundNum - 1,
      totalDamage,
      combatants: combatants.map(c => ({ name: c.name, finalHp: c.curHp, maxHp: c.maxHp })),
      actionHistory
    }
    const json = JSON.stringify(sessionData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `combat-${Date.now()}.json`
    a.click()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied: ${text}`)
    })
  }

  const selectedCombatant = selectedIdx !== null ? combatants[selectedIdx] : null

  const buildVersion = import.meta.env.VITE_BUILD_VERSION || '0.0.0'
  const buildCommit = (import.meta.env.VITE_BUILD_COMMIT || 'local').slice(0, 7)
  const buildTime = import.meta.env.VITE_BUILD_TIME
    ? new Date(import.meta.env.VITE_BUILD_TIME).toLocaleString()
    : 'local build'

  // Keyboard shortcuts for quick damage/healing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'tracker' || selectedIdx === null) return
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= 9) {
        e.preventDefault()
        if (e.shiftKey) {
          applyHpChange(num * 5)
        } else {
          applyHpChange(-num * 5)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, selectedIdx, combatants])

  return (
    <div className="app">
      <h1>⚔️ D&D 5e Combat Tracker</h1>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'setup' ? 'active' : ''}`} onClick={() => setActiveTab('setup')}>Setup</button>
        <button className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>Tracker</button>
        <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
        <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
        <button className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`} onClick={() => setActiveTab('presets')}>Presets</button>
      </div>

      {/* Setup Tab */}
      {activeTab === 'setup' && (
        <div className="tab-content">
          <div className="section">
            <h2>Initiative</h2>
            <input type="number" placeholder="Initiative (blank = 0)" value={newInitiative} onChange={e => setNewInitiative(e.target.value)} />
          </div>

          <div className="section">
            <h2>Quick Add Presets</h2>
            <div className="preset-buttons">
              {Object.entries(presets).map(([key, preset]) => (
                <button key={key} onClick={() => addPresetCombatant(key)} className="preset-btn">
                  {preset.name} ({preset.maxHp} HP)
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Manual Add</h2>
            <input placeholder="Name" value={newCombatant.name} onChange={e => setNewCombatant({...newCombatant, name: e.target.value})} />
            <input type="number" placeholder="Max HP" value={newCombatant.maxHp} onChange={e => setNewCombatant({...newCombatant, maxHp: parseInt(e.target.value) || 0})} />
            <input type="number" placeholder="Initiative" value={newCombatant.initiative} onChange={e => setNewCombatant({...newCombatant, initiative: parseInt(e.target.value) || 0})} />
            <label><input type="checkbox" checked={newCombatant.isPlayer} onChange={e => setNewCombatant({...newCombatant, isPlayer: e.target.checked})} /> Player</label>
            <button onClick={addManualCombatant}>Add Combatant</button>
          </div>

          <div className="section">
            <h2>Combatants ({tempCombatants.length})</h2>
            <div className="combatant-list">
              {tempCombatants.sort((a, b) => b.initiative - a.initiative).map((c, i) => (
                <div key={i} className="combatant-item">
                  <span>{c.name} | Init: {c.initiative} | HP: {c.maxHp}</span>
                  <button onClick={() => cloneCombatant(tempCombatants.indexOf(c))}>Clone</button>
                  <button onClick={() => removeFromSetup(tempCombatants.indexOf(c))}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button onClick={startCombat} className="btn-primary">Start Combat</button>
          </div>
        </div>
      )}

      {/* Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="tab-content tracker-tab">
          <div className="stats-bar">
            Elapsed: {formatTime(elapsedTime)} | Round {roundNum} | Current: {combatants[currentTurnIdx]?.name || '-'}
          </div>

          <div className="tracker-layout">
            <div className="tracker-left">
              <div className="controls">
            <div className="tracker-filters">
              <div className="damage-type">
                <label>Damage Type:</label>
                <select value={damageType} onChange={e => setDamageType(e.target.value)}>
                  {damageTypes.map(dt => <option key={dt}>{dt}</option>)}
                </select>
              </div>

              <div className="damage-type">
                <label>Condition:</label>
                <select value={selectedCondition} onChange={e => applyConditionToSelected(e.target.value)}>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="button-grid">
              <div className="button-section">
                <h3>Damage</h3>
                {[1, 5, 10, 25].map(val => (
                  <button key={`dmg${val}`} onClick={() => applyHpChange(-val)}>-{val}</button>
                ))}
              </div>

              <div className="button-section">
                <h3>Healing</h3>
                {[1, 5, 10, 25].map(val => (
                  <button key={`heal${val}`} onClick={() => applyHpChange(val)}>+{val}</button>
                ))}
              </div>

              <div className="button-section">
                <h3>Temp HP</h3>
                {[1, 5, 10, 25].map(val => (
                  <button key={`temp${val}`} onClick={() => applyTempHp(val)}>+{val}t</button>
                ))}
              </div>

              <div className="button-section">
                <h3>Action</h3>
                <button onClick={() => applyHpChange('kill')} className="btn-danger">Kill</button>
                <button onClick={() => applyHpChange('full')}>Full Heal</button>
              </div>
            </div>

            <div className="multi-select-panel">
              <h3>Multi-Select ({selectedCombatants.length})</h3>
              <div className="aoe-grid">
                <div className="button-section">
                  <h3>AoE Damage</h3>
                  <div className="aoe-buttons">
                    {[1, 5, 10, 25].map(val => (
                      <button key={`multi-dmg${val}`} className="aoe-btn" onClick={() => applyDamageToMultiple(-val)}>-{val}</button>
                    ))}
                  </div>
                </div>
                <div className="button-section">
                  <h3>AoE Healing</h3>
                  <div className="aoe-buttons">
                    {[1, 5, 10, 25].map(val => (
                      <button key={`multi-heal${val}`} className="aoe-btn" onClick={() => applyDamageToMultiple(val)}>+{val}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="tracker-middle">
              <div className="combatants-table">
                <h2>Combatants</h2>
                <div className="combatants-filter">
                  <button onClick={() => setSelectedCombatants([])} className="btn-small">Clear Multi-Select</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Turn</th>
                      <th>📋</th>
                      <th>Name</th>
                      <th>AC</th>
                      <th>Health</th>
                      <th>Temp</th>
                      <th>Init</th>
                      <th>Speed</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combatants.map((c) => {
                      const rowIdx = combatants.indexOf(c)
                      return (
                      <tr key={c.id} className={`${selectedIdx === rowIdx ? 'selected' : ''} ${rowIdx === currentTurnIdx ? 'current' : ''} ${selectedCombatants.includes(c.id) ? 'multi-selected' : ''}`}>
                        <td onClick={() => setSelectedIdx(rowIdx)}>{rowIdx === currentTurnIdx ? '→' : ''}</td>
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedCombatants.includes(c.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              toggleMultiSelect(c.id)
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td onClick={() => setSelectedIdx(rowIdx)}>{c.name}</td>
                        <td>{c.ac || '-'}</td>
                        <td>
                          <div className="hp-bar">
                            <div className="hp-fill" style={{width: `${(c.curHp / c.maxHp) * 100}%`}}></div>
                            <span className="hp-text">{c.curHp}/{c.maxHp}</span>
                          </div>
                        </td>
                        <td>{c.tempHp > 0 ? `${c.tempHp}t` : '—'}</td>
                        <td>
                          <input
                            type="number"
                            className="init-input"
                            value={c.initiative}
                              onChange={(e) => updateInitiative(rowIdx, e.target.value)}
                          />
                        </td>
                        <td>{c.speed || '—'}</td>
                        <td>
                          {c.status ? (
                            <div className="status-cell" onClick={(e) => e.stopPropagation()}>
                              {(c.status || '').split(',').map(s => s.trim()).filter(Boolean).map(status => (
                                <button
                                  key={`${c.id}-${status}`}
                                  className="status-chip"
                                  onClick={() => removeConditionFromCombatant(rowIdx, status)}
                                  title={`Remove ${status}`}
                                >
                                  {status} ×
                                </button>
                              ))}
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>

              <div className="button-group tracker-actions">
                <button onClick={nextTurn} className="btn-primary">Next Turn</button>
                <button onClick={undoLast}>Undo Last</button>
                <button onClick={stopCombat}>Stop Combat</button>
                <button onClick={resetCombat}>Reset</button>
              </div>
            </div>

        <div className="tracker-right">
          <div className="selected-panel">
            <h3>Selected Combatant</h3>
            {selectedCombatant ? (
              <>
                <div className="selected-row"><strong>Name:</strong> {selectedCombatant.name}</div>
                <div className="selected-row"><strong>AC:</strong> {selectedCombatant.ac || '—'}</div>
                <div className="selected-row"><strong>Speed:</strong> {selectedCombatant.speed || '—'}</div>
                <div className="selected-row"><strong>HP:</strong> {selectedCombatant.curHp}/{selectedCombatant.maxHp}</div>
                <div className="selected-row"><strong>Temp HP:</strong> {selectedCombatant.tempHp || '0'}</div>
                <div className="selected-row"><strong>Init:</strong> {selectedCombatant.initiative}</div>
                <div className="selected-row"><strong>Status:</strong> {selectedCombatant.status || 'None'}</div>
                <div className="selected-row"><strong>Preset:</strong> {selectedCombatant.key || 'Manual'}</div>
                <div className="statblock">
                  <h4>Stat Block</h4>
                  <pre>{selectedCombatant.statblock || 'No statblock available.'}</pre>
                </div>
              </>
            ) : (
              <p>Select a combatant from the table to see details here.</p>
            )}
          </div>
        </div>
      </div>
      </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="tab-content">
          <h2>Total Damage Dealt: <span className="damage-total">{totalDamage}</span></h2>
          <div className="action-log">
            <h3>Action History</h3>
            {actionHistory.length === 0 ? <p>No actions yet</p> : (
              actionHistory.map((entry, i) => <div key={i} className="log-entry">{entry}</div>)
            )}
          </div>
          <div className="button-group">
            <button onClick={exportSession} className="btn-primary">📥 Export Session</button>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="tab-content">
          <h2>Combat Statistics</h2>
          
          <div className="stats-section">
            <h3>Damage Ranking</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Health</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {combatants.sort((a, b) => {
                  const aDamage = a.maxHp - a.curHp
                  const bDamage = b.maxHp - b.curHp
                  return bDamage - aDamage
                }).map((c, i) => {
                  const damage = c.maxHp - c.curHp
                  const percent = Math.round((damage / c.maxHp) * 100)
                  return (
                    <tr key={i}>
                      <td>{c.name}</td>
                      <td>
                        <div className="hp-bar">
                          <div className="hp-fill" style={{width: `${(c.curHp / c.maxHp) * 100}%`}}></div>
                          <span className="hp-text">{c.curHp}/{c.maxHp}</span>
                        </div>
                      </td>
                      <td>{c.curHp <= 0 ? '💀 Dead' : `${damage} dmg (${percent}%)`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="stats-section">
            <h3>Rounds Completed</h3>
            <p className="stat-value">{roundNum - 1}</p>
          </div>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === 'presets' && (
        <div className="tab-content">
          <div className="presets-container">
            <div className="preset-list">
              <h3>Presets</h3>
              {Object.entries(presets).map(([key, preset]) => (
                <button key={key} onClick={() => { setEditingPresetKey(key); setEditingPreset({...preset}) }} className={`preset-item ${editingPresetKey === key ? 'selected' : ''}`}>
                  {key} — {preset.name}
                </button>
              ))}
              <button onClick={addNewPreset} className="btn-primary">+ Add New</button>
            </div>

            {editingPreset && (
              <div className="preset-editor">
                <h3>
                  Editing: {editingPresetKey}
                  <button onClick={() => copyToClipboard(editingPresetKey)} className="btn-small">📋 Copy ID</button>
                  <button onClick={() => copyToClipboard(editingPreset.name)} className="btn-small">📋 Copy Name</button>
                </h3>
                <input placeholder="Name" value={editingPreset.name} onChange={e => setEditingPreset({...editingPreset, name: e.target.value})} />
                <input placeholder="AC" value={editingPreset.ac} onChange={e => setEditingPreset({...editingPreset, ac: e.target.value})} />
                <input placeholder="Speed" value={editingPreset.speed} onChange={e => setEditingPreset({...editingPreset, speed: e.target.value})} />
                <input type="number" placeholder="Max HP" value={editingPreset.maxHp} onChange={e => setEditingPreset({...editingPreset, maxHp: parseInt(e.target.value) || 0})} />
                <label><input type="checkbox" checked={editingPreset.isPlayer} onChange={e => setEditingPreset({...editingPreset, isPlayer: e.target.checked})} /> Player</label>
                <textarea placeholder="Stat Block" value={editingPreset.statblock || ''} onChange={e => setEditingPreset({...editingPreset, statblock: e.target.value})} rows="12"></textarea>
                <button onClick={saveCurrentPreset}>Save</button>
                <button onClick={deletePreset} className="btn-danger">Delete</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="shortcuts-info">
        <small>
          ⌨️ Shortcuts: Numbers <strong>1-9</strong> (damage) | <strong>Shift+1-9</strong> (heal) | Checkboxes for multi-select AoE
        </small>
        <div className="build-info">
          Build v{buildVersion} | {buildCommit} | {buildTime}
        </div>
      </div>
    </div>
  )
}

export default App