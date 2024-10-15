import { Appliance } from "../class/appliance";
import { Tariff } from "../class/tariff";
import { Theory } from "../class/theory";
import { ApplianceService } from "../services/ApplianceService";
import { TariffService } from "../services/TariffService";
import { TheoryService } from "../services/TheoryService";


export const getAppliances = async (userId: number): Promise<Appliance[]> => {
  try {
    const appliances = await ApplianceService.getAll(userId)
    return appliances;
  } catch (error) {
    console.error("Error al obtener los aparatos:", error);
    return [];
  }
};

export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTariff = async (userId: number): Promise<Tariff> => {
  try {
    const tariff = await TariffService.getAll(userId)
    return tariff;
  } catch (error) {
    console.error("Error al obtener la tarifa:", error);
    throw new Error("error");
  }
}

export const getTheory = async (id: number): Promise<Theory | null> => {
  try {
    const theory = await TheoryService.getTheory(id)
    return theory;
  } catch (error) {
    console.error("Error al obtener la teoría:", error);
    throw new Error("error");
  }
}