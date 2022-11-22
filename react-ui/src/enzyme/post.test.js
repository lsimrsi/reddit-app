var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Post from '../components/post';

describe('<Post />', () => {
  it('Contains the post-paragraph class', () => {
    const props = {
      item: {
        data: {
          url: "",
          title: "Post 1",
        }
      }
    }
    const wrapper = shallow(<Post {...props} />);
    expect(wrapper.find(".post-paragraph")).to.have.lengthOf(1);
  });

  it('displays correct title', () => {
    const props = {
      item: {
        data: {
          url: "",
          title: "Post 1",
        }
      }
    }
    const wrapper = shallow(<Post {...props} />);
    expect(wrapper.find('.post-paragraph').text()).to.equal("Post 1");
  });

  it('shows magnifying glass if content is present', () => {
    const props = {
      item: {
        data: {
          url: "",
          title: "Post 1",
          selftext_html: "hello",
        }
      }
    }
    const wrapper = shallow((<Post {...props}></Post>));
    expect(wrapper.contains(<span className="fa fa-search" />)).to.equal(true);
  });

  it('links open in a new tab', () => {
    const props = {
      item: {
        data: {
          url: "link",
          title: "Post 1",
          selftext_html: "hello",
        }
      }
    }
    const wrapper = shallow((<Post {...props}></Post>));
    expect(wrapper.find("a").filterWhere((anchor) => anchor.prop("target") === "_blank")).to.have.lengthOf(1);
    expect(wrapper.find("a").filterWhere((anchor) => anchor.prop("rel") === "noopener noreferrer")).to.have.lengthOf(1);
  });

  it('shows content when clicked', () => {
    const props = {
      item: {
        data: {
          url: "link",
          title: "Post 1",
          selftext_html: "<html><body>Content</body></html>",
        }
      }
    }

    const wrapper = shallow((<Post {...props} ></Post>));
    expect(wrapper.find(".selftext")).to.have.lengthOf(0);
    wrapper.find('.post-paragraph').simulate('click');
    expect(wrapper.find(".selftext")).to.have.lengthOf(1);
  });
});