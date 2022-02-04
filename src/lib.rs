extern crate wasm_bindgen;
extern crate js_sys;

mod utils;

use wasm_bindgen::prelude::*;
use js_sys::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, GoLtest!")
}

#[wasm_bindgen]
pub fn update(cells: Vec<f64>, cols: usize) -> Vec<f64> {
    let cells_slice = &cells[..];
    let columns = cells_slice.split(|n| n % cols == 0);
    let c = 0;
    for col in columns {
        for cell in col {
            let mut tcell: f64;
    let mut n: f64 = 0.0;
    let cell = cell.as_f64();

    for x in 0..=2 {
        for y in 0..=2 {
            if x != 1 || y != 1 {
                let mut neighbor_column: u32;
                let mut neighbor_row: u32;

                if x == 0 && column_ == 0 {
                    neighbor_column = cell.len() - 1;
                } else if x == 2 && column_ == cell.len() - 1 {
                    neighbor_column = 0;
                } else {
                    neighbor_column = column_ + x - 1;
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
    wasm_bindgen::JsValue::from(tcell)   
        }
        c += 1;
    }
}
