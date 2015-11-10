# jsudoku
A backtracking sudoku solver and generator in javascript. Solves and generates normal and hyper sudokus.

```
$ npm install jsudoku
```

## Generate a sudoku
This can take a little while. Somewhere between 1 second and 1 minute. See [my C implementation](https://github.com/t638403/sudoku) if your impatient.
```
var s = require('jsudoku');
var solution = s.create_solution(0);
var sudoku = s.create_sudoku_from_solution(solution, 0);
s.print_sudoku(sudoku);
```
Use a `0` for normal sudokus and a `1` for hyper sudokus. For example: `s.create_solution(1)` will create a solution for a hyper sudoku.

Result:
```
0 8 0 9 0 0 0 0 3
0 0 0 0 2 0 1 0 0
0 0 0 0 0 4 0 0 0
0 0 2 0 0 0 4 0 0
0 0 0 0 8 0 6 2 0
6 0 9 0 0 0 0 0 0
0 2 0 4 3 0 0 0 0
4 5 0 1 0 0 0 8 0
0 1 0 5 0 6 7 0 0
```

## Solve a sudoku
```
var sudoku = new Uint8Array([
    0,8,0,9,0,0,0,0,3,
    0,0,0,0,2,0,1,0,0,
    0,0,0,0,0,4,0,0,0,
    0,0,2,0,0,0,4,0,0,
    0,0,0,0,8,0,6,2,0,
    6,0,9,0,0,0,0,0,0,
    0,2,0,4,3,0,0,0,0,
    4,5,0,1,0,0,0,8,0,
    0,1,0,5,0,6,7,0,0,
]);

var solution = s.solve(sudoku, 0);
s.print_sudoku(solution);
```

Will result in:
```
1 8 4 9 6 5 2 7 3
7 9 5 8 2 3 1 6 4
2 6 3 7 1 4 9 5 8
8 3 2 6 5 7 4 9 1
5 4 1 3 8 9 6 2 7
6 7 9 2 4 1 8 3 5
9 2 7 4 3 8 5 1 6
4 5 6 1 7 2 3 8 9
3 1 8 5 9 6 7 4 2
```
## API
Check the source for more info