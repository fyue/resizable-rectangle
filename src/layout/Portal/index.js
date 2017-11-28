import React from 'react';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom';
import classnames from 'classnames';
import css from './index.less';

export default class Portal extends React.Component {

  render() {
    return null;
  }

  componentDidMount() {
    const doc = window.document;
    this.node = doc.createElement('div');
    doc.body.appendChild(this.node);

    this.renderPortal(this.props);
  }

  componentDidUpdate() {
    this.renderPortal(this.props);
  }

  componentWillUnmount() {
    unmountComponentAtNode(this.node);
    window.document.body.removeChild(this.node);
  }

  renderPortal(props) {
    unstable_renderSubtreeIntoContainer(
      this, //代表当前组件
      <div className="portal">
        <div className="relativeWrapper">
          {props.children}
        </div>
      </div>, // 塞进传送门的JSX
      this.node // 传送门另一端的DOM node
    );
  }
}
