import React from 'react';
import classnames from 'classnames';
import css from './index.less';
import {observer, inject} from 'mobx-react';


@inject('store')
@observer
class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  //mouseDown event
  rbResize(e) {
    const {store} = this.props;
    store.changeResizeAble(true);
  }

  onChange(e) {
    //console.log(e.target.value);
    this.props.store.swingAngle(e.target.value);
  }

  render() {
    const {store} = this.props;
    const {currentDeg, x1, x2, x3, x4, y1, y2, y3, y4} = store;
    const {dltX1, dltY1, dltX2, dltY2, dltX3, dltY3, dltX4, dltY4} = store;

    const path = `${x1 + dltX1},${y1 - dltY1} ${x2 + dltX2},${y2 - dltY2} ${x4 + dltX4},${y4 - dltY4} ${x3 + dltX3},${y3 - dltY3}`;

    const viewProps = {
      onMouseMove: (e) => {

      },
    };

    const props1 = {
      style: {
        left: x1 + dltX1,
        top: y1 - dltY1,
      },
    };
    const props2 = {
      style: {
        left: x2 + dltX2,
        top: y2 - dltY2,
      },
    };
    const props3 = {
      style: {
        left: x3 + dltX3,
        top: y3 - dltY3,
      },
    };
    const props4 = {
      style: {
        left: x4 + dltX4,
        top: y4 - dltY4,
      },
      onMouseDown: this.rbResize.bind(this),
    };

    return (
      <div className={css.layout}>
        <div className={css.divWrapper} {...viewProps}>
          <div {...props1}>1</div>
          <div {...props2}>2</div>
          <div {...props3}>3</div>
          <div {...props4}>4</div>
          <input type="number" value={currentDeg} onChange={this.onChange.bind(this)}/>
        </div>
        <svg className={css.svgWrapper}>
          <polygon points={path}/>
        </svg>
      </div>
    );
  }
}
export default Layout;
