import React from 'react';
import classnames from 'classnames';
import css from './index.less';
import {observer, inject} from 'mobx-react';

import Portal from '../layout/Portal';

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
    const {x4, y4, L12, L13} = store.properties;

    // const path = `${x1},${y1} ${x2},${y2} ${x4},${y4} ${x3},${y3}`;

    const viewProps = {
      onMouseMove: (e) => {
        const {x1: X1, y1: Y1, x2: X2, y2: Y2, x3: X3, y3: Y3} = store;
        const {movable1, movable2, movable3, movable4} = store;
        const {x4: X4, y4: Y4} = store.properties;
        /*const X4 = 136.2071934021007;
        const Y4 = 204.76676744201643;*/
        if (movable4) {
          let Cx = e.clientX;
          let Cy = e.clientY;
          let deg = rotatedAngles * PI / 180;

          let Lx = abs(Cx - X1);
          let Ly = abs(Cy - Y1);
          let length = sqrt(Lx ** 2 + Ly ** 2);
          let gama, P2x, P2y, P3x, P3y;

          // compute the border limitation;
          let borderDeg1 = deg;
          let borderDeg2 = deg + PI / 2;
          let Kpo = abs((Cy - Y1) / (Cx - X1));
          let angleCursorP1; // 计算指针的瞬时转角

          if (Cy >= Y1 && Cx <= X1) { // 相对于P1第三象限
            gama = PI - deg - atan(Ly / Lx);
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx + f2 * sin(deg);
            P2y = Cy - f2 * cos(deg);
            P3x = Cx - f3 * cos(deg);
            P3y = Cy - f3 * sin(deg);

            angleCursorP1 = PI - atan(Kpo);
          } else if (Cy >= Y1 && Cx > X1) { // 相对于P1第四象限
            gama = atan(Ly / Lx) - deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx + f2 * sin(deg);
            P2y = Cy - f2 * cos(deg);
            P3x = Cx - f3 * cos(deg);
            P3y = Cy - f3 * sin(deg);

            angleCursorP1 = atan(Kpo);
          } else if (Cy < Y1 && Cx < X1) { // 相对于P1第二象限
            gama = atan(Ly / Lx) - deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx - f2 * sin(deg);
            P2y = Cy + f2 * cos(deg);
            P3x = Cx + f3 * cos(deg);
            P3y = Cy + f3 * sin(deg);

            // angleCursorP1 = -PI + atan(Kpo);
            angleCursorP1 = deg < 0 ? -PI + atan(Kpo) : PI + atan(Kpo); //bug could be here
          } else if (Cy < Y1 && Cx >= X1) { // 相对于P1第一象限
            gama = atan(Ly / Lx) + deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx - f2 * sin(deg);
            P2y = Cy + f2 * cos(deg);
            P3x = Cx - f3 * cos(deg);
            P3y = Cy - f3 * sin(deg);

            angleCursorP1 = -atan(Kpo);

            // angleCursorP1 = deg < 0 ? -atan(Kpo) : 2 * PI - atan(Kpo);
          }
          if (angleCursorP1 >= borderDeg1 && angleCursorP1 <= borderDeg2) {
            store.changeP2(P2x, P2y);
            store.changeP3(P3x, P3y);
          }
        }
        if (movable2) {
          let Cx = e.clientX;
          let Cy = e.clientY;
          let deg = rotatedAngles * PI / 180;

          let Lx = abs(Cx - X3);
          let Ly = abs(Cy - Y3);
          let length = sqrt(Lx ** 2 + Ly ** 2);
          let gama, P1x, P1y;

          // compute the border limitation;
          let borderDeg1 = deg;
          let borderDeg2 = deg + PI / 2;
          let Kpo_1 = abs((Cx - X3) / (Cy - Y3));
          let angleCursorP3; // 计算指针的瞬时转角

          if (Cy >= Y3 && Cx <= X3) { // 相对于P3第三象限
            gama = atan(Lx / Ly) - deg;
            let f2 = length * sin(gama);
            P1x = Cx + f2 * cos(deg);
            P1y = Cy + f2 * sin(deg);

            angleCursorP3 = deg < 0 ? -PI + atan(Kpo_1) : PI + atan(Kpo_1);
          } else if (Cy >= Y3 && Cx > X3) { // 相对于P3第四象限
            gama = atan(Ly / Lx) - deg;
            let f3 = length * cos(gama);
            P1x = Cx - f3 * cos(deg);
            P1y = Cy - f3 * sin(deg);

            angleCursorP3 = PI - atan(Kpo_1);
          } else if (Cy < Y3 && Cx < X3) { // 相对于P3第二象限
            gama = atan(Lx / Ly) + deg;
            let f2 = length * sin(gama);
            P1x = Cx + f2 * cos(deg);
            P1y = Cy + f2 * sin(deg);

            angleCursorP3 = -atan(Kpo_1);
          } else if (Cy < Y3 && Cx >= X3) { // 相对于P3第一象限
            gama = atan(Lx / Ly) - deg;
            let f2 = length * sin(gama);
            P1x = Cx - f2 * cos(deg);
            P1y = Cy - f2 * sin(deg);

            angleCursorP3 = atan(Kpo_1);
          }
          if (angleCursorP3 >= borderDeg1 && angleCursorP3 <= borderDeg2) {
            store.changeP1(P1x, P1y);
            store.changeP2(Cx, Cy);
          }
        }
        if (movable3) {
          let Cx = e.clientX;
          let Cy = e.clientY;
          let deg = rotatedAngles * PI / 180;

          let Lx = abs(Cx - X2);
          let Ly = abs(Cy - Y2);
          let length = sqrt(Lx ** 2 + Ly ** 2);
          let gama, P1x, P1y;

          // compute the border limitation;
          let borderDeg1 = deg;
          let borderDeg2 = deg + PI / 2;
          let Kpp2_1 = abs((Cx - X2) / (Cy - Y2));
          let angleCursorP3; // 指针瞬时转角

          if (Cy >= Y2 && Cx <= X2) { // 相对于P3第三象限
            gama = atan(Lx / Ly) - deg;
            let f3 = length * cos(gama);
            P1x = Cx + f3 * sin(deg);
            P1y = Cy - f3 * cos(deg);

            angleCursorP3 = atan(Kpp2_1);
          } else if (Cy >= Y2 && Cx > X2) { // 相对于P3第四象限
            gama = atan(Lx / Ly) + deg;
            let f3 = length * cos(gama);
            P1x = Cx + f3 * sin(deg);
            P1y = Cy - f3 * cos(deg);

            angleCursorP3 = -atan(Kpp2_1);
          } else if (Cy < Y2 && Cx < X2) { // 相对于P3第二象限
            gama = atan(Ly / Lx) - deg;
            let f2 = length * sin(gama);
            P1x = Cx - f2 * sin(deg);
            P1y = Cy + f2 * cos(deg);

            angleCursorP3 = PI - atan(Kpp2_1);
          } else if (Cy < Y2 && Cx >= X2) { // 相对于P3第一象限
            gama = atan(Ly / Lx) + deg;
            let f2 = length * sin(gama);
            P1x = Cx - f2 * sin(deg);
            P1y = Cy + f2 * cos(deg);

            angleCursorP3 = deg > 0 ? PI + atan(Kpp2_1) : -PI + atan(Kpp2_1);
          }
          if (angleCursorP3 >= borderDeg1 && angleCursorP3 <= borderDeg2) {
            store.changeP1(P1x, P1y);
            store.changeP3(Cx, Cy);
          }
        }
        if (movable1) {
          let Cx = e.clientX;
          let Cy = e.clientY;
          let deg = rotatedAngles * PI / 180;

          let Lx = abs(Cx - X4);
          let Ly = abs(Cy - Y4);
          let length = sqrt(Lx ** 2 + Ly ** 2);
          let gama, P2x, P2y, P3x, P3y;

          // compute the border limitation;
          let borderDeg1 = deg;
          let borderDeg2 = deg + PI / 2;
          let Kpp4 = abs((Cy - Y4) / (Cx - X4));
          let angleCursorP4; // 指针瞬时转角，x轴负向顺时针起为正

          if (Cy >= Y4 && Cx <= X4) { // 相对于P4第三象限
            gama = atan(Lx / Ly) - deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx + f2 * cos(deg);
            P2y = Cy + f2 * sin(deg);
            P3x = Cx + f3 * sin(deg);
            P3y = Cy - f3 * cos(deg);

            angleCursorP4 = -atan(Kpp4);
          } else if (Cy >= Y4 && Cx > X4) { // 相对于P4第四象限
            gama = atan(Ly / Lx) - deg;
            let f2 = length * cos(gama);
            let f3 = length * sin(gama);
            P2x = Cx - f2 * cos(deg);
            P2y = Cy - f2 * sin(deg);
            P3x = Cx + f3 * sin(deg);
            P3y = Cy - f3 * cos(deg);

            angleCursorP4 = deg < 0 ? -PI + atan(Kpp4) : PI + atan(Kpp4);
          } else if (Cy < Y4 && Cx < X4) { // 相对于P4第二象限
            gama = atan(Lx / Ly) + deg;
            let f2 = length * sin(gama);
            let f3 = length * cos(gama);
            P2x = Cx + f2 * cos(deg);
            P2y = Cy + f2 * sin(deg);
            P3x = Cx - f3 * sin(deg);
            P3y = Cy + f3 * cos(deg);

            angleCursorP4 = atan(Kpp4);
          } else if (Cy < Y4 && Cx >= X4) { // 相对于P4第一象限
            gama = atan(Ly / Lx) + deg;
            let f2 = length * cos(gama);
            let f3 = length * sin(gama);
            P2x = Cx - f2 * cos(deg);
            P2y = Cy - f2 * sin(deg);
            P3x = Cx - f3 * sin(deg);
            P3y = Cy + f3 * cos(deg);

            angleCursorP4 = PI - atan(Kpp4);
          }
          if (angleCursorP4 >= borderDeg1 && angleCursorP4 <= borderDeg2) {
            store.changeP1(Cx, Cy);
            store.changeP2(P2x, P2y);
            store.changeP3(P3x, P3y);
          }
        }
      },
      onMouseUp: () => {
        store.changeResizeAble('movable1', false);
        store.changeResizeAble('movable2', false);
        store.changeResizeAble('movable3', false);
        store.changeResizeAble('movable4', false);

        store.updateInitState();
      }
    };

    const props1 = {
      style: {
        left: x1,
        top: y1,
        transform: `rotatez(${rotatedAngles}deg)`
      },
      onMouseDown: () => {
        store.changeResizeAble('movable1', true);
      },
    };
    const props2 = {
      style: {
        left: x2,
        top: y2,
        transform: `rotatez(${rotatedAngles}deg)`
      },
      onMouseDown: () => {
        store.changeResizeAble('movable2', true);
      },
    };
    const props3 = {
      style: {
        left: x3,
        top: y3,
        transform: `rotatez(${rotatedAngles}deg)`
      },
      onMouseDown: () => {
        store.changeResizeAble('movable3', true);
      },
    };
    const props4 = {
      style: {
        left: x4,
        top: y4,
        transform: `rotatez(${rotatedAngles}deg)`
      },
      onMouseDown: () => {
        store.changeResizeAble('movable4', true);
      },
    };

    const line12Props = {
      style: {
        left: x1,
        top: y1,
        width: L12,
        transformOrigin: '0px 0px',
        transform: `rotatez(${rotatedAngles}deg)`
      }
    };
    const line24Props = {
      style: {
        left: x2,
        top: y2,
        height: L13,
        transformOrigin: '0px 0px',
        transform: `rotatez(${rotatedAngles}deg)`
      }
    };
    const line43Props = {
      style: {
        left: x3,
        top: y3,
        width: L12,
        transformOrigin: '0px 0px',
        transform: `rotatez(${rotatedAngles}deg)`
      }
    };
    const line31Props = {
      style: {
        left: x1,
        top: y1,
        height: L13,
        transformOrigin: '0px 0px',
        transform: `rotatez(${rotatedAngles}deg)`
      }
    };

    const inputProps = {
      type: 'number',
      value: rotatedAngles,
      onChange: this.onChange.bind(this),
      onMouseUp: (e) => {
        e.stopPropagation();
      }
    };

    const imgProps = {
      src: '//f12.baidu.com/it/u=3438140340,1307248730&fm=72',
      style: {
        width: L12,
        height: L13,
        left: x1,
        top: y1,
        transformOrigin: '0px 0px',
        transform: `rotatez(${rotatedAngles}deg)`
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
          <img {...imgProps} />
          <Portal>
            <div className="line12" {...line12Props} />
            <div className="line24" {...line24Props}/>
            <div className="line43" {...line43Props}/>
            <div className="line31" {...line31Props}/>
          </Portal>
        </div>
      </div>
    );
  }
}
export default Layout;
