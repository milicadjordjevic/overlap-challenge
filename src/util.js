const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');

// indended for reading stream from file with given filePath
// processing goes line by line, parsing it as JSON object and adding it to the result array
const processLineByLine = (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const stream = fs.createReadStream(filePath);
            stream.on('error', (error)=> {
                reject(error);
            });
            
            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });

            const resArray = [];
            rl.on('line', (line) => {
                resArray.push(JSON.parse(line));
            }).on('close', () => {
                resolve(resArray);
            }).on('error', (err) => {
                reject(err);
            });;
        } catch (err) {
            reject(err);
        }
    });
}

// load user data from files in provided folderPath directory (mocks folder)
// loading all files is done in parallel
const loadNetworks = async (folderPath) => {
    const loadUserPromises = [];
    const networks = [];

    fs.readdirSync(folderPath).forEach(fileName => {
        const loadUsersPromise = processLineByLine(folderPath + fileName);
        loadUserPromises.push(loadUsersPromise);
        networks.push({ name: fileName });
    });

    const values = await Promise.all(loadUserPromises);
    for(i=0; i<values.length; i++) {
        networks[i].users = values[i];
        networks[i].total = values[i].length;
    }

    return networks;
}

/* returns overlap data for provided networks:
   percent, number of overlapping users, name for chart, total number of users...
   id and chart_id are needed for handeling charts on client side */
const getOverlapAnalytic = (network1, network2, index) => {
    const overlap = getOverlapByEmail(network1.users, network2.users);
    const total = network1.total + network2.total;
    const percent = parseFloat((overlap.length/total * 100).toFixed(2));

    const name = ` ${getCleanName(network1.name)} and ${getCleanName(network2.name)}`

    return {
        id: `card_${index}`,
        chart_id: `chart_${index}`,
        name,
        percent,
        total,
        overlap: overlap.length,
        users: overlap
    }
}

// returns users from 2 sets that have the same email
const getOverlapByEmail = (set1, set2) => {
    const overlap = _.intersectionBy(set1, set2, 'email');

    return overlap;
}

// returns cleaned name from filename in format "file_name.jsonl"
// remove extension, replace all underscore chars with spaces, uppercase capital letter
const getCleanName = (networkName) => {
    networkName = networkName.replace(/\.[^/.]+$/, "");
    networkName = networkName.replace("_", " ");
    networkName = networkName.charAt(0).toUpperCase() + networkName.slice(1);
    return networkName;
}

/* returns the list with 10 most frequent zip codes in descending order
   goes through all networks and each user of a network and create a list of codes with number of occurances
   resulting list is converted to array, ordered descending and truncated to first 10 elements */
const getTop10ZipCodes = (networks) => {
    let codes = {};
    networks.forEach((network) => {
        network.users.forEach((user) => {
            let zip;
            if(user.postcode) {
                zip = user.postcode;
            } else {
                if(user.address && user.address.zip) {
                    zip = user.address.zip;
                }
            }
            if(zip) {
                addZipCode(codes, zip);
            }
        });
    });

    let codesArray = Object.keys(codes).map(key => { return { code: key, count: codes[key]} });
    codesArray = _.orderBy(codesArray, ['count'], ['desc']);

    return codesArray.slice(0, 10);
}

 // if zip code exists in provided list then increment its number
 // else add new entry for that zip code with count 1
const addZipCode = (codes, zip) => {
    if(codes[zip]) {
        codes[zip] += 1;
    } else {
        codes[zip] = 1;
    }
}

module.exports = {
    getOverlapAnalytic,
    loadNetworks,
    getOverlapByEmail,
    getTop10ZipCodes,
    addZipCode
}