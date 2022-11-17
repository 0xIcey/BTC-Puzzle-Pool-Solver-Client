import Puzzle from "../types/Puzzles";
import { puzzles } from "./puzzles.json";

export function getUnsolvedPuzzlesIndex(): Puzzle[] {
  let unsolvedPuzzlesIndexes: (Puzzle | undefined)[] = puzzles
    .map((puzzle: Puzzle) => {

        if(!puzzle.privateKey && puzzle.puzzleIndex !== undefined)
      return puzzle;
    })
    .filter( (array) => {
        return array !== undefined;
    })

    if(unsolvedPuzzlesIndexes.length == 0){
        console.error('Could not find any unsolved puzzles. Something went wrong, exiting...');
        process.exit(1);
    }
    
    return unsolvedPuzzlesIndexes as Puzzle[];
}

export function getPuzzleByIndex(index: number): Puzzle{
    return puzzles.find( puzzle => puzzle.puzzleIndex === index) as Puzzle; //A check will be performed if it exists once it's passed back
}
