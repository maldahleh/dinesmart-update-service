import Infraction from "./infraction";

export default interface Inspection {
    date: string,
    status: string,
    infractions: Infraction[]
}