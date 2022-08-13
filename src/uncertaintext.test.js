import {sum} from "./sum.js"
import {uncertaintext} from "./uncertaintext.js"

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
