# "Seating Chart" Redo

_An improved script for creating class groups of any size, avoiding disruptive matches._

**JavaScript**

## Set up

Before using this script, please: 
- Make sure you are running the [most current version](https://nodejs.org/en/download/current) of Node!
- Create a data.js file with your class information (more README documentation on this tk, but you can find some in-code documentation in the repo).

## Running the script

After setting up, you can run the script by executing the following from the repository root...

```shell
    node script.js number=X
```
...where `X` is an integer number of how many students you would like in each group.

You can run the script's tests by executing the following from the repository root:

```shell
    node --test
```

## Background

For a recent application, the fellowship wanted to see an example of a program I wrote from scratch. I don't have a lot of available non-work samples, and I immediately thought of [this small script](https://github.com/halfghaninne/gwc-seating-chart/) I worked on back in 2016 when I was really new to coding and leading a Girls Who Code club in Omaha, Nebraska. I had last dusted it off in 2018, to make it a little more presentable and annotate places for refactoring and improvement.

So for this application, I improved it!

I rewrote the script in Node, refactored to allow users to pass in their own class data, updated the sorting and resorting algorithms, and wrote a little bit of error-catching for bad command line input. The resulting code is more performant and more testable than the original.

There's always room for improvement, though! Firstly and transparently, there's a bug with the recursion that I've just patched over for the time being. ~~I'd also like to add in a testing library and write unit tests.~~ _(currently in progress :))_ And right now the code is still hard-coded to think about disruptive groups as pairs only. It would be nice if this could be extended to reflect more real-world interpersonal classroom dynamics.



