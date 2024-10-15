import { DailyConsumption } from "./dailyConsumption";

export class Appliance {
  id?: number;
  name: string;
  type: string;
  powerRating: number;
  status: boolean;
  location?: string;
  lastOnTime?: string;
  lastOffTime?: string;
  dailyUsage?: number;
  peakUsage?: number;
  midPeakUsage?: number;
  offPeakUsage?: number;
  totalUsage?: number;
  lastToggleTime?: Date | null;
  createdAt?: string;
  updatedAt?: string;
  dailyConsumptions: DailyConsumption[];

  constructor(
    name: string,
    type: string,
    powerRating: number,
    status: boolean,
    location?: string,
    lastOnTime?: string,
    lastOffTime?: string,
    dailyUsage?: number,
    peakUsage?: number,
    midPeakUsage?: number,
    offPeakUsage?: number,
    totalUsage?: number,
    lastToggleTime?: Date,
    dailyConsumptions: DailyConsumption[] = []  // Inicializa como un array vacío
  ) {
    this.name = name;
    this.type = type;
    this.powerRating = powerRating;
    this.status = status;
    this.location = location;
    this.lastOnTime = lastOnTime;
    this.lastOffTime = lastOffTime;
    this.dailyUsage = dailyUsage;
    this.peakUsage = peakUsage;
    this.midPeakUsage = midPeakUsage;
    this.offPeakUsage = offPeakUsage;
    this.totalUsage = totalUsage;
    this.lastToggleTime = lastToggleTime;
    this.dailyConsumptions = dailyConsumptions;
  }
}
