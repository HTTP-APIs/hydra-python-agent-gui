import React from 'react';
import ReactDOM from 'react-dom';
import HydraGraph from './HydraGraph';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HydraGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});
