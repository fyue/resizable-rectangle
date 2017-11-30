/**
 * Created by XZXDCASDF on 2017/11/14.
 */
import {observable, computed, action} from 'mobx';

const {sin, cos, atan, asin, acos, PI, sqrt} = Math;

export default class Store {
  @observable x1 = 0;
  @observable y1 = 0;
  @observable x2 = 0;
  @observable y2 = 0;
  @observable x3 = 0;
  @observable y3 = 0;
  @observable initAngleP1 = 0;
  @observable initAngleP2 = 0;
  @observable initAngleP3 = 0;
  @observable initRadius = 0;
  @observable initOx = 0;
  @observable initOy = 0;

  @observable rotatedAngles = 0; //angle, not radian，X轴负向顺时针为正

  @observable movable1 = false;
  @observable movable2 = false;
  @observable movable3 = false;
  @observable movable4 = false;

  constructor() {
    this.x1 = 100;
    this.y1 = 100;
    this.x2 = 150;
    this.y2 = 100;
    this.x3 = 100;
    this.y3 = 200;
    this.initOx = (this.x2 + this.x3) / 2;
    this.initOy = (this.y2 + this.y3) / 2;
    this.initRadius = this.radius;
    this.initAngleP1 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius);
    this.initAngleP2 = this.initAngleP1 + this.angleP12;
    this.initAngleP3 = this.initAngleP2 + PI;
    console.log(this.initRadius, this.initOx, this.initOy);
  }

  angleToRadian(deg) {
    return deg * PI / 180;
  }

  get radius() {
    return sqrt((this.x2 - this.x3) ** 2 + (this.y2 - this.y3) ** 2) / 2;
  }

  get angleP12() {
    let L12 = sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2);
    let L23 = this.radius * 2;
    return 2 * asin(L12 / L23);
  }

  @computed get properties() {
    return {
      x4: this.x2 + this.x3 - this.x1,
      y4: this.y2 + this.y3 - this.y1,
      Ox: (this.x2 + this.x3) / 2,
      Oy: (this.y2 + this.y3) / 2,
      L12: sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2),
      L13: sqrt((this.x3 - this.x1) ** 2 + (this.y3 - this.y1) ** 2),
      radius: this.radius,
      initAngleP1: asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius),
      initAngleP2: asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) + this.angleP12,
      initAngleP3: asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) + this.angleP12 + PI,
    };
  }

  @action changeP1(x, y) {
    this.x1 = x;
    this.y1 = y;
  }

  @action changeP2(x, y) {
    this.x2 = x;
    this.y2 = y;
  }

  @action changeP3(x, y) {
    this.x3 = x;
    this.y3 = y;
  }

  get recWidth() {
    return Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2);
  }

  get recHeight() {
    return Math.sqrt((this.x3 - this.x1) ** 2 + (this.y3 - this.y1) ** 2);
  }

  @action changeResizeAble(which, able) {
    this[which] = able;
  }

  @action updateInitState() {
    let rotatedAngles = this.angleToRadian(this.rotatedAngles);
    let CurrentAngleP1 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius);
    this.initRadius = this.radius;
    this.initOx = (this.x2 + this.x3) / 2;
    this.initOy = (this.y2 + this.y3) / 2;
    //CurrentAngleP1 is always <= PI / 2
    if (this.initOx <= this.x1) {
      this.initAngleP1 = PI - CurrentAngleP1 - rotatedAngles;
    } else {
      this.initAngleP1 = CurrentAngleP1 - rotatedAngles;
    }
    this.initAngleP2 = this.initAngleP1 + this.angleP12;
    this.initAngleP3 = this.initAngleP2 + PI;
    //console.log(this.initRadius, this.initOx, this.initOy, this.initAngleP1);
  }

  @action swingAngle(angle) {
    this.rotatedAngles = angle;

    let radianDlt = this.angleToRadian(angle);

    this.x1 = this.initOx - this.initRadius * cos(this.initAngleP1 + radianDlt);
    this.y1 = this.initOy - this.initRadius * sin(this.initAngleP1 + radianDlt);
    this.x2 = this.initOx - this.initRadius * cos(this.initAngleP2 + radianDlt);
    this.y2 = this.initOy - this.initRadius * sin(this.initAngleP2 + radianDlt);
    this.x3 = this.initOx - this.initRadius * cos(this.initAngleP3 + radianDlt);
    this.y3 = this.initOy - this.initRadius * sin(this.initAngleP3 + radianDlt);
    //console.log(this.initRadius, this.initOx, this.initOy, this.initAngleP1);
  }
}
