const express = require('express');
const path = require('path');

const { getOverlapAnalytic, loadNetworks, getTop10ZipCodes } = require('./util');

const viewsPath = path.join(__dirname, '../templates/views');
const publicDirectoryPath = path.join(__dirname, '../public');
const mocksFolder = './mocks/';

const app = express();

// settings for handlebars
app.set('view engine', 'hbs');
app.set('views', viewsPath)

// serving up static assets 
app.use(express.static(publicDirectoryPath))

// main route for getting the report about overlap between networks
app.get('/report', async (req, res) => {
    try{
        // load users from all networks in mocks folder
        const networks = await loadNetworks(mocksFolder);
        
        const analytics = [];
        
        // collect data about analytics for all combinations of networks and overall analytics
        const analytic01 = getOverlapAnalytic(networks[0], networks[1], 0);
        const analytic02 = getOverlapAnalytic(networks[0], networks[2], 1);
        const analytic12 = getOverlapAnalytic(networks[1], networks[2], 2);
        const analyticAll = getOverlapAnalytic(analytic01, networks[2], 3);
        analytics.push(analytic01);
        analytics.push(analytic02);
        analytics.push(analytic12);
        analytics.push(analyticAll);

        // create top 10 list with most frequent zip codes in descending order
        const top10list = getTop10ZipCodes(networks);

        // render the report with handlebar's templating
        res.render('report', {
            title: 'Report',
            analytics,
            analyticsLength: analytics.length,
            top10list
        });
    } catch(err) {
        return res.status(500).send(err);
    };
});

app.listen(3000, () => {
    console.log('Server "Ankh-Morpork" is listening on port 3000');
});