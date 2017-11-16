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

  @observable rotatedAngles = 0; //angle, not radian

  @observable movable = false;

  constructor() {
    this.x1 = 100;
    this.y1 = 100;
    this.x2 = 150;
    this.y2 = 100;
    this.x3 = 100;
    this.y3 = 200;
    this.initRadius = this.radius;
    this.initAngleP1 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius);
    this.initAngleP2 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) + this.angleP12;
    this.initAngleP3 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) + this.angleP12 + PI;
    this.initOx = (this.x2 + this.x3) / 2;
    this.initOy = (this.y2 + this.y3) / 2;
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

  @action changeResizeAble(able) {
    this.movable = able;
  }

  @action updateInitState() {
    let rotatedAngles = this.rotatedAngles;
    this.initRadius = this.radius;
    this.initAngleP1 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) - this.angleToRadian(rotatedAngles);
    this.initAngleP2 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) + this.angleP12 - this.angleToRadian(rotatedAngles);
    this.initAngleP3 = asin(((this.y2 + this.y3) / 2 - this.y1) / this.radius) + this.angleP12 + PI - this.angleToRadian(rotatedAngles);
    this.initOx = (this.x2 + this.x3) / 2;
    this.initOy = (this.y2 + this.y3) / 2;
    console.log(this.initRadius, this.initOx, this.initOy);
  }

  @action swingAngle(angle) {
    this.rotatedAngles = angle;

    let radianDlt = this.angleToRadian(angle);

    this.x1 = this.initOx - this.initRadius * cos(this.initAngleP1 + radianDlt);
    this.y1 = this.initOy - this.initRadius * sin(this.initAngleP1 + radianDlt);
    this.x2 = this.initOx - this.initRadius * cos(this.initAngleP2 + radianDlt);
    this.y2 = this.initOy - this.initRadius * sin(this.initAngleP2 + radianDlt);
    this.x3 = this.initOx - this.initRadius * cos(this.initAngleP3 + radianDlt);
    console.log(this.initRadius, this.initOx, this.initOy);
  }
}
