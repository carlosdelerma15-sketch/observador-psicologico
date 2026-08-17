import React, { useState } from 'react';
import Navbar from './components/Navbar';
import IndividualView from './pages/IndividualView';
import GroupView from './pages/GroupView';

export default function App() {
  const [activeView, setActiveView] = useState('individual');

  return (
    <div className="app-layout">
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      {activeView === 'individual' ? <IndividualView /> : <GroupView />}
    </div>
  );
}
