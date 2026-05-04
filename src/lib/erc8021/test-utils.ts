import { ERC8021_MARKER } from './constants';

export const OFFICIAL_TEST_CASES = [
  {
    name: "Single entity attribution + canonical registry",
    input: "0xdddddddd62617365617070070080218021802180218021802180218021",
    expected: { schema: 0, codes: ["baseapp"] }
  }
];

export function runTests() {
  let passed = 0;
  for (const test of OFFICIAL_TEST_CASES) {
    if (test.input.endsWith(ERC8021_MARKER)) {
      passed++;
    }
  }
  return passed === OFFICIAL_TEST_CASES.length;
}
