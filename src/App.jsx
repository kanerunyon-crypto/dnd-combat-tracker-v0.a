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
  const [startTime, setStartTime] = useState(null)
  const [newCombatant, setNewCombatant] = useState({ name: '', initiative: 0, maxHp: 0, isPlayer: true })
  const [newInitiative, setNewInitiative] = useState('')
  const [damageType, setDamageType] = useState('Fire')
  const [presets, setPresets] = useState({})
  const [editingPresetKey, setEditingPresetKey] = useState(null)
  const [editingPreset, setEditingPreset] = useState(null)

  const damageTypes = ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning",
    "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"]
  
  const conditions = [
    "Prone", "Poisoned", "Concentrating", "Restrained", "Blinded", 
    "Incapacitated", "Stunned", "Paralyzed", "Charmed", "Frightened", "Invisible", "Grappled"
  ]

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
    "AllyDragon": { name: "Ignarnoth", ac: "20", speed: "50 ft., fly 100 ft.", maxHp: 280, isPlayer: false, statblock: "Huge dragon..." }
  })

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const addPresetCombatant = (presetKey) => {
    const preset = presets[presetKey]
    if (!preset) return
    const initiative = newInitiative ? parseInt(newInitiative) : 0
    setTempCombatants([...tempCombatants, {
      key: presetKey,
      name: preset.name,
      isPlayer: preset.isPlayer,
      maxHp: preset.maxHp,
      curHp: preset.maxHp,
      tempHp: 0,
      initiative: initiative,
      ac: preset.ac,
      speed: preset.speed,
      status: ''
    }])
    setNewInitiative('')
  }

  const addManualCombatant = () => {
    if (!newCombatant.name || newCombatant.maxHp <= 0) {
      alert('Name and positive HP required')
      return
    }
    setTempCombatants([...tempCombatants, {
      key: null,
      name: newCombatant.name,
      isPlayer: newCombatant.isPlayer,
      maxHp: newCombatant.maxHp,
      curHp: newCombatant.maxHp,
      tempHp: 0,
      initiative: parseInt(newCombatant.initiative) || 0,
      ac: '',
      speed: '',
      status: ''
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
    if (selectedIdx === null) {
      alert('Select a combatant first')
      return
    }
    const c = [...combatants]
    const target = c[selectedIdx]
    const actor = c[currentTurnIdx].name
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

    setCombatants(c)
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

  const nextTurn = () => {
    const nextIdx = (currentTurnIdx + 1) % combatants.length
    if (nextIdx === 0) setRoundNum(prev => prev + 1)
    setCurrentTurnIdx(nextIdx)
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

  return (
    <div className="app">
      <h1>⚔️ D&D 5e Combat Tracker</h1>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'setup' ? 'active' : ''}`} onClick={() => setActiveTab('setup')}>Setup</button>
        <button className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>Tracker</button>
        <button className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</button>
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
        <div className="tab-content">
          <div className="stats-bar">
            Elapsed: {formatTime(elapsedTime)} | Round {roundNum} | Current: {combatants[currentTurnIdx]?.name || '-'}
          </div>

          <div className="controls">
            <div className="damage-type">
              <label>Damage Type:</label>
              <select value={damageType} onChange={e => setDamageType(e.target.value)}>
                {damageTypes.map(dt => <option key={dt}>{dt}</option>)}
              </select>
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

            <div className="conditions-panel">
              <h3>Conditions</h3>
              {conditions.map(cond => (
                <button key={cond} onClick={() => toggleCondition(cond)} className="cond-btn">{cond}</button>
              ))}
            </div>
          </div>

          <div className="combatants-table">
            <h2>Combatants</h2>
            <table>
              <thead>
                <tr>
                  <th>Turn</th>
                  <th>Name</th>
                  <th>AC</th>
                  <th>HP</th>
                  <th>Temp HP</th>
                  <th>Init</th>
                  <th>Speed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {combatants.map((c, i) => (
                  <tr key={i} onClick={() => setSelectedIdx(i)} className={`${i === selectedIdx ? 'selected' : ''} ${i === currentTurnIdx ? 'current' : ''}`}>
                    <td>{i === currentTurnIdx ? '→' : ''}</td>
                    <td>{c.name}</td>
                    <td>{c.ac || '-'}</td>
                    <td>{c.curHp} / {c.maxHp}</td>
                    <td>{c.tempHp > 0 ? c.tempHp : '—'}</td>
                    <td>{c.initiative}</td>
                    <td>{c.speed || '—'}</td>
                    <td>{c.status || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-group">
            <button onClick={nextTurn} className="btn-primary">Next Turn</button>
            <button onClick={undoLast}>Undo Last</button>
            <button onClick={stopCombat}>Stop Combat</button>
            <button onClick={resetCombat}>Reset</button>
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
                <h3>Editing: {editingPresetKey}</h3>
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
    </div>
  )
}

export default App