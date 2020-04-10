import React from 'react';
import HydraGraph from './HydraGraph';
import {nodes, edges} from './data';
import renderer from 'react-test-renderer';

describe('<HydraGraph />', () => {
  it('snapshot render', function() {
    const props = {
      apidocGraph: {
        nodes, edges
      }
    }
    const component = renderer.create(<HydraGraph {...props}/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})
