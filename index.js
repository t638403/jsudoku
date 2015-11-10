module.exports = {
    create_solution:s_create_solution,
    solve:solve,
    solve_sudoku:s_solve_sudoku,
    check_sudoku:s_check_sudoku,
    get_row_values:s_get_row_values,
    get_col_values:s_get_col_values,
    get_block_values:s_get_block_values,
    get_nrc_block_values:s_get_nrc_block_values,
    check_region:s_check_region,
    dupl_sudoku:s_dupl_sudoku,
    find_first_zero_index:s_find_first_zero_index,
    get_cell_possibs:s_get_cell_possibs,
    divfloor:s_divfloor,
    get_row_index:s_get_row_index,
    get_col_index:s_get_col_index,
    get_block_index:s_get_block_index,
    get_nrc_block_index:s_get_nrc_block_index,
    create_sudoku_from_solution:s_create_sudoku_from_solution,
    print_sudoku:s_print_sudoku,
    print_region:s_print_region,
    eq_sudoku:s_eq_sudoku
};

/**
 * Returns a random int equally distributed over the range [start ..end -1].
 *
 * @method g_random_int
 * @private
 * @param start {int} lower closed bound of the interval
 * @param end {int} upper open bound of the interval
 * @returns {int} a random number
 */
function g_random_int_range(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

/**
 * Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end. If end
 * is not specified it’s set to start with start then set to 0. If end is less than start a zero-length range is created
 * unless a negative step is specified.
 *
 * Example: range(5) -> [0,1,2,3,4]
 *
 * @method range
 * @private
 * @param start {int} The start of the range (optional)
 * @param end {int} The end of the range
 * @returns {Array} Returns the new array of numbers.
 */
function range(start, end) {
    var r = [];
    if(end === undefined) {
        end = start;
        start = 0;
    }
    for(var i=start;i<end;i++) {
        r.push(i);
    }
    return r;
}

/**
 * Creates an array excluding all provided values using SameValueZero for equality comparisons.
 *
 * Example: without([1, 2, 3], 3, 4, 5) -> [1, 2]
 *
 * @method without
 * @private
 * @param array {Array} The array to filter
 * @param values The values to exclude
 * @returns {Array}
 */
function without() {
    var newarr = [];
    var oldarr = arguments[0];
    var itemsToRemove = Array.prototype.slice.call(arguments, 1);
    oldarr.forEach(function(item) {
        var foundItem = itemsToRemove.some(function(itemToRemove) {
            return (item === itemToRemove);
        });
        if(!foundItem) {
            newarr.push(item);
        }
    })
    return newarr;
}

/**
 * Create a solution field to extract sudokus from
 *
 * @method create_solution
 * @param puzzleType {int} 0 for normal sudoku, and 1 for hyper sudoku. Defaults to 0;
 * @returns {Uint8Array} The solution
 */
function s_create_solution(puzzleType) {
    puzzleType = puzzleType || 0;
    var empty_sudoku = new Uint8Array(81);
    var max = {v:1};
    var solutions = [];
    s_solve_sudoku(empty_sudoku, max, solutions, puzzleType);
    return solutions[0];
}

/**
 * Solve a sudoku
 *
 * @method solve
 * @param sudoku
 * @param puzzleType {int} 0 for normal sudoku, and 1 for hyper sudoku. Defaults to 0;
 * @returns {Uint8Arrau} The solution
 */
function solve(sudoku, puzzleType) {
    puzzleType = puzzleType || 0;
    var solutions = [];
    if(s_solve_sudoku(sudoku, {v:1}, solutions, puzzleType)) {
        return solutions[0];
    } else {
        throw new Error('No solution found');
    }
}
/**
 * Find one or more grids that conforms to the sudoku restrictions. If the grid is empty, it will find a random
 * solution. If the grid is a proper sudoku (e.g. 1 solution) it will solve the sudoku. This function is implemented as
 * a backtracking algorithm. This function is the hart of the generator. If it finds more than one solution for a less
 * proper sudoku you can conclude that the less proper sudoku is in fact no sudoku at all since being a sudoku means
 * having exactly one solution.
 *
 * @method solve_sudoku
 * @param sudoku {Uint8Array} The grid/sudoku to solve
 * @param max {int} Tell the solver to find more solutions.
 * @param solutions {Array} An array of Uint8Array objects being the solution(s) for the grid/sudoku
 * @param puzzleType {int} 0 for normal sudoku, and 1 for hyper sudoku. Defaults to 0;
 * @returns {number} Whether a solution is found, 1 if found, 0 if not found.
 */
function s_solve_sudoku(sudoku, max, solutions, puzzleType) {
    puzzleType = puzzleType || 0;
    var sudoku_is_valid = s_check_sudoku(sudoku, puzzleType);
    if(sudoku_is_valid) {
        solutions.push(s_dupl_sudoku(sudoku));
        max.v--
        if(max.v == 0) {return 1;}
        return 0;
    }
    var i = s_find_first_zero_index(sudoku);
    var found_first_zero_index = (i + 1);
    if(found_first_zero_index) {
        var possibs = s_get_cell_possibs(sudoku, i, puzzleType);
        var length = possibs.length;
        while(possibs.length>0) {
            sudoku[i] = possibs[g_random_int_range(0, length)];
            possibs = without(possibs, sudoku[i]);
            length = possibs.length;
            var found = s_solve_sudoku(sudoku, max, solutions, puzzleType);
            if(found) {return 1;}
            sudoku[i] = 0;
        }
    }
    return 0;
}

/**
 * Check if a grid of numbers applies to the rules of the sudoku field.
 *
 * @method check_sudoku
 * @param sudoku {Uint8Array} The sudoku
 * @param puzzleType {int} 0 for normal sudoku, and 1 for hyper sudoku. Defaults to 0;
 * @returns {number} 1 if true, 0 if false
 */
function s_check_sudoku(sudoku, puzzleType) {
    puzzleType = puzzleType || 0;
    for(var i=0;i<9;i++) {
        var row = s_get_row_values(sudoku, i);
        var cr = s_check_region(row);
        if(cr == 0) {
            return 0;
        }
        var col = s_get_col_values(sudoku, i);
        var cc = s_check_region(col);
        if(cc == 0) {
            return 0;
        }
        var block = s_get_block_values(sudoku, i);
        var cb = s_check_region(block);
        if(cb == 0) {
            return 0;
        }
        if(puzzleType == 1 && i < 4) {
            var nrc_block = s_get_nrc_block_values(sudoku, i);
            var cb = s_check_region(nrc_block);
            if(cb == 0) {
                return 0;
            }
        }
    }
    return 1;
}

/**
 * Check if a region (e.g. row, col, block) is valid. It
 *
 * @method check_region
 * @param region {Array}
 * @returns {number}
 */
function s_check_region(region) {
    var found = [0,0,0,0,0,0,0,0,0];
    for(var i=0;i<9;i++) {
        if(region[i] == 0) {return 0;}
        found[region[i] - 1] = 1;
    }
    for(var i=0;i<9;i++) {
        if(found[i] == 0) {return 0;}
    }
    return 1;
}

/**
 * Duplicate a sudoku.
 *
 * @method dupl_sudoku
 * @param sudoku {Uint8Array} The sudoku
 * @returns {Uint8Array} The duplicate
 */
function s_dupl_sudoku(sudoku) {
    var dupl = new Uint8Array(81);
    for(var i=0;i<81;i++) {
        dupl[i] = sudoku[i];
    }
    return dupl;
}

/**
 * Find the index of the first cell containing a zero.
 *
 * @method find_first_zero_index
 * @param sudoku {Uint8Array} The sudoku
 * @returns {number} The index
 */
function s_find_first_zero_index(sudoku) {
    for(var i=0;i<81;i++) {
        if(sudoku[i] == 0) {
            return i;
        }
    }
    return -1;
}

/**
 * Get the open values for this cell.
 *
 * @method get_cell_possibs
 * @param sudoku {Uint8Array} The sudoku
 * @param i {int} The cell index
 * @param puzzleType {int} 0 for normal sudoku, 1 for nrc/hyper sudoku
 * @returns {Array} The possible values for this cell
 */
function s_get_cell_possibs(sudoku, i, puzzleType) {

    puzzleType = puzzleType || 0;
    var possibs = range(1, 10);
    var j;

    var row_values = s_get_row_values(sudoku, s_get_row_index(i));

    for(j=0;j<9;j++) {
        row_values.unshift(possibs);
        possibs = without.apply(null, row_values);
    }

    var col_values = s_get_col_values(sudoku, s_get_col_index(i));
    for(j=0;j<9;j++) {
        col_values.unshift(possibs);
        possibs = without.apply(null, col_values);
    }

    var block_values = s_get_block_values(sudoku, s_get_block_index(i));
    for(j=0;j<9;j++) {
        block_values.unshift(possibs);
        possibs = without.apply(null, block_values);
    }

    if(puzzleType == 1 && s_get_nrc_block_index(i) > -1) {
        var nrc_block_values = s_get_nrc_block_values(sudoku, s_get_nrc_block_index(i));
        for(j=0;j<9;j++) {
            nrc_block_values.unshift(possibs);
            possibs = without.apply(null, nrc_block_values);
        }
    }
    return possibs;
}

/**
 * Get the values for a row based on the row index
 *
 * @method get_row_values
 * @param sudoku {Uint8Array} The sudoku
 * @param y {int} The row index, 0-8
 * @returns {Array} The values
 */
function s_get_row_values(sudoku, y) {
    var row = [];
    for(var i=0;i<9;i++) {
        row[i] = sudoku[9 * y + i];
    }
    return row;
}

/**
 * Get the values for a col based on the col index
 *
 * @method get_col_values
 * @param sudoku {Uint8Array} The sudoku
 * @param x {int} The col index, 0-8
 * @returns {Array} The values
 */
function s_get_col_values(sudoku, x) {
    var ci=0;
    var col = [];
    for(var i=0;i<81;i+=9) {
        col[ci] = sudoku[i+x];
        ci++;
    }
    return col;
}

/**
 * Get the values for a block based on the block index
 *
 * @method get_block_values
 * @param sudoku {Uint8Array} The sudoku
 * @param b {int} The block index, 0-8
 * @returns {Array} The values
 */
function s_get_block_values(sudoku, b) {
    var bi=0;
    var first_row = b - b%3;
    var first_col = b%3 * 3;
    var block = [];
    for(var i=0;i<3;i++) {
        for(var j=0;j<3;j++) {
            block[bi] = sudoku[(first_row + i) * 9 + j + first_col];
            bi++;
        }
    }
    return block;
}

/**
 * Get the values for a nrc/hyper block based on the nrc/hyper block index
 *
 * @method get_nrc_block_values
 * @param sudoku {Uint8Array} The sudoku
 * @param b {int} The nrc_block index, 0-8
 * @returns {Array} The values
 */
function s_get_nrc_block_values(sudoku, b) {
    var blocks = [
        [10, 11, 12, 19, 20, 21, 28, 29, 30],
        [14, 15, 16, 23, 24, 25, 32, 33, 34],
        [46, 47, 48, 55, 56, 57, 64, 65, 66],
        [50, 51, 52, 59, 60, 61, 68, 69, 70]
    ];
    var block = [];
    for(var i=0;i<9;i++) {
        block[i] = sudoku[blocks[b][i]];
    }
    return block;
}

/**
 * Divide and floor a number by a divider
 *
 * @method divfloor
 * @private
 * @param n {int} The number
 * @param d {int} The devider
 * @returns {number} The divided and flored number
 */
function s_divfloor(n, d) {
    return ((n-(n%d))/d);
}

/**
 * Get the row index based on a cell index
 *
 * @method get_row_index
 * @param i {int} The cell index
 * @returns {number} The row index
 */
function s_get_row_index(i) {
    return s_divfloor(i, 9);
}

/**
 * Get the col index based on a cell index
 *
 * @method get_col_index
 * @param i {int} The cell index
 * @returns {number} The col index
 */
function s_get_col_index(i) {
    return (i - (s_get_row_index(i) * 9));
}

/**
 * Get the block index based on a cell index
 *
 * @method get_block_index
 * @param i {int} The cell index
 * @returns {number} The block index
 */
function s_get_block_index(i) {
    var ri = s_get_row_index(i);
    var ci = s_get_col_index(i);
    var bi = (3 * s_divfloor(ri, 3) + s_divfloor(ci, 3));
    return bi;
}

/**
 * Get the nrc/hyper block index based on a cell index
 *
 * @method get_nrc_block_index
 * @param i {int} The cell index
 * @returns {number} The nrc/hyper block index
 */
function s_get_nrc_block_index(i) {
    var blocks = [
        [10, 11, 12, 19, 20, 21, 28, 29, 30],
        [14, 15, 16, 23, 24, 25, 32, 33, 34],
        [46, 47, 48, 55, 56, 57, 64, 65, 66],
        [50, 51, 52, 59, 60, 61, 68, 69, 70]
    ];

    for(var j=0;j<4;j++) {
        for(var k=0;k<9;k++) {
            if(i == blocks[j][k]) {
                return j;
            }
        }
    }
    return -1;
}

/**
 * Create a sudoku out of a solution.
 *
 * @method create_sudoku_from_solution
 * @param solution
 * @returns {Uint8Array}
 */
function s_create_sudoku_from_solution(solution) {
    var sudoku = s_dupl_sudoku(solution);

    var all_indexes = range(81);
    var valid_indexes = [];

    while(all_indexes.length > 0) {

        var currentIndex = all_indexes[g_random_int_range(0, all_indexes.length)];
        all_indexes = without(all_indexes, currentIndex);
        sudoku[currentIndex] = 0;

        var max = {v:2};
        var solutions = [];

        s_solve_sudoku(sudoku, max, solutions);
        if(solutions.length == 1) {
            valid_indexes.unshift(currentIndex);
        }

        sudoku = s_dupl_sudoku(solution);
        for(var i=0;i<valid_indexes.length;i++) {
            var validIndex = valid_indexes[i];
            sudoku[validIndex] = 0;
        }
    }
    return sudoku;
}

/**
 * Print a sudoku to the console
 *
 * @method print_sudoku
 * @param sudoku {Uint8Array}
 */
function s_print_sudoku(sudoku) {
    for(var i=0;i<9;i++) {
        var row = s_get_row_values(sudoku, i);
        s_print_region(row);
    }
}

/**
 * Print a region to the screen
 *
 * @param region {Array} An array of numbers
 */
function s_print_region(region) {
    console.log(region.join(' '));
}

/**
 * Check if two sudokus are the same
 *
 * @method eq_sudoku
 * @param s1 {Uint8Array} First sudoku
 * @param s2 {Uint8Array} Second sudoku
 * @returns {number} 0 if different, 1 if same
 */
function s_eq_sudoku(s1, s2) {
    for(var i=0;i<81;i++) {
        if(s1[i] != s2[i]) {
            return 0;
        }
    }
    return 1;
}