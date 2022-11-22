var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Spinner from '../components/spinner';

describe('<Spinner />', () => {
  it('Contains the lds-ellipsis class', () => {
    const wrapper = shallow(<Spinner />);
    expect(wrapper.find(".lds-ellipsis")).to.have.lengthOf(1);
  });

  it('Spinner contains 4 divs', () => {
    const wrapper = shallow(<Spinner />);
    expect(wrapper.find('.lds-ellipsis div')).to.have.lengthOf(4);
  });

  it('does not render any children', () => {
    const wrapper = shallow((
      <Spinner>
        <div className="unique" />
      </Spinner>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(false);
  });

  it('simulates click events', () => {
    const onClick = sinon.spy();
    const wrapper = shallow(<Spinner onClick={onClick} />);
    wrapper.find('.spinner').simulate('click');
    wrapper.find('.spinner').simulate('click');
    wrapper.find('.spinner').simulate('click');
    expect(onClick).to.have.property('callCount', 3);
  });
});