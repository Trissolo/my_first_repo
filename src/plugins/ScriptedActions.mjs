export default class ScriptedActions {
    // static count = 0;
    get value() {
      console.log('Getting the current value!');
      return this.count;
    }
    increment() {
      this.count++;
    }
}
