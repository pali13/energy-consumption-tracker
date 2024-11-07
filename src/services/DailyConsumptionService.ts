import { DailyConsumption } from "../class/dailyConsumption";
import ENV from "../config/config";
import axios from "axios";

export const getTodayConsumption = async (
  userId: number,
  date: string
): Promise<DailyConsumption> => {
  const URL = `${ENV}/api/users/${userId}/consumptions`;
  const response = await axios.get(`${URL}/${date}`);
  return response.data;
};

export const saveConsumption = async (
  userId: number,
  dailyConsumption: DailyConsumption
): Promise<DailyConsumption> => {
  const URL = `${ENV}/api/users/${userId}/consumptions`;
  const response = await axios.post(`${URL}`, dailyConsumption);
  return response.data;
};

export const getConsumptionsBetweenDates = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<DailyConsumption[]> => {
  const URL = `${ENV}/api/users/${userId}/consumptions`;
  const response = await axios.get(`${URL}`, {
    params: { startDate, endDate },
  });
  return response.data;
};
