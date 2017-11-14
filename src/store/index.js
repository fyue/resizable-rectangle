/**
 * Created by XZXDCASDF on 2017/11/14.
 */
import {observable, computed, action} from 'mobx';

const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const atan = Math.atan;

//const r = Math.sqrt(100 ** 2 + 100 ** 2) / 2;

export default class Store {
  @observable dltX1 = 0;
  @observable dltY1 = 0;
  @observable dltX2 = 0;
  @observable dltY2 = 0;
  @observable dltX3 = 0;
  @observable dltY3 = 0;
  @observable dltX4 = 0;
  @observable dltY4 = 0;

  @observable currentDeg = 0;
  @observable x1 = 0;
  @observable y1 = 0;
  @observable x2 = 0;
  @observable y2 = 0;
  @observable x3 = 0;
  @observable y3 = 0;
  @observable x4 = 0;
  @observable y4 = 0;

  @observable movable = false;

  constructor() {
    this.x1 = 100;
    this.y1 = 100;
    this.x2 = 200;
    this.y2 = 100;
    this.x3 = 100;
    this.y3 = 300;
    this.x4 = 200;
    this.y4 = 300;
  }

  get arfa() {
    return atan(this.recHeight / this.recWidth);
  }

  get recWidth() {
    return Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2);
  }

  get recHeight() {
    return Math.sqrt((this.x3 - this.x1) ** 2 + (this.y3 - this.y1) ** 2);
  }

  get radius() {
    return Math.sqrt(this.recWidth ** 2 + this.recHeight ** 2) / 2;
  }

  @action changeResizeAble(able) {
    this.movable = able;
  }

  @action swingAngle(angle) {
    this.currentDeg = angle;
    let deg = angle * PI / 180;
    let r = this.radius;
    let A = this.arfa;
    let offsetPoint1 = A;
    let offsetPoint2 = PI - A;
    let offsetPoint3 = PI * 2 - A;
    let offsetPoint4 = PI + A;
    console.log(r, A);

    this.dltX1 = r * (cos(offsetPoint1) - cos(offsetPoint1 + deg));
    this.dltY1 = r * (sin(offsetPoint1 + deg) - sin(offsetPoint1));

    this.dltX2 = r * (cos(offsetPoint2) - cos(offsetPoint2 + deg));
    this.dltY2 = r * (sin(offsetPoint2 + deg) - sin(offsetPoint2));

    this.dltX3 = r * (cos(offsetPoint3) - cos(offsetPoint3 + deg));
    this.dltY3 = r * (sin(offsetPoint3 + deg) - sin(offsetPoint3));

    this.dltX4 = r * (cos(offsetPoint4) - cos(offsetPoint4 + deg));
    this.dltY4 = r * (sin(offsetPoint4 + deg) - sin(offsetPoint4));
  }
}
