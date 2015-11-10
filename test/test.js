var tap = require('tap'),
    _ = require('lodash');

var s = require('../index');

var solution = new Uint8Array([
    5,6,7,2,3,4,8,9,1,
    8,1,2,7,9,6,3,4,5,
    4,3,9,1,8,5,2,6,7,
    1,8,4,9,2,7,5,3,6,
    2,5,3,4,6,8,7,1,9,
    7,9,6,5,1,3,4,2,8,
    3,4,1,8,7,9,6,5,2,
    6,2,8,3,5,1,9,7,4,
    9,7,5,6,4,2,1,8,3
]);
var falseSolution = new Uint8Array([
    5,5,5,2,3,4,8,9,1,
    5,5,5,7,9,6,3,4,5,
    5,5,5,1,8,5,2,6,7,
    1,8,4,9,2,7,5,3,6,
    2,5,3,4,6,8,7,1,9,
    7,9,6,5,1,3,4,2,8,
    3,4,1,8,7,9,6,5,2,
    6,2,8,3,5,1,9,7,4,
    9,7,5,6,4,2,1,8,3
]);
var sudoku = new Uint8Array([
    0,0,7,0,0,4,0,9,0,
    0,0,0,0,0,0,3,0,0,
    0,0,0,0,8,0,0,0,0,
    0,8,4,0,2,7,5,0,0,
    0,0,3,0,0,0,0,0,0,
    0,0,0,0,0,0,4,2,8,
    0,4,0,0,0,0,6,0,2,
    0,2,8,0,0,1,0,7,0,
    9,0,0,6,0,0,0,0,3
]);

// 1. get_row_values
tap.ok(sameValues([3,0,0,0,0,0,0,0,0], s.get_row_values(sudoku, 1)), 'Check get_row_values');

// 2. get_col_values
tap.ok(sameValues([9,2,7,0,0,0,0,0,0], s.get_col_values(sudoku, 7)), 'Check get_col_values');

// 3. get_block_values
tap.ok(sameValues([4,8,0,0,0,0,0,0,0], s.get_block_values(sudoku, 1)), 'Check get_block_values');

// 4. get_nrc_block_values
tap.ok(sameValues([3,7,5,0,0,0,0,0,0], s.get_nrc_block_values(sudoku, 1)), 'Check get_block_values');

// 5. check_region
tap.equal(s.check_region([8,1,2,7,9,6,3,4,5]), 1, 'Check good region');

// 6. check_region
tap.equal(s.check_region([8,8,2,7,9,6,3,4,5]), 0, 'Check false region');

// 7. check dupl_sudoku
tap.ok(sameValues(fromIntXArray(sudoku), fromIntXArray(s.dupl_sudoku(sudoku))), 'Check dupl_sudoku')

// 8. first_zero_index
tap.equal(s.find_first_zero_index(sudoku), 0, 'Check first_zero_index');

// 9. first_zero_index
tap.equal(s.find_first_zero_index(solution), -1, 'Check first_zero_index if none exists');

// 10. get_row_index
tap.equal(s.get_row_index(16), 1, 'Check get_row_index');

// 11. get_col_index
tap.equal(s.get_col_index(16), 7, 'Check get_col_index');

// 12. get_block_index
tap.equal(s.get_block_index(16), 2, 'Check get_block_index');

// 13. get_nrc_block_index
tap.equal(s.get_nrc_block_index(16), 1, 'Check get_nrc_block_index');

// 14. get_cell_possibs
tap.ok(sameValues(s.get_cell_possibs(sudoku, 16, 0), [1,4,5,6,8]), 'Check cell possibs for normal sudoku');

// 15. get_cell_possibs
tap.ok(sameValues(s.get_cell_possibs(sudoku, 16, 1), [1,4,6,8]), 'Check cell possibs for NRC sudoku');

// 16. check_sudoku
tap.equal(s.check_sudoku(falseSolution), 0, 'Check if a false sudoku solution validates');

// 17. check_sudoku
tap.equal(s.check_sudoku(solution), 1, 'Check if true sudoku solution validates');

// 18. eq_sudoku
tap.equal(s.eq_sudoku(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])), 1, 'Check eq_sudoku');

// 19. solve_sudoku
var solutions = [];
s.solve_sudoku(sudoku, 1, solutions);
tap.equal(s.eq_sudoku(solutions[0], solution), 1, 'Check if solution is ok');

function sameValues(a1, a2) {
    if(a1.length != a2.length) {return false;}
    a1.every(function(v) {
        return _.contains(a2, v);
    })
    return true;
}

function fromIntXArray(intXArray) {
    var a = [];
    for(var i=0;i<intXArray.length;i++) {
        a.push(intXArray[i]);
    }
    return a;
}