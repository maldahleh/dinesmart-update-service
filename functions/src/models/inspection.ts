import Infraction from "./infraction";

interface Inspection {
    date: string,
    status: string,
    infractions: Infraction[]
}

export default Inspection;
