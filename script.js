import { fullClass as FULL_CLASS, disapprovedPairs as DISAPPROVED_PAIRS } from "./data.js";
// expects associated data of shapes:
// fullClass: [String]
// disapprovedPairs: [[String]], where inner arrays are expected to be of length 2. 

// example data below can be uncommented (along with commenting _out_ the import statement above) to run the script directly:
// const FULL_CLASS = ["Amethyst","Garnet","Pearl","Steven","Connie","Greg",
//         "Peridot","Lapis","Jasper", "Lion", "Onion"];

// const DISAPPROVED_PAIRS = [["Onion", "Lapis"],["Jasper", "Peridot"]];

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

// performant shuffle
function fisherYatesShuffle(arr) {
    for (let i= arr.length -1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const ARGS = getArgs();
let UNAPPROVED_MAP = {};

// maps "bad matches" by user name, for quick look up
function buildUnapprovedMap() {
    DISAPPROVED_PAIRS.forEach((pair) => {
        pair.forEach((student, i) => {
            const badMatch = i > 0 ? pair[0] : pair[1] // hard-coded for pairs
            if (UNAPPROVED_MAP[student]) {
                const arrCopy = UNAPPROVED_MAP[student]
                arrCopy.push(badMatch) 
                UNAPPROVED_MAP[student] = arrCopy
            } else {
                UNAPPROVED_MAP[student] = [badMatch]
            }
        })
    })
}

// splits up the class and creates groups,
// if a bad match occurs, calls itself again
function recursiveCheckAndSplit(fullClass, num, threshold) {
    let groups = [];
    for (let i= 0; i < fullClass.length; i += num) {
        const chunk = fullClass.slice(i, i+num)
        const badMatch = checkGroup(chunk)
        if(badMatch !== null){
            // find its index in the larger class arr
            const targetIndex = fullClass.indexOf(badMatch)
            // splice out the offender and...
            const removedStudentArr = fullClass.splice(targetIndex, 1) // removes item and IMPORTANTLY shortens arr by 1
            // in the case we are at the end...
            if (i >= (num*(threshold-1))) {
                // move them to the front of the shuffle
                fullClass.splice(0, 0, removedStudentArr[0])
            // otherwise,
            } else {
                // move the offender to just after this chunk
                fullClass.splice(i+num+2, 0, removedStudentArr[0]) // so we offset index by 2 here
            }
            // and start over
            groups = recursiveCheckAndSplit(fullClass, num, threshold) 
        } else {
            groups.push(chunk)
        }
    }
    return groups
}

// determines if a group containes a bad match
function checkGroup(group) {
    let firstBadMatch = null;

        for (const [k, v] of Object.entries(UNAPPROVED_MAP)) {
            if (group.includes(k)) {
                v.forEach((student, i) => {
                    if (group.includes(student)) {
                        firstBadMatch = student
                    }
                })
            }
        }
    return firstBadMatch
}

// main caller / script driver
if (ARGS.number) {
    const COUNT = Number(ARGS.number);
    if (COUNT > FULL_CLASS.length) {
        console.warn("Please provide a number less than the full class size of", FULL_CLASS.length.toString());
    } else {
        const threshold = Math.ceil(FULL_CLASS.length/COUNT) // total number of groups we will have
        buildUnapprovedMap();
        const shuffled = fisherYatesShuffle(FULL_CLASS);
        const groups = recursiveCheckAndSplit(shuffled, COUNT, threshold);
        console.log("groups: ", groups.slice(0, threshold)) // TODO: figure out why the recursion is working such that this slice is necessary.
    }
} else {
    console.warn("Please provide the number of students per group when calling the script, i.e. 'node script.js number=5'");
}