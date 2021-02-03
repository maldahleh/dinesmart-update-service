const admZip = require('adm-zip');
const bent = require('bent');

const getBody = async (url: string) => {
    return await bent(url);
}

export default (url: string, completion) => {
    const body = getBody(url)
        .then(body => {
            const zip = new admZip(body);
            const file = zip.getEntries().find(entry => entry.entryName.toLowerCase().endsWith('.xml'));
            if (!file) {
                completion(null);
                return;
            }

            completion(zip.readAsText(file, 'utf-8'));
        })
        .catch(err => {
            completion(null);
        });
}