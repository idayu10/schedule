export interface Suggest{
  suggest: string;
  count: string;
}

export class SuggestImpl implements Suggest{
  suggest: string = '';
  count: string = '';
}
