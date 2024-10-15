import { Theory } from "../class/theory";
import { TheoryRequest } from "../class/theoryRequest";
import API_URL from "../config/config";

const URL = API_URL + "/api/theory/";

export const TheoryService = {
  async getTheory(id: number): Promise<Theory | null> {
    const request = URL + id;
    const response = await fetch(request);

    // Verificar si el status es 200 (OK) antes de intentar leer el JSON
    if (response.ok) {
      const contentType = response.headers.get("content-type");

      // Verificar si el contenido es de tipo JSON antes de intentar parsearlo
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return null; // El cuerpo de la respuesta no es JSON
      }
    } else if (response.status === 404 || response.status === 204) {
      return null; // 404 Not Found o 204 No Content
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  },

  async saveTheory(id: number, text: string): Promise<TheoryRequest> {
    const request = URL + id;
    const response = await fetch(request, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),
    });
    return await response.json();
  },
};
