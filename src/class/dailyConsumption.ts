import { Appliance } from "./appliance";

export class DailyConsumption {
  id?: number;
  date: string;
  consumption: number;
  // userId: number;
  appliance: Appliance;
  peakUsage: number;
  midPeakUsage: number;
  offPeakUsage: number;

  constructor(
    date: string,
    consumption: number,
    // userId: number,
    applianceId: Appliance,
    peakUsage: number,
    midPeakUsage: number,
    offPeakUsage: number
  ) {
    this.date = date;
    this.consumption = consumption;
    // this.userId = userId;
    this.appliance = applianceId;
    this.peakUsage = peakUsage
    this.midPeakUsage = midPeakUsage
    this.offPeakUsage = offPeakUsage
  }
}
