import {parse} from '../src/range';

describe('parse', () => {
  function parseCheck(code: string, output: string) {
    return () => expect(parse(code).toString()).toEqual(output);
  }
  it('start', parseCheck('1','1'));
  it('start + end (single)', parseCheck('1:2','1')); // OK: end index is excluded
  it('start + end (multiple)', parseCheck('1:10','(1:10)'));
  it('start + end + step', parseCheck('1:2:3','(1:2:3)'));

  it('negative start (single)', parseCheck('-2:-1','(-2)')); // OK: end index is excluded
  it('negative start (multiple)', parseCheck('-3:-1','(-3:-1)'));
  it('negative end', parseCheck('1:-1','(1:-1)'));
  it('negative end < -1', parseCheck('1:-2','(1:-2)'));
  it('negative end with step', parseCheck('0:-1:2','(0:-1:2)'));
  it('negative step < -1', parseCheck('1:2:-2','(1:2:-2)'));

  it('comma space set', parseCheck('1, (1,4)', '1,(1,4)'));
  it('comma tab set', parseCheck('1,\t(1,4)', '1,(1,4)'));
  it('comma space range', parseCheck('(1:3), (1:3)', '(1:3),(1:3)'));

  it('syntax error', parseCheck(':::::', '(NaN:NaN:NaN)')); // TODO: BUG! (Should throw error.)
});

// TODO: Add at least one test for range.CompositeRange1D
// TODO: Add at least one test for range.Range
// TODO: Add at least one test for range.Range1D
// TODO: Add at least one test for range.Range1DGroup
// TODO: Add at least one test for range.RangeElem
// TODO: Add at least one test for range.SingleRangeElem
// TODO: Add at least one test for range.all
// TODO: Add at least one test for range.asUngrouped
// TODO: Add at least one test for range.cell
// TODO: Add at least one test for range.composite
// TODO: Add at least one test for range.is
// TODO: Add at least one test for range.join
// TODO: Add at least one test for range.list
// TODO: Add at least one test for range.none
// TODO: Add at least one test for range.range
