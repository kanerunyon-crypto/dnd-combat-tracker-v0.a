import { useState } from 'react'
import './App.css'

function App() {
  const [combatants, setCombatants] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [newCombatant, setNewCombatant] = useState({ name: '', initiative: 0, maxHp: 0, isPlayer: false });

  const addCombatant = () => {
    if (newCombatant.name) {
      setCombatants([...combatants, { ...newCombatant, id: Date.now(), currentHp: newCombatant.maxHp }]);
      setNewCombatant({ name: '', initiative: 0, maxHp: 0, isPlayer: false });
    }
  };

  const removeCombatant = (id) => {
    setCombatants(combatants.filter(c => c.id !== id));
  };

  const sortByInitiative = () => {
    setCombatants([...combatants].sort((a, b) => b.initiative - a.initiative));
  };

  const nextTurn = () => {
    if (combatants.length > 0) {
      setCurrentTurn((currentTurn + 1) % combatants.length);
    }
  };

  const updateHp = (id, newHp) => {
    setCombatants(combatants.map(c => c.id === id ? { ...c, currentHp: Math.max(0, newHp) } : c));
  };

  return (
    <div className="app">
      <h1>D&amp;D Combat Tracker</h1>
      <div className="add-combatant">
        <input 
          value={newCombatant.name} 
          onChange={e => setNewCombatant({...newCombatant, name: e.target.value})} 
          placeholder="Name" 
        />
        <input 
          type="number" 
          value={newCombatant.initiative} 
          onChange={e => setNewCombatant({...newCombatant, initiative: +e.target.value})} 
          placeholder="Initiative" 
        />
        <input 
          type="number" 
          value={newCombatant.maxHp} 
          onChange={e => setNewCombatant({...newCombatant, maxHp: +e.target.value})} 
          placeholder="Max HP" 
        />
        <label>
          <input 
            type="checkbox" 
            checked={newCombatant.isPlayer} 
            onChange={e => setNewCombatant({...newCombatant, isPlayer: e.target.checked})} 
          /> Player
        </label>
        <button onClick={addCombatant}>Add Combatant</button>
      </div>
      <div className="controls">
        <button onClick={sortByInitiative}>Sort by Initiative</button>
        <button onClick={nextTurn}>Next Turn</button>
      </div>
      <div className="combatants">
        {combatants.map((c, index) => (
          <div key={c.id} className={`combatant ${index === currentTurn ? 'active' : ''}`}>
            <span className={c.isPlayer ? 'player' : 'monster'}>{c.name} (Init: {c.initiative})</span>
            <div className="hp">
              <input 
                type="number" 
                value={c.currentHp} 
                onChange={e => updateHp(c.id, +e.target.value)} 
              /> / {c.maxHp} HP
            </div>
            <button onClick={() => removeCombatant(c.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App