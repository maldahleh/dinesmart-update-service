import Coords from "./coords";
import Inspection from "./inspection";

interface Location {
    name: string,
    type: string,
    address: string,
    coords: Coords,
    inspectionMap: Record<string, Inspection>,
    inspections: Inspection[]
}

export default Location;
