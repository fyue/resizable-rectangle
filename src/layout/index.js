import React from 'react';
import classnames from 'classnames';
import css from './index.less';
import {observer, inject} from 'mobx-react';

const {sin, cos, atan, abs, sqrt, PI, tan} = Math;

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

          let Lx = abs(Cx - X1);
          let Ly = abs(Cy - Y1);
          let length = sqrt(Lx ** 2 + Ly ** 2);
          let gama, P2x, P2y, P3x, P3y;

          //compute the border limitation;
          let boundaryX1 = (Cy - Y1) / tan(PI / 2 + deg) + X1;
          let boundaryX2 = (Cy - Y1) / tan(deg) + X1;
          let boundaryY1 = (Cx - X1) * tan(PI / 2 + deg) + Y1;
          let boundaryY2 = (Cx - X1) * tan(deg) + Y1;
          let inXLimit = Cx >= boundaryX1 && Cx <= boundaryX2;
          let inYLimit = Cy >= boundaryY1 && Cy <= boundaryY2;

          /*console.log('B1:', boundaryX1, 'B2:', boundaryX2);
           console.log('Cx:', Cx);*/

          if (Cy >= Y1 && Cx <= X1) { // 第三象限
            gama = PI - deg - atan(Ly / Lx);
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx + f2 * sin(deg);
            P2y = Cy - f2 * cos(deg);
            P3x = Cx - f3 * cos(deg);
            P3y = Cy - f3 * sin(deg);
          } else if (Cy >= Y1 && Cx > X1) { // 第四象限
            gama = atan(Ly / Lx) - deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx + f2 * sin(deg);
            P2y = Cy - f2 * cos(deg);
            P3x = Cx - f3 * cos(deg);
            P3y = Cy - f3 * sin(deg);
          } else if (Cy < Y1 && Cx < X1) { //第二象限
            gama = atan(Ly / Lx) - deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx - f2 * sin(deg);
            P2y = Cy + f2 * cos(deg);
            P3x = Cx + f3 * cos(deg);
            P3y = Cy + f3 * sin(deg);
          } else if (Cy < Y1 && Cx >= X1) { //第一象限
            gama = atan(Ly / Lx) + deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx - f2 * sin(deg);
            P2y = Cy + f2 * cos(deg);
            P3x = Cx - f3 * cos(deg);
            P3y = Cy - f3 * sin(deg);
          }
          if (deg >= 0 && deg <= PI / 2 && inXLimit) {
            store.changeP2(P2x, P2y);
            store.changeP3(P3x, P3y);
          }
          if (deg > PI / 2 && deg <= PI && inYLimit) {
            store.changeP2(P2x, P2y);
            store.changeP3(P3x, P3y);
          }
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
