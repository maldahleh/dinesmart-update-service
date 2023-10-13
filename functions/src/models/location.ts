import Inspection from "./inspection";

interface Coords {
    lat: string,
    lon: string
}

export default interface Location {
    name: string,
    type: string,
    address: string,
    coords: Coords,
    inspectionMap: Record<string, Inspection>,
    inspections: Inspection[]
}
