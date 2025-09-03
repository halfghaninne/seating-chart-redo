import { fullClass as FULL_CLASS, disapprovedPairs as DISAPPROVED_PAIRS } from "./data.js";
// expects associated data of shapes:
// fullClass: [String]
// disapprovedPairs: [[String]]

function getArgs() {
  const args = process.argv.slice(2);
  let params = {};

  args.forEach(a => {
    const argKVPair = a.split("=");
    params[argKVPair[0]] = argKVPair[1];
  });

  return params;
}

function fisherYatesShuffle(arr) {
    for (let i= arr.length -1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const ARGS = getArgs();
let UNAPPROVED_MAP = {};

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

function splitGroups(fullClass, num) {
    let groups = [];
    // const danglers = [];
    // const checkCompleted = false;

    // while groups is less than the desired length (total length % groups round up?) && some flag is false
    // recursively run the check?
        // console.log("before recursion, our shuffled class is: ", fullClass)
    const threshold = Math.ceil(fullClass.length/num) // 3, number of groups we will have
    // while groups is less than the desired length, recursively run the check
    while (groups.length < threshold) {
        console.log("outer while loop is firing");
        groups = recursiveCheck(fullClass, groups, num, threshold)
    }
    
    return groups
}

function recursiveCheck(fullClass, groups, num, threshold) {
    console.log("at beginning of recursion, groups is: ", groups);
    for (let i= 0; i < fullClass.length; i += num) {
        console.log("in inner loop index ", i, " groups is: ", groups)
        const chunk = fullClass.slice(i, i+num)
        console.log("checking...", {chunk})
        const badMatch = checkGroup(chunk)
        if(badMatch !== null){
            console.log("offender: ", badMatch)
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
            //groups = []
            recursiveCheck(fullClass, [], num, threshold) // <-- needing chunk to shift/increment is an indication we need to move more of the loop mechanism in here.
        } else {
            groups.push(chunk)
        }
        console.log("at end of inner loop index", i, "groups is: ", groups)
    }
    console.log("at end of recursion, groups is: ", groups)
    return groups
}

function checkGroup(group) {
    let firstBadMatch = null;

        for (const [k, v] of Object.entries(UNAPPROVED_MAP)) {
            if (group.includes(k)) {
                v.forEach((student, i) => {
                    if (group.includes(student)) {
                        //console.log({group, student})
                        // firstBadMatchIndex = i
                        // return firstBadMatchIndex
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
        buildUnapprovedMap();
        // const shuffled = fisherYatesShuffle(FULL_CLASS);
        // hard-coding to check
        const shuffled = [
            'Steven',  'Amethyst',
            'Connie',  'Pearl',
            'Garnet',  'Lion',
            'Lapis',   'Greg',
            'Jasper',  'Onion',
            'Peridot'
        ]
        const groups = splitGroups(shuffled, COUNT);
        console.log({groups})
    }
} else {
    console.warn("Please provide the number of students per group when calling the script, i.e. 'node script.js number=5'");
}