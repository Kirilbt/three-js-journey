import Robot from './Robot.js'

export default class FlyingRobot extends Robot {
  constructor(name, legs) {
    super(name, legs)
  }

  sayHi() {
    console.log(`I'm ${this.name} and I can fly`)
  }

  takeOff() {
    console.log(`${this.name}: I'm taking off!`);
  }

  land() {
    console.log(`${this.name}: I've landed`);
  }
}
