import { Appliance } from './appliance'; // Asegúrate de que la clase Appliance esté correctamente definida e importada

class Day {
  date: Date;
  consumption: Map<Appliance, number>;

  constructor(date: Date) {
    this.date = date;
    this.consumption = new Map<Appliance, number>();
  }

  // Método para agregar o actualizar el consumo de un aparato
  addConsumption(appliance: Appliance, consumption: number): void {
    const currentConsumption = this.consumption.get(appliance) || 0;
    this.consumption.set(appliance, currentConsumption + consumption);
  }

  // Método para obtener el consumo total del día
  getTotalConsumption(): number {
    let total = 0;
    this.consumption.forEach((consumption) => {
      total += consumption;
    });
    return total;
  }

  // Método para obtener el consumo de un aparato específico
  getConsumption(appliance: Appliance): number {
    return this.consumption.get(appliance) || 0;
  }
}

export default Day;
