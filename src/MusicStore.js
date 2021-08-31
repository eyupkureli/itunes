import React from 'react';
import styled from 'styled-components';

import StoreSearch from './StoreSearch';
import StoreItemList from './StoreItemList';

const Container = styled.div`
  width: 600px;
  margin: 10px auto;
`;

function MusicStore() {
  return (
    <Container>
      <StoreSearch/>
      <StoreItemList/>
    </Container>
  );
}

export default MusicStore;