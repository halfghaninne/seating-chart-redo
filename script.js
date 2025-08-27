function getArgs() {
  const args = process.argv.slice(2);
  let params = {};

  args.forEach(a => {
    const argKVPair = a.split("=");
    params[argKVPair[0]] = argKVPair[1];
  });

  return params;
}

const args = getArgs();

if (args.number) {
    console.log(args.number)

} else {
    console.warn("Please provide the nubmer of students per group when calling the script, i.e. 'node script.js number=5'");
}