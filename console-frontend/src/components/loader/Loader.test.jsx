import React from 'react';
import { shallow, mount, render} from 'enzyme';
import Loader from './Loader';
import renderer from 'react-test-renderer';
import logo from '../../assets/images/hydra_eco_logo.png';


describe('<Loader />', () => {
    it('snapshot render', function() {
        const component = renderer.create(<Loader />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('loader image', function() {
        const wrapper = mount(<Loader />);
        const image = wrapper.find('div img')
        expect(image).toBeTruthy();
        expect(image.length).toEqual(1);
    });
})