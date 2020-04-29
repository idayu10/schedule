export interface HistoryData{
  userNum: string;
  word: string;
  history: string[];
}

export class HistoryDataImpl implements HistoryData {
  userNum: string = '';
  word: string = '';
  history: string[] = [];
}
