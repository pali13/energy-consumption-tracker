// const API_URL = 'http://192.168.1.27:8080'; // Reemplaza con la URL de tu backend
// export default ;

import Constants from "expo-constants";
import devEnv from "../environments/environment";
import prodEnv from "../environments/environment.prod";

// const ENV = Constants.manifest?.releaseChannel === "production" ? prodEnv : devEnv;
const ENV = "https://energy-consumption-tracker.onrender.com:8080";

export default ENV;