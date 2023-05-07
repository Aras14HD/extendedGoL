extern crate js_sys;
extern crate wasm_bindgen;

mod utils;

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, GoLtest!")
}

#[wasm_bindgen]
pub fn update(cells_in: Box<[f64]>, cols: usize) -> Box<[f64]> {
    set_panic_hook();
    let cells: Vec<Vec<f64>> = cells_in.to_vec().chunks(cols).map(|s| s.into()).collect();

    let mut column: usize = 0;
    let mut row: usize = 0;
    let mut new: Vec<Vec<f64>> = cells.clone();

    for col in cells.clone() {
        column += 1;
        for cell in col.clone() {
            row += 1;
            let mut tcell: f64;
            let mut n: f64 = 0.0;

            for x in 0..=2 {
                for y in 0..=2 {
                    if x != 1 || y != 1 {
                        let neighbor_column: usize;
                        let neighbor_row: usize;

                        if x == 0 && column == 0 {
                            neighbor_column = cells.len() - 1;
                        } else if x == 2 && column == cells.len() - 1 {
                            neighbor_column = 0;
                        } else {
                            neighbor_column = column + x - 1;
                        }

                        if y == 0 && row == 0 {
                            neighbor_row = col.len() - 1;
                        } else if y == 2 && row == col.len() - 1 {
                            neighbor_row = 0;
                        } else {
                            neighbor_row = row + y - 1;
                        }

                        n += cells[neighbor_column][neighbor_row];
                    }
                }
            }

            if cell >= 0.5 {
                tcell = -0.5 * (n - 2.5) * (n - 2.5) + 1.125;
            } else {
                tcell = -1.0 * (n - 3.0) * (n - 3.0) + 1.0;
            }

            if tcell < 0.0 {
                tcell = 0.0;
            }
            if tcell > 1.0 {
                tcell = 1.0;
            }

            new[column][row] = tcell;
        }
    }

    let mut out: Vec<f64> = vec![];
    for mut col in new {
        out.append(col.as_mut());
    }
    out.into_boxed_slice()
}
