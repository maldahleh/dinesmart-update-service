import Inspection from "./inspection";
import Coords from "./coords";

interface Location {
    name: string,
    type: string,
    address: string,
    coords: Coords,
    inspectionMap?: Record<string, Inspection>,
    inspections: Inspection[]
}

export default Location;
