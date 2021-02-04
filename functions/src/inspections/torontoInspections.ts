import { parseString } from 'xml2js';
import Location from '../models/location';
import addToStorage from '../storage/storageService';
import xmlDownloader from '../utils/xmlDownloader';

const torontoDinesafeUrl = 'http://opendata.toronto.ca/public.health/dinesafe/dinesafe.zip';

export default () => {
    xmlDownloader(torontoDinesafeUrl, (text: string | null) => {
        if (!text) {
            return;
        }

        parseString(text, (err, result) => {
            if (err) {
                return;
            }

            const inspections: Record<string, Location> = {};
            result['ROWDATA']['ROW'].forEach(res => {
                let existingData = inspections[res['ESTABLISHMENT_ID'][0]];
                if (typeof existingData === 'undefined') {
                    existingData = {
                        'name': res['ESTABLISHMENT_NAME'][0].trim(),
                        'type': res['ESTABLISHMENTTYPE'][0],
                        'address': res['ESTABLISHMENT_ADDRESS'][0].trim(),
                        'coords': {
                            'lat': res['LATITUDE'][0],
                            'lon': res['LONGITUDE'][0]
                        },
                        'inspections': {
                        }
                    };
                }

                let inspectionData = existingData['inspections'][res['INSPECTION_ID'][0]];
                if (typeof inspectionData === 'undefined') {
                    inspectionData = {
                        'date': res['INSPECTION_DATE'][0],
                        'status': res['ESTABLISHMENT_STATUS'][0],
                        'infractions': []
                    }
                }

                const infractionDetails = res['INFRACTION_DETAILS'][0];
                if (infractionDetails !== '') {
                    let severity = res['SEVERITY'][0];
                    if (severity.startsWith('NA')) {
                        severity = severity.substring(5);
                    } else {
                        severity = severity.substring(4);
                    }

                    inspectionData['infractions'].push({
                        'details': infractionDetails,
                        'severity': severity
                    });
                }

                existingData['inspections'][res['INSPECTION_ID'][0]] = inspectionData;
                inspections[res['ESTABLISHMENT_ID'][0]] = existingData;
            });

            Object.keys(inspections).forEach(inspection => {
                let inspectionArray = Object.values(inspections[inspection]['inspections']);
                inspectionArray.sort((a, b) => (b['date'] > a['date']) ? 1
                    : ((a['date'] > b['date']) ? -1 : 0));

                inspections[inspection]['inspections'] = inspectionArray;

                addToStorage(inspection, inspections[inspection]);
            });
        });
    });
};