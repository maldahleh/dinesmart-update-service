import Coords from "../../models/coords";
import Inspection from "../../models/inspection";

interface DbLocation {
    name: string,
    type: string,
    address: string,
    coords: Coords,
    inspections: Inspection[]
}

export default DbLocation;
