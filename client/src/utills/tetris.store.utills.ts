import { gameStateEnum, generateFieldTypes } from "@/config/tetris.enums";
import allElements from '@/assets/elements/all-elms';

export function getMiddlePosition(width: number, elementWidth: number) {
  return Math.round(width/2 - elementWidth/2 - 0.1);
}

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

export function renderFieldMatrix (staticMatrix: number[][], fieldMatrix: number[][], elementId: number, prevElementCoords: number[], elementCoords: number[], elementSpin: number ): { matrix: number[][], gameState: gameStateEnum } { 
  // const element = allElements[elementId][elementSpin];

  // // console.log(element);
  // // console.log(staticMatrix);
  // // console.log("Coords: " + elementCoords);
  // // console.log('--------------------')
  // // console.log('--------------------')

  // let isPossiblePosition = true;
  // let isCollision = false;
  // const newFieldMatrix = [...staticMatrix];
  // let relX: number, relY: number;

  // for (let y = 0; y < element.length; y++) {
  //   for (let x = 0; x < element[y].length; x++) {
  //     relX = x + elementCoords[0];
  //     relY = y + elementCoords[1];
  //     // console.log("elm value in this point(" + x + "." + y + "): " + element[y][x])
  //     // console.log("relX: " + relX + " / relY: " + relY);
  //     if (staticMatrix[relY] != undefined && staticMatrix[relY][relX] != undefined) {
  //       newFieldMatrix[relY][relX] = element[y][x];
  //       // console.log('this point EXISTS and VALUE is:' + staticMatrix[relY][relX])
  //       if (staticMatrix[relY][relX] == 1 && element[y][x] == 1) {
  //         if (elementCoords[1] > prevElementCoords[1]) {
  //           isCollision = true;
  //         } else {
  //           isPossiblePosition = false;
  //         }
  //         // console.log('if im here')
  //         break;
  //       }
  //     } else {
  //       // console.log('...point out of the field ...lets check...');
  //       if (element[y][x] == 1) {
  //         isPossiblePosition = false;
  //         break;
  //       }
  //     }
  //     console.log('--------------------')
  //   }
  //   if (isCollision || !isPossiblePosition) break;
  // }

  // if (!isPossiblePosition) {
  //   return { matrix: fieldMatrix, gameState: gameStateEnum['movement'] }
  // } else if (isCollision) {
  //   return { matrix: fieldMatrix, gameState: gameStateEnum['collision'] }
  // } else {
  //   console.log(newFieldMatrix);
  //   return { matrix: newFieldMatrix, gameState: gameStateEnum['movement'] }
  // }

  return { matrix: [...staticMatrix], gameState: gameStateEnum['movement'] }
}