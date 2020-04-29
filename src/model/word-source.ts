export interface WordSource{
  word: string;
  source: string;
}

export class WordSourceImpl implements WordSource {
  word: string = '';
  source: string = '';
}
