export interface HistoryData{
  word: string;
  history: string[];
}

export class HistoryDataImpl implements HistoryData {
  word: string = '';
  history: string[] = [];
}
