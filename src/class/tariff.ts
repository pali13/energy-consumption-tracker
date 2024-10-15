export class Tariff{
    id: number
    peakStartTime: string
    peakEndTime: string
    midPeakStartTime: string
    midPeakEndTime: string
    tariffId: number
    type: string
    userId: number

    constructor(
        id: number,
        peakStartTime: string,
        peakEndTime: string,
        midPeakStartTime: string,
        midPeakEndTime: string,
        tariffId: number,
        type: string,
        userId: number
    ){
        this.id = id
        this.peakStartTime = peakStartTime
        this.peakEndTime = peakEndTime
        this.midPeakStartTime = midPeakStartTime
        this.midPeakEndTime = midPeakEndTime
        this.tariffId = tariffId
        this.type = type
        this.userId = userId
    }

    getPeakStartTime(): string {
        return this.peakStartTime;
    }

    getPeakEndTime(): string {
        return this.peakEndTime;
    }

    getTariffId(): number{
        return this.tariffId;
    }
}