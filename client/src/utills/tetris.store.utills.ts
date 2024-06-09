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
  return matrix;
}

export function renderFieldMatrix (staticMatrix: number[][], fieldMatrix: number[][], elementId: number, prevElementCoords: number[], elementCoords: number[], elementSpin: number ): { matrix: number[][], gameState: gameStateEnum, returnPrevCoords: boolean, returnPrevSpin: boolean, isGameOver?: boolean } {
  const element = allElements[elementId][elementSpin];
  let isPossiblePosition = true;
  let isPossibleRotation = true;
  let isCollision = false;
  let isGameOver = false;
  const newFieldMatrix = JSON.parse(JSON.stringify(staticMatrix));
  let relX: number, relY: number;

  // Cycle to check each point of element and corresponding field part:
  for (let y = 0; y < element.length; y++) {
    for (let x = 0; x < element[y].length; x++) {
      // Get relative coordinates of corresponding field part:
      relX = x + elementCoords[0];
      relY = y + elementCoords[1];
      // If current checking coords is inside our field:
      if (staticMatrix[relY] != undefined && staticMatrix[relY][relX] != undefined) {
        // Add corresponding element point information to the field if this point exists:
        newFieldMatrix[relY][relX] = element[y][x] == 1 ? element[y][x] : staticMatrix[relY][relX];
        // If point of field and point of element are at the same positions:
        if (staticMatrix[relY][relX] == 1 && element[y][x] == 1) {
          // Element is after birth:
          if (elementCoords[1] === prevElementCoords[1] && elementCoords[1] === 0) {
            isGameOver = true;
          // If element is after rotation:
          } else if (elementCoords[0] === prevElementCoords[0] && elementCoords[1] === prevElementCoords[1]) {
            isPossibleRotation = false;
          // If element went from top (falling down) set event as collision:
          } else if (elementCoords[1] > prevElementCoords[1]) {
            isCollision = true;
          // In other cases (element went from left or right) it's not a possible position:
          } else {
            isPossiblePosition = false;
          }
          break;
        }
      // If current checking coords is outside of the field:
      } else {
        // If element is after rotation:
        if (elementCoords[0] == prevElementCoords[0] && elementCoords[1] == prevElementCoords[1]) {
          isPossibleRotation = false;
        // If this coords are under the bottom part of field (by axis y) and element went from top (falling) set event as collision:  
        } else if (element[y][x] == 1 && staticMatrix[relY] == undefined && elementCoords[1] > prevElementCoords[1]) {
          isCollision = true;
          break;
        // In other case if element went from left or right and current point of element exists mark it as impossible position (and return coords to previous step by axis x):
        } else if (element[y][x] == 1 && (elementCoords[1] == prevElementCoords[1] || elementCoords[1] < prevElementCoords[1])) {
          isPossiblePosition = false;
          break;
        }
      }
    }
    if (isCollision || !isPossiblePosition || !isPossibleRotation || isGameOver) break;
  }

  if (isGameOver) {
    console.log('GAME OVER');
    return { matrix: newFieldMatrix, gameState: gameStateEnum.nothing, returnPrevCoords: false, returnPrevSpin: false, isGameOver }
  } else if (!isPossiblePosition) {
    console.log('NOT POSSIBLE POSITION');
    return { matrix: fieldMatrix, gameState: gameStateEnum.movement, returnPrevCoords: true, returnPrevSpin: false }
  } else if (!isPossibleRotation) {
    console.log('NOT POSSIBLE ROTATION');
    return { matrix: fieldMatrix, gameState: gameStateEnum.movement, returnPrevCoords: true, returnPrevSpin: true }
  } else if (isCollision) {
    console.log('IS COLLISION');
    return { matrix: fieldMatrix, gameState: gameStateEnum.collision, returnPrevCoords: false, returnPrevSpin: false }
  } else {
    console.log('CONTINUE MOVEMENT');
    return { matrix: newFieldMatrix, gameState: gameStateEnum.movement, returnPrevCoords: false, returnPrevSpin: false }
  }
}