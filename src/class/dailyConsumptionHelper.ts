import { getAppliances, getTodayDate } from "../helpers/helpers";
import { saveConsumption } from "../services/DailyConsumptionService";
import { Appliance } from "./appliance";
import { DailyConsumption } from "./dailyConsumption";

export const registerDailyConsumption = async (userId: number | null) => {
  if (!userId) {
    console.error("User ID is null. Cannot register daily consumption.");
    return;
  }
  const appliances: Appliance[] = await getAppliances(userId);

  const date = getTodayDate();

  for (const appliance of appliances) {
    const dailyConsumption: DailyConsumption = {
      date: date,
      appliance: appliance,
      consumption: appliance.dailyUsage || 0,
      peakUsage: appliance.peakUsage ? appliance.peakUsage : 0,
      midPeakUsage: appliance.midPeakUsage ? appliance.midPeakUsage : 0,
      offPeakUsage: appliance.offPeakUsage ? appliance.offPeakUsage : 0,
    };

    try {
      await saveConsumption(userId, dailyConsumption);
    } catch (error) {
      console.error(
        `Error al guardar el consumo diario para el aparato ${appliance.name}:`,
        error
      );
    }
  }
};
