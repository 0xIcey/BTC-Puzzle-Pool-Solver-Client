import { ChildProcess, exec } from "child_process";
import { existsSync } from "fs";
import Yargs from "yargs";
import Puzzle from "../types/Puzzles";
import { getBitcrackInput, getPuzzle } from "./getInputs";
import { getPuzzleByIndex } from "./util";

const argv = Yargs(process.argv.slice(2))
  .usage("Usage: node release/$0.js [options]")

  .example(
    "node release/$0.js -t 32 -b 32 -p 32 --puzzle 66",
    "Starts working on puzzle 66 with the given settings without asking again."
  )

  .alias("t", "threads")
  .number("t")
  .describe("t", "amount of threads to be used by BitCrack")

  .alias("b", "blocks")
  .number("b")
  .describe("b", "amount of threads to be used by BitCrack")

  .alias("p", "points")
  .number("p")
  .describe("p", "amount of points to be used by BitCrack")

  .alias("path", "BitCrack_Path")
  .string("path")
  .describe("path", "Path override for BitCrack Folder")
  .default("path", "./BitCrack")

  .number("puzzle")
  .describe("puzzle", "define the puzzle that should be solved")

  .help("h")
  .alias("h", "help")
  .epilog("(C) bitcoin-puzzle.com 2022").argv;

async function main() {
    //@ts-ignore This will be needed at every argv param because of typescripts type declarations
    let puzzleToSolve: Puzzle | number = (typeof argv.puzzle == 'number') ? argv.puzzle : (await getPuzzle());
  if (typeof puzzleToSolve == "number") {
    const index = puzzleToSolve;
    puzzleToSolve = getPuzzleByIndex(puzzleToSolve);
    if (puzzleToSolve?.privateKey) {
      console.error(
        `Puzzle ${index} is already solved. Private key is ${puzzleToSolve.privateKey}. Exiting..`
      );
      process.exit(0);
    }
    if (!puzzleToSolve) {
      console.error(`Puzzle ${index} does not exist. Exiting..`);
      process.exit(0);
    }
  }

  //@ts-ignore
  const THREADS = argv.t || (await getBitcrackInput("threads"));
  //@ts-ignore
  const BLOCKS = argv.b || (await getBitcrackInput("blocks"));
  //@ts-ignore
  const POINTS = argv.p || (await getBitcrackInput("points"));
  //@ts-ignore
  const BITCRACK_PATH = argv.path || "./BitCrack";

  //God forgive me for this
  let cuOrCl = "";
  if (existsSync(`${BITCRACK_PATH}/cuBitCrack.exe`)) {
    cuOrCl = "cu";
  } else if (existsSync(`${BITCRACK_PATH}/clBitCrack.exe`)) {
    cuOrCl = "cl";
  }

  const bitCrackProcess: ChildProcess = exec(
    `"${BITCRACK_PATH}/${cuOrCl}BitCrack.exe" -t ${THREADS} -b ${BLOCKS} -p ${POINTS} --keyspace ${puzzleToSolve.keyRange} ${puzzleToSolve.address}`,
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );

  bitCrackProcess.stdout!.setEncoding("utf8");
  bitCrackProcess.stdout!.on("data", function (data) {
    console.log("stdout: " + data);
  });

  bitCrackProcess.stderr!.setEncoding("utf8");
  bitCrackProcess.stderr!.on("data", function (data) {
    console.log("stderr: " + data);
  });

  bitCrackProcess.on("close", function (code) {
    console.log("closing code: " + code);
  });
}

main();
