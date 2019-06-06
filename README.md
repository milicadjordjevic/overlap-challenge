# Solution for Ankh-Morpork Unified User Systeme Challenge

## General
My primary focus was to structure project appropriately - to have clean, modular, documented code with at least few tests, dockerfile and to implement most of features in the given timeframe.

### Technology stack:
* Node.js (v10.16.0) with express
* handlebars (docs: https://www.npmjs.com/package/hbs)
* lodash (docs: https://www.npmjs.com/package/lodash)
* jest (docs: https://www.npmjs.com/package/jest)
* Chart.js (https://www.chartjs.org/docs/latest/) 
* Materialize css (https://materializecss.com/getting-started.html)

Considering all the requirements, I decided to use Node.js server with one endpoint ("/report") just to get the needed HTML report with the overlapping analytics. This choice is made because Node.js is light, fast, has a big ecosystem of packages that are well documented.

* Reading files
It's done dinamically by reading all files in the provided folder path, and to speed things up, it's done in parallel. I also considered a case if these files were big, that would require some different approach by running some background job that would generate this report and store it somewhere. 

* Overlapping
Criteria for overlapping between networks is that users have the same email.
I found lodash function "intersectionBy" to be very useful for this purpose.

* View template
I decided to use handlebars package because it's convenient for quickly and easy templating view that needs to be rendered.

* Charts
Chart.js script and css are used on client side for displaying pie charts.

* Tests
Only several tests have been written to demonstrate how this should be applied for all functionalities.
"Jest" package seemed adequate because of lots of options for testing that are offered.

## Usage

* Run project with command:
`npm run start`
* Run tests with command:
`npm run test`
* Build docker image
`docker build -t <your username>/node-web-app .`
* Run Docker conainer
`docker run -p 3040:3000 -d <your username>/node-web-app`

## What's left

* displaying of top 10 most frequent zip codes in the HTML report
(Processing of that top10 list is done, but it's not included in the HTML report.)
* more tests to cover all

## Room for improvement

* adding a support for more charts types
* adding a support for getting analytics for more than 2 networks
* adding a support for different user formats
* polish report to look better and have more functionalities
* configure environment variables (like server port)
* adding a linter
