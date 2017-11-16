import React from 'react';
import classnames from 'classnames';
import css from './index.less';
import {observer, inject} from 'mobx-react';

const {sin, cos, atan, PI, sqrt} = Math;

@inject('store')
@observer
class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange(e) {
    this.props.store.swingAngle(e.target.value);
  }

  render() {
    const {store} = this.props;
    const {rotatedAngles, x1, y1, x2, y2, x3, y3} = store;
    const {x4, y4} = store.properties;

    const path = `${x1},${y1} ${x2},${y2} ${x4},${y4} ${x3},${y3}`;

    const viewProps = {
      onMouseMove: (e) => {
        const {x1: X1, y1: Y1, movable} = store;
        if (movable) {
          let Cx = e.clientX;
          let Cy = e.clientY;
          let deg = rotatedAngles * PI / 180;

          let Lx = Cx - X1;
          let Ly = Cy - Y1;
          let gama = atan(Ly / Lx) - deg;
          let length = sqrt(Lx ** 2 + Ly ** 2);
          let f2 = length * sin(gama);
          let f3 = length * cos(gama);

          let P2x = Cx + f2 * sin(deg);
          let P2y = Cy - f2 * cos(deg);

          let P3x = Cx - f3 * cos(deg);
          let P3y = Cy - f3 * sin(deg);

          store.changeP2(P2x, P2y);
          store.changeP3(P3x, P3y);
        }
      },
      onMouseUp: () => {
        if (store.movable) {
          store.changeResizeAble(false);
          store.updateInitState();
        }
      }
    };

    const props1 = {
      style: {
        left: x1,
        top: y1,
      },
    };
    const props2 = {
      style: {
        left: x2,
        top: y2,
      },
    };
    const props3 = {
      style: {
        left: x3,
        top: y3,
      },
    };
    const props4 = {
      style: {
        left: x4,
        top: y4,
      },
      onMouseDown: () => {
        store.changeResizeAble(true);
      },
    };

    const inputProps = {
      type: 'number',
      value: rotatedAngles,
      onChange: this.onChange.bind(this),
      onMouseUp: (e) => {
        e.stopPropagation();
      }
    };

    return (
      <div className={css.layout} {...viewProps}>
        <div className={css.divWrapper}>
          <div {...props1}>1</div>
          <div {...props2}>2</div>
          <div {...props3}>3</div>
          <div {...props4}>4</div>
          <input {...inputProps}/>
        </div>
        <svg className={css.svgWrapper}>
          <polygon points={path}/>
        </svg>
      </div>
    );
  }
}
export default Layout;
