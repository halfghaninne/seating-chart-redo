// maps "bad matches" by user name, for quick look up
export function buildUnapprovedMap(DISAPPROVED_PAIRS) {
    let map = {}
    DISAPPROVED_PAIRS.forEach((pair) => {
        pair.forEach((student, i) => {
            const badMatch = i > 0 ? pair[0] : pair[1] // hard-coded for pairs
            if (map[student]) {
                const arrCopy = map[student]
                arrCopy.push(badMatch) 
                map[student] = arrCopy
            } else {
                map[student] = [badMatch]
            }
        })
    })
    return map;
}

// determines if a group containes a bad match
export function checkGroup(group, UNAPPROVED_MAP) {
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

// performant shuffle
export function fisherYatesShuffle(arr) {
    for (let i= arr.length -1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// splits up the class and creates groups,
// if a bad match occurs, calls itself again
export function recursiveCheckAndSplit(fullClass, num, threshold, UNAPPROVED_MAP) {
    let groups = [];
    for (let i= 0; i < fullClass.length; i += num) {
        const chunk = fullClass.slice(i, i+num)
        const badMatch = checkGroup(chunk, UNAPPROVED_MAP)
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
            return recursiveCheckAndSplit(fullClass, num, threshold, UNAPPROVED_MAP) 
        } else {
            groups.push(chunk)
        }
    }
    return groups
}