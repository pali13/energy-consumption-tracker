import { Appliance } from "../class/appliance";

export const calculateConsumption = (
  appliance: Appliance,
  currentTime: Date,
  peakStart: number,
  peakEnd: number,
  type: string
): { peakUsage: number, offPeakUsage: number, midPeakUsage: number } => {
  if (!appliance.lastToggleTime || !appliance.status) {
    return { peakUsage: 0, offPeakUsage:0, midPeakUsage:0 };
  }

  let peakUsage = 0;
  let offPeakUsage = 0;
  let midPeakUsage = 0;
  // let periods = [];
  const lastToggleTime = appliance.lastToggleTime;

  const lastHour = lastToggleTime.getHours();
  const currentHour = currentTime.getHours();

  // Caso en el que el aparato estuvo encendido durante múltiples períodos
  if (type == "SIMPLE") {
    // Cálculo para tarifa estándar (sin horarios pico)
    const timeElapsed =
      (currentTime.getTime() - lastToggleTime.getTime()) / 1000 / 3600;
    peakUsage = timeElapsed * appliance.powerRating;
    // periods.push("standard");
  } else if (type == "DOUBLE_HOURLY") {
    if (lastHour < peakStart && currentHour >= peakStart) {
      // Consumo en off-peak (antes del peak)
      const offPeakDuration =
        (new Date(currentTime).setHours(peakStart, 0, 0, 0) -
          lastToggleTime.getTime()) /
        1000 /
        3600;
      offPeakUsage += offPeakDuration * appliance.powerRating;
      // periods.push("offPeak");

      // Consumo en peak (después del peak)
      const peakDuration =
        (currentTime.getTime() -
          new Date(currentTime).setHours(peakStart, 0, 0, 0)) /
        1000 /
        3600;
      peakUsage += peakDuration * appliance.powerRating;
      // periods.push("peak");
    } else if (currentHour >= peakStart && currentHour < peakEnd) {
      // Consumo sólo en peak
      const peakDuration =
        (currentTime.getTime() - lastToggleTime.getTime()) / 1000 / 3600;
      peakUsage = peakDuration * appliance.powerRating;
      // periods.push("peak");
    } else if (
      currentHour >= peakEnd ||
      lastHour >= peakEnd ||
      (lastHour < peakStart && currentHour < peakStart)
    ) {
      // Consumo sólo en off-peak
      const offPeakDuration =
        (currentTime.getTime() - lastToggleTime.getTime()) / 1000 / 3600;
      offPeakUsage = offPeakDuration * appliance.powerRating;
      // periods.push("offPeak");
    }
  } else if (type == "TRIPLE_HOURLY") {
    // Cálculo para tarifa triple
    if (lastHour < peakStart && currentHour >= peakEnd) {
      offPeakUsage = (peakStart - lastHour) * appliance.powerRating;
      peakUsage = (currentHour - peakEnd) * appliance.powerRating;
      // totalConsumption = offPeakConsumption + peakConsumption;
      // periods.push("off-peak", "peak");
    } else if (lastHour >= peakStart && currentHour < peakEnd) {
      peakUsage = (currentHour - lastHour) * appliance.powerRating;
      // totalConsumption = peakConsumption;
      // periods.push("peak");
    } else if (lastHour >= 0 && lastHour < 7) {
      midPeakUsage = (7 - lastHour) * appliance.powerRating;
      // totalConsumption = midPeakConsumption;
      // periods.push("mid-peak");
    }
  }
  
  return { peakUsage, offPeakUsage, midPeakUsage };
};
