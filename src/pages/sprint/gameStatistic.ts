interface IGameStatistics {
  newWords: Set<string>;
  correct: Map<string, number>;
  wrong: Map<string, number>;
  bestSeries: number;
}
const sprintStatistics: IGameStatistics = {
  newWords: new Set([]),
  correct: new Map([]),
  wrong: new Map([]),
  bestSeries: 0,
};

// const api = new Api();
// async function test() {
//   const words = await api.getAggregatedWords('62028e28ec5e2e4284f15e31', '1', '0', '200', {
//     $or: [{ 'userWord.optional': null }],
//   });
//   // console.log(words);
// }
//
// test();
//
export default sprintStatistics;
