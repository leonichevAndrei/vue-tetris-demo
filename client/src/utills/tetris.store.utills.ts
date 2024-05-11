import { generateFieldTypes } from "@/config/tetris.enums";

export function generateAnyFieldMatrix(width: number, height: number, generateFieldType: generateFieldTypes) {
  const matrix: number[][] = [];
  let result: number = 0;
  for (let y = 0; y < height; y++) {
    matrix[y] = [];
    for (let x = 0; x < width; x++) {
      switch(generateFieldTypes[generateFieldType]) {
        case 'filled': result = 1; break;
        case 'empty': result = 0; break;
        case 'random': result = Math.round(Math.random());
      }
      matrix[y][x] = result;
    }
  }
  // console.log(matrix);
  return matrix;
}