import React from 'react';
import {
  RecoilRoot
} from 'recoil';

import MusicStore from './MusicStore';

function App() {
  return (
    <RecoilRoot>
      <MusicStore/> 
    </RecoilRoot>
  );
}

export default App;