import React from 'react';
import { SplitPane, Pane } from 'react-split-pane';

const CustomSplitPane = (leftContent, rightContent) => {
  return (
    <SplitPane direction="horizontal" style={{ height: '100vh' }}>
      <Pane minSize="200px" defaultSize="300px">
        <div>${leftContent}</div>
      </Pane>
      <Pane>
        <div>${rightContent}</div>
      </Pane>
    </SplitPane>
  );
};

export default CustomSplitPane;
