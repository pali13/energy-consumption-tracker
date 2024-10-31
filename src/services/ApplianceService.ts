import { Appliance } from "../class/appliance";
import ENV from "../config/config";

const URL = ENV + "/api/users/";

export const ApplianceService = {
  async getAll(id: number): Promise<Appliance[]> {
    const request = URL + id + "/appliances";
    const response = await fetch(request);
    return await response.json();
  },

  async create(userId: number, appliance: Appliance): Promise<Appliance> {
    appliance.status = false;
    const request = URL + userId + "/appliances";
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appliance),
    });
    return await response.json();
  },

  async getById(
    id: number,
    userId: number
  ) : Promise<Appliance> {
    const request = URL + userId + "/appliances/" + id;
    const response = await fetch(request);
    return await response.json();
  },

  async update(
    userId: number | null,
    appliance: Appliance
  ): Promise<Appliance> {
    const request = URL + userId + "/appliances/" + appliance.id;  
    const response = await fetch(request, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appliance),
    });
    return await response.json();
  },

  async delete(id: number, userId: number): Promise<void> {
    const request = URL + userId + "/appliances/" + id;
    await fetch(request, {
      method: "DELETE",
    });
  },
};
