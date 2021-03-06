import React from 'react';
import classnames from 'classnames';
import css from './index.less';
import {observer, inject} from 'mobx-react';

import Portal from '../layout/Portal';

const {sin, cos, atan, abs, sqrt, PI} = Math;

@inject('store')
@observer
class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {store} = this.props;

    const rootNode = document.body;
    rootNode.addEventListener('mousedown', (event) => {
      switch (event.target.dataset.id) {
        case 'point1' : {
          store.changeResizeAble('resizeable1', true);
          break;
        }
        case 'point2' : {
          store.changeResizeAble('resizeable2', true);
          break;
        }
        case 'point3' : {
          store.changeResizeAble('resizeable3', true);
          break;
        }
        case 'point4' : {
          store.changeResizeAble('resizeable4', true);
          break;
        }
        case 'pointCenter12' : {
          store.changeResizeAble('resizeable12', true);
          break;
        }
        case 'pointCenter43' : {
          store.changeResizeAble('resizeable43', true);
          break;
        }
        case 'pointCenter24' : {
          store.changeResizeAble('resizeable24', true);
          break;
        }
        case 'pointCenter31' : {
          store.changeResizeAble('resizeable31', true);
          break;
        }
        case 'cover' : {
          const {x1, x2, x3, y1, y2, y3} = this.props.store;
          const mouseDownX = event.clientX;
          const mouseDownY = event.clientY;

          store.changeMovable(true, mouseDownX, mouseDownY, x1, y1, x2, y2, x3, y3);
          break;
        }
      }
      console.log(event.target);
    });
    rootNode.addEventListener('mouseup', () => {
      store.changeResizeAble('resizeable1', false);
      store.changeResizeAble('resizeable2', false);
      store.changeResizeAble('resizeable3', false);
      store.changeResizeAble('resizeable4', false);
      store.changeResizeAble('resizeable12', false);
      store.changeResizeAble('resizeable24', false);
      store.changeResizeAble('resizeable43', false);
      store.changeResizeAble('resizeable31', false);

      store.updateInitState();

      store.changeMovable(false, 0, 0, 0, 0, 0, 0, 0, 0);
    });
    rootNode.addEventListener('mousemove', (event) => {
      const {x1: X1, y1: Y1, x2: X2, y2: Y2, x3: X3, y3: Y3, rotatedAngles, movable} = store;
      const {resizeable1, resizeable2, resizeable3, resizeable4} = store;
      const {resizeable12, resizeable24, resizeable43, resizeable31} = store;
      const {x4: X4, y4: Y4} = store.properties;

      let Cx = event.clientX;
      let Cy = event.clientY;
      let deg = rotatedAngles * PI / 180;

      if (resizeable4) {
        let Lx = abs(Cx - X1);
        let Ly = abs(Cy - Y1);
        let length = sqrt(Lx ** 2 + Ly ** 2);

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // gama is the angle generated by
        // Cursor point, opposite angle point and computed point
        let gama, P2x, P2y, P3x, P3y;
        // compute the border limitation;
        let Kpo = abs((Cy - Y1) / (Cx - X1));
        let angleCursorP1; // 计算指针的瞬时转角, X轴正向顺时针为正

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
        }
        if (angleCursorP1 >= borderDeg1 && angleCursorP1 <= borderDeg2) {
          store.changeP2(P2x, P2y);
          store.changeP3(P3x, P3y);
        }
      }
      if (resizeable2) {
        let Lx = abs(Cx - X3);
        let Ly = abs(Cy - Y3);
        let length = sqrt(Lx ** 2 + Ly ** 2);
        let gama, P1x, P1y;

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // compute the border limitation;
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
      if (resizeable3) {
        let Lx = abs(Cx - X2);
        let Ly = abs(Cy - Y2);
        let length = sqrt(Lx ** 2 + Ly ** 2);
        let gama, P1x, P1y;

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // compute the border limitation;
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
      if (resizeable1) {
        let Lx = abs(Cx - X4);
        let Ly = abs(Cy - Y4);
        let length = sqrt(Lx ** 2 + Ly ** 2);
        let gama, P2x, P2y, P3x, P3y;

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // compute the border limitation;
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

      if (resizeable43) {
        let Lx = abs(Cx - X1);
        let Ly = abs(Cy - Y1);
        let length = sqrt(Lx ** 2 + Ly ** 2);
        let gama, P3x, P3y;

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // compute the border limitation;
        let Kpo = abs((Cy - Y1) / (Cx - X1));
        let angleCursorP1; // 计算指针的瞬时转角, X轴正向顺时针为正

        if (Cy >= Y1 && Cx <= X1) { // 相对于P1第三象限
          gama = PI - deg - atan(Ly / Lx);
          let f3 = length * cos(gama);
          P3x = Cx - f3 * cos(deg);
          P3y = Cy - f3 * sin(deg);

          angleCursorP1 = PI - atan(Kpo);
        } else if (Cy >= Y1 && Cx > X1) { // 相对于P1第四象限
          gama = atan(Ly / Lx) - deg;
          let f3 = length * cos(gama);
          P3x = Cx - f3 * cos(deg);
          P3y = Cy - f3 * sin(deg);

          angleCursorP1 = atan(Kpo);
        } else if (Cy < Y1 && Cx < X1) { // 相对于P1第二象限
          gama = atan(Ly / Lx) - deg;
          let f3 = length * cos(gama);
          P3x = Cx + f3 * cos(deg);
          P3y = Cy + f3 * sin(deg);

          angleCursorP1 = deg < 0 ? -PI + atan(Kpo) : PI + atan(Kpo); //bug could be here
        } else if (Cy < Y1 && Cx >= X1) { // 相对于P1第一象限
          gama = atan(Ly / Lx) + deg;
          let f3 = length * cos(gama);
          P3x = Cx - f3 * cos(deg);
          P3y = Cy - f3 * sin(deg);

          angleCursorP1 = -atan(Kpo);
        }
        if (angleCursorP1 >= borderDeg1 && angleCursorP1 <= borderDeg2) {
          store.changeP3(P3x, P3y);
        }
      }
      if (resizeable24) {
        let Lx = abs(Cx - X1);
        let Ly = abs(Cy - Y1);
        let length = sqrt(Lx ** 2 + Ly ** 2);

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // gama is the angle generated by
        // Cursor point, opposite angle point and computed point
        let gama, P2x, P2y;
        // compute the border limitation;
        let Kpo = abs((Cy - Y1) / (Cx - X1));
        let angleCursorP1; // 计算指针的瞬时转角, X轴正向顺时针为正

        if (Cy >= Y1 && Cx <= X1) { // 相对于P1第三象限
          gama = PI - deg - atan(Ly / Lx);
          let f2 = length * sin(gama);
          P2x = Cx + f2 * sin(deg);
          P2y = Cy - f2 * cos(deg);

          angleCursorP1 = PI - atan(Kpo);
        } else if (Cy >= Y1 && Cx > X1) { // 相对于P1第四象限
          gama = atan(Ly / Lx) - deg;
          let f2 = length * sin(gama);
          P2x = Cx + f2 * sin(deg);
          P2y = Cy - f2 * cos(deg);

          angleCursorP1 = atan(Kpo);
        } else if (Cy < Y1 && Cx < X1) { // 相对于P1第二象限
          gama = atan(Ly / Lx) - deg;
          let f2 = length * sin(gama);
          P2x = Cx - f2 * sin(deg);
          P2y = Cy + f2 * cos(deg);

          angleCursorP1 = deg < 0 ? -PI + atan(Kpo) : PI + atan(Kpo); //bug could be here
        } else if (Cy < Y1 && Cx >= X1) { // 相对于P1第一象限
          gama = atan(Ly / Lx) + deg;
          let f2 = length * sin(gama);
          P2x = Cx - f2 * sin(deg);
          P2y = Cy + f2 * cos(deg);

          angleCursorP1 = -atan(Kpo);
        }
        if (angleCursorP1 >= borderDeg1 && angleCursorP1 <= borderDeg2) {
          store.changeP2(P2x, P2y);
        }
      }
      if (resizeable31) {
        let Lx = abs(Cx - X4);
        let Ly = abs(Cy - Y4);
        let length = sqrt(Lx ** 2 + Ly ** 2);
        let gama, P1x, P1y, P3x, P3y;

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI / 2;

        // compute the border limitation;
        let Kpp4 = abs((Cy - Y4) / (Cx - X4));
        let angleCursorP4; // 指针瞬时转角，x轴负向顺时针起为正

        if (Cy >= Y4 && Cx <= X4) { // 相对于P4第三象限
          gama = atan(Lx / Ly) - deg;
          let f3 = length * cos(gama);
          P3x = Cx + f3 * sin(deg);
          P3y = Cy - f3 * cos(deg);

          angleCursorP4 = -atan(Kpp4);
        } else if (Cy >= Y4 && Cx > X4) { // 相对于P4第四象限
          gama = atan(Ly / Lx) - deg;
          let f3 = length * sin(gama);
          P3x = Cx + f3 * sin(deg);
          P3y = Cy - f3 * cos(deg);

          angleCursorP4 = deg < 0 ? -PI + atan(Kpp4) : PI + atan(Kpp4);
        } else if (Cy < Y4 && Cx < X4) { // 相对于P4第二象限
          gama = atan(Lx / Ly) + deg;
          let f3 = length * cos(gama);
          P3x = Cx - f3 * sin(deg);
          P3y = Cy + f3 * cos(deg);

          angleCursorP4 = atan(Kpp4);
        } else if (Cy < Y4 && Cx >= X4) { // 相对于P4第一象限
          gama = atan(Ly / Lx) + deg;
          let f3 = length * sin(gama);
          P3x = Cx - f3 * sin(deg);
          P3y = Cy + f3 * cos(deg);

          angleCursorP4 = PI - atan(Kpp4);
        }
        if (angleCursorP4 >= borderDeg1 && angleCursorP4 <= borderDeg2) {
          P1x = P3x + L13 * sin(deg);  // 直接根据L13长度反推P1
          P1y = P3y - L13 * cos(deg);

          store.changeP1(P1x, P1y);
          store.changeP3(P3x, P3y);
        }
      }
      if (resizeable12) {
        let Lx = abs(Cx - X4);
        let Ly = abs(Cy - Y4);
        let length = sqrt(Lx ** 2 + Ly ** 2);
        let gama, P2x, P2y, P1x, P1y, L2413;

        // compute the border limitation;
        let borderDeg1 = deg;
        let borderDeg2 = deg + PI;

        // compute the border limitation;
        let Kpp4 = abs((Cy - Y4) / (Cx - X4));
        let angleCursorP4; // 指针瞬时转角，x轴负向顺时针起为正

        if (Cy >= Y4 && Cx <= X4) { // 相对于P4第三象限
          gama = atan(Ly / Lx) + deg;
          L2413 = length * sin(gama);
          P2x = X4 - L2413 * sin(deg);
          P2y = Y4 + L2413 * cos(deg);
          P1x = X3 - L2413 * sin(deg);
          P1y = Y3 + L2413 * cos(deg);

          angleCursorP4 = deg > 0 ? PI * 2 - atan(Kpp4) : -atan(Kpp4);
        } else if (Cy >= Y4 && Cx > X4) { // 相对于P4第四象限
          gama = atan(Ly / Lx) - deg;
          L2413 = length * sin(gama);
          P2x = X4 - L2413 * sin(deg);
          P2y = Y4 + L2413 * cos(deg);
          P1x = X3 - L2413 * sin(deg);
          P1y = Y3 + L2413 * cos(deg);
          angleCursorP4 = deg > 0 ? PI + atan(Kpp4) : -PI + atan(Kpp4);
        } else if (Cy < Y4 && Cx < X4) { // 相对于P4第二象限
          gama = atan(Ly / Lx) - deg;
          L2413 = length * sin(gama);
          P2x = X4 + L2413 * sin(deg);
          P2y = Y4 - L2413 * cos(deg);
          P1x = X3 + L2413 * sin(deg);
          P1y = Y3 - L2413 * cos(deg);

          angleCursorP4 = atan(Kpp4);
        } else if (Cy < Y4 && Cx >= X4) { // 相对于P4第一象限
          gama = PI / 2 - deg - atan(Ly / Lx);
          L2413 = length * cos(gama);
          P2x = X4 + L2413 * sin(deg);
          P2y = Y4 - L2413 * cos(deg);
          P1x = X3 + L2413 * sin(deg);
          P1y = Y3 - L2413 * cos(deg);

          angleCursorP4 = PI - atan(Kpp4);
        }
        if (angleCursorP4 >= borderDeg1 && angleCursorP4 <= borderDeg2) {
          store.changeP1(P1x, P1y);
          store.changeP2(P2x, P2y);
        }
      }

      if (movable) {
        const {mouseDownX, mouseDownY, mouseDownX1, mouseDownY1, mouseDownX2, mouseDownY2, mouseDownX3, mouseDownY3} = store;
        let dltX = Cx - mouseDownX;
        let dltY = Cy - mouseDownY;
        store.changeP1(mouseDownX1 + dltX, mouseDownY1 + dltY);
        store.changeP2(mouseDownX2 + dltX, mouseDownY2 + dltY);
        store.changeP3(mouseDownX3 + dltX, mouseDownY3 + dltY);
      }
    });
  }

  componentWillUnmount() {

  }

  onChange(e) {
    this.props.store.swingAngle(e.target.value);
  }

  render() {
    const {store} = this.props;
    const {rotatedAngles, x1, y1, x2, y2, x3, y3} = store;
    const {x4, y4, x12, y12, x24, y24, x43, y43, x31, y31, L12, L13} = store.properties;

    const props1 = {
      style: {
        left: x1,
        top: y1,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };
    const props2 = {
      style: {
        left: x2,
        top: y2,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };
    const props3 = {
      style: {
        left: x3,
        top: y3,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };
    const props4 = {
      style: {
        left: x4,
        top: y4,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };

    const props12 = {
      style: {
        left: x12,
        top: y12,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };
    const props24 = {
      style: {
        left: x24,
        top: y24,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };
    const props43 = {
      style: {
        left: x43,
        top: y43,
        transform: `rotatez(${rotatedAngles}deg)`
      },
    };
    const props31 = {
      style: {
        left: x31,
        top: y31,
        transform: `rotatez(${rotatedAngles}deg)`
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

    const coverProps = {
      style: {
        width: L12,
        height: L13,
        left: x1,
        top: y1,
        transformOrigin: '0px 0px',
        transform: `rotatez(${rotatedAngles}deg)`,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'transparent'
      }
    };

    return (
      <div className={css.layout}>
        <div className={css.divWrapper}>
          <input {...inputProps}/>
          <img {...imgProps} />
          <Portal>
            <div className="line12" {...line12Props} />
            <div className="line24" {...line24Props}/>
            <div className="line43" {...line43Props}/>
            <div className="line31" {...line31Props}/>

            <div data-id="point1" {...props1} className="point point1">{/*1*/}</div>
            <div data-id="point2" {...props2} className="point point2">{/*2*/}</div>
            <div data-id="point3" {...props3} className="point point3">{/*3*/}</div>
            <div data-id="point4" {...props4} className="point point4">{/*4*/}</div>
            <div data-id="pointCenter12" {...props12} className="point pointCenter12">{/*12*/}</div>
            <div data-id="pointCenter43" {...props43} className="point pointCenter43">{/*43*/}</div>
            <div data-id="pointCenter24" {...props24} className="point pointCenter24">{/*24*/}</div>
            <div data-id="pointCenter31" {...props31} className="point pointCenter31">{/*31*/}</div>

            <div data-id="cover" className="cover" {...coverProps} />
          </Portal>
        </div>
      </div>
    );
  }
}
export default Layout;
