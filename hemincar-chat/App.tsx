import React from 'react';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <div className="hemincar-widget-container">
      {/* 
        This is now a clean overlay widget. 
        It will not block the main content of your WordPress site.
        The ChatWidget handles its own fixed positioning.
      */}
      <ChatWidget />
    </div>
  );
};

export default App;