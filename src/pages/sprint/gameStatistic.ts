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

export default sprintStatistics;
