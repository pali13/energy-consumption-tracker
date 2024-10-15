import { Tariff } from "../class/tariff";
import { TariffRequest } from "../class/tariffRequest";
import API_URL from "../config/config";

const URL = API_URL + "/api/users/";

export const TariffService = {

  async getAll(id: number): Promise<Tariff> {
    const request = URL + id + "/tariff";
    const response = await fetch(request);
    return await response.json();
  },

  async assignTariff(id: number, tariff: TariffRequest): Promise<TariffRequest>{
    const request = URL + id + "/tariff/changeTariff";
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tariff),
    });
    return await response.json();
  }
};
