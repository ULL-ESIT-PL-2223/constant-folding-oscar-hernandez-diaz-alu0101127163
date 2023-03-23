const constantFolding = require('../src/constant-folding');
const should = require('chai').should();

const example1 = `a=2*3;`;
const expectedOutput = `a = 6;`;

describe('constantFolding tests', () => {
  it('works correctly with normal functions', () => {
    constantFolding(example1).should .equal(expectedOutput);
  });

});

const Checks = [
  { text: "a=2*3;", result: "a = 6;"},
  { text: "[a, b, c].join();", result: "'a,b,c';" },
  { text: "[a, b, c].join('@');", result: "'a@b@c';" },
  { text: "[1, 2, 3].length;", result: "3;" },
  { text: "[1, 2, 3][2-1];", result: "2;" },
  { text: "[1, 2, 3].shift();", result: "1;" },
  { text: "[a, b, c].pop();", result: "'c';"},
  { text: "'abc'[0];", result : "'a';"},
  { text: "'abc'.charAt();", result: "'a';"},
  { text: "'abc'.charAt(1);", result: "'b';"},
  { text: "'abc'.length;", result: "3;"},
  { text: "'a,b,c'.split(',');", result: "a,b,c;"},
  { text: "(100 + 23).toString();", result: "'123';" },
];

describe('constantFolding tests', () => {
  for (let c of Checks) {
    it(`Test ${c.text} = ${c.result}`, () => {
      constantFolding(c.text).should.equal(c.result);
    });
  }
});