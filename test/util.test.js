const util = require('../src/util');

// data to be used for tests
const commonUsers = [{
    "name": "Donald Hebert",
    "email": "frederickphillips@gmail.com"
}, {
    "name": "Michael Hebert",
    "email": "michael@gmail.com"
}];

const set1 = [ ...commonUsers, {
    "name": "Michael Peterson",
    "email": "fshort@gmail.com"
}];

const set2 = [ ...commonUsers, {
    "name": "Morgan Freeman",
    "email": "morgan@gmail.com"
}, {
    "name": "Joe Johanson",
    "email": "joe@gmail.com"
}];

const codes = {
    111: 5,
    222: 10,
    333: 80
};

test('Should find overlap between two sets', () => {
    const intersection = util.getOverlapByEmail(set1, set2);
    expect(intersection).toHaveLength(commonUsers.length);
    expect(intersection).toEqual(expect.arrayContaining(commonUsers));
});

test('Should return analytics for 2 networks', () => {
    const index = 1;
    network1 = { users: set1, name: 'network1' };
    network2 = { users: set2, name: 'network2' };
    const analytic = util.getOverlapAnalytic(network1, network2, index);

    expect(analytic).toEqual(expect.objectContaining({
        id: expect.any(String),
        chart_id: expect.any(String),
        name: expect.any(String),
        percent: expect.any(Number),
        total: expect.any(Number),
        overlap: expect.any(Number),
        users: expect.any(Array)
    }));
});

test('Should fail loading data from nonexistent folder', async () => {
    try {
        await util.loadNetworks('/non');
    } catch(error) {
        expect(error.code).toEqual('ENOENT');
    }
});

test('Should increment count for zip code', () => {
    util.addZipCode(codes, '333');

    expect(codes['333']).toBe(81);
});

test('Should add new zip code', () => {
    util.addZipCode(codes, '444');

    expect(codes['444']).toBe(1);
});

