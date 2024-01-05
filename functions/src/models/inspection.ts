interface Infraction {
    details: string,
    severity: string
}

interface Inspection {
    date: string,
    status: string,
    infractions: Infraction[]
}

export default Inspection;
