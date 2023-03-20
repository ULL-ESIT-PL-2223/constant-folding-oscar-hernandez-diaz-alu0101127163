const constantFolding = require('../src/constant-folding');
const should = require('chai').should();

const example1 = `a=2*3;`;
const expectedOutput = `a=6;`;

describe('constantFolding tests', () => {
  it('works correctly with normal functions', () => {
    constantFolding(example1).should .equal(expectedOutput);
  });

});