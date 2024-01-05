import Inspection from "./inspection";

interface Coords {
    lat: string,
    lon: string
}

interface Location {
    name: string,
    type: string,
    address: string,
    coords: Coords,
    inspectionMap: Record<string, Inspection>,
    inspections: Inspection[]
}

export default Location;
