export class TariffRequest{
    tariffId: number;
    peakStartTime: string;
    peakEndTime: string;

    constructor(tariffId: number, peakStartTime: string, peakEndTime: string){
        this.tariffId = tariffId;
        this.peakStartTime = peakStartTime;
        this.peakEndTime = peakEndTime;
    }
}