// import Api from "../../api/api";

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
//   const words = await api.getUserAggregatedWords('6209b65e901fe6344a03002a', '1', '0', '200', {
//     $or: [{ 'userWord.optional.learned': true }],
//   });
//   console.log(words);
// }

// test();

export default sprintStatistics;
