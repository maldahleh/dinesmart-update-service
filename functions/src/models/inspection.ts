interface Infraction {
    details: string,
    severity: string
}

export default interface Inspection {
    date: string,
    status: string,
    infractions: Infraction[]
}
