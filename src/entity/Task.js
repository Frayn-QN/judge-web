export default class Task {
  constructor(problemID, language, code, judge, input) {
    this.problemID = problemID;
    this.answer = {};
    this.answer.language = language;
    this.answer.code = code;
    this.answer.judge = judge;
    this.answer.input = input;
  }
}
