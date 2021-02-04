import Coords from "./coords";
import Inspection from "./inspection";

export default interface Location {
    name: string,
    type: string,
    address: string,
    coords: Coords,
    inspectionMap: Record<string, Inspection>,
    inspections: Inspection[]
}