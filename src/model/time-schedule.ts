export interface TimeSchedule{
  userNum: string;
  targetDate: string;
  targetTime: string;
  timeSchedule: string;
  timeResult: string;
  timePoint: string;
}

export class TimeScheduleImpl implements TimeSchedule{
  userNum: string = '';
  targetDate: string = '';
  targetTime: string = '';
  timeSchedule: string = '';
  timeResult: string = '';
  timePoint: string = '';
}
