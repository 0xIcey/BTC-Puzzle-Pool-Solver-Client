export default interface Puzzle{
    puzzleIndex: number,
    keyRange: string,
    privateKey: string,
    address: string,
    filteredPrivKey?: string,
    diffToPrev?: string

}