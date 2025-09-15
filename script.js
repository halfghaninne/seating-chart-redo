import { fullClass as FULL_CLASS, disapprovedPairs as DISAPPROVED_PAIRS } from "./data.js";
// add in your own private data.js file! you can follow/rename and repurpose the data-example.js file for the proper syntax.
// expects associated data of shapes:
// fullClass: [String]
// disapprovedPairs: [[String]], where inner arrays are expected to be of length 2. 
import { buildUnapprovedMap, fisherYatesShuffle, recursiveCheckAndSplit } from "./utils.js";

// grabs arguments k,v pairs from user command-line input
function getArgs() {
  const args = process.argv.slice(2);
  let params = {};

  args.forEach(a => {
    const argKVPair = a.split("=");
    params[argKVPair[0]] = argKVPair[1];
  });

  return params;
}

const ARGS = getArgs();

// main caller / script driver
if (ARGS.number) {
    const COUNT = Number(ARGS.number);
    if (COUNT > FULL_CLASS.length) {
        console.warn("Please provide a number less than the full class size of", FULL_CLASS.length.toString());
    } else {
        const threshold = Math.ceil(FULL_CLASS.length/COUNT) // total number of groups we will have
        const UNAPPROVED_MAP = buildUnapprovedMap(DISAPPROVED_PAIRS);
        const shuffled = fisherYatesShuffle(FULL_CLASS);
        const groups = recursiveCheckAndSplit(shuffled, COUNT, threshold, UNAPPROVED_MAP);
        console.log("groups: ", groups.slice(0, threshold)) // TODO: figure out why the recursion is working such that this slice is necessary.
    }
} else {
    console.warn("Please provide the number of students per group when calling the script, i.e. 'node script.js number=5'");
}