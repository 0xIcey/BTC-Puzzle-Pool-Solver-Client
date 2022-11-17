import inquirer from "inquirer";
import { BitCrackOptions } from "../types/BitCrack";
import Puzzle from "../types/Puzzles";
import { getUnsolvedPuzzlesIndex } from "./util";


export async function getPuzzle(): Promise<Puzzle>{
    const puzzles = getUnsolvedPuzzlesIndex()
    const puzzleIndexes = puzzles.map(puzzle => puzzle.puzzleIndex.toString()) as string[]
    return new Promise( async (resolve, reject) => {
        inquirer.prompt({
            message: "Please select the puzzle which you want to participate in solving (0 IS TEST)",
            type: 'list',
            choices: puzzleIndexes, 
            name: 'puzzleChoice'
        }).then( (result) => {
            resolve(puzzles.find(puzzle => puzzle.puzzleIndex == result.puzzleChoice) as Puzzle) //not very clean, but makes the return easier
        }).catch( (error) => {
            reject(error);
        })


    })
}

export async function getBitcrackInput(type: BitCrackOptions): Promise<number>{
    return new Promise( (resolve, reject) => {
        inquirer.prompt({
            message: `Please select the amount of ${type} for BitCrack`,
            type: 'list',
            choices: ['32', '64', '128', '256', '512', '1024'],
            name: 'amount'
        }).then( (result) => {
            resolve(parseInt(result.amount))
        }).catch( (error) => {
            reject(error);
        })


    })
}