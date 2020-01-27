const cheerio = require('cheerio');
const turndown = require('turndown');
const fetch = require('node-fetch');

const turndownService = new turndown();

const scrape = async function(html, srcUrl) {
    const $ = cheerio.load(html);

        let jobDetails = {};
        
        jobDetails.title = $('.jobsearch-JobInfoHeader-title').text();
        
        jobDetails.company = {
            name: $('.jobsearch-DesktopStickyContainer-companyrating div').first().text(),
            address: $('.icl-IconFunctional--location + span').text()
        }

        if(jobDetails.company.address !== '') {
            let locationDetails = await fetch(`https://nominatim.openstreetmap.org/search/${jobDetails.company.address}?format=json&addressdetails=1&limit=1`).then(res=>res.json());
            
            if(locationDetails.length > 0) {
                jobDetails.company.location = {
                    latitude: locationDetails[0].lat,
                    longitude: locationDetails[0].lon
                }
            }

        }

        let logoEl = $('.jobsearch-CompanyAvatar-image');

        if(logoEl) {
            jobDetails.company.logoURL = logoEl.attr('src');
        }

        let descriptionHTML =
            $('#jobDescriptionText').html();

        jobDetails.description = turndownService.remove('style').turndown(descriptionHTML);
        console.log(jobDetails);

        jobDetails.renumeration = {
            min: 0,
            max: 0,
            quoted: 0
        }

        let salary = $('.icl-IconFunctional--salary + span').text();

        let reg = new RegExp(/\$(([\d\.,])*)(\w?) ?-? ?\$([\d,\.]*)(\w?)/gm);

        if(salary){
            salary = salary.replace(/\d(K)/gm,"000").replace(',','');
    
            matchArray = reg.exec(salary);
            jobDetails.renumeration = {
                min: parseInt(matchArray[1]),
                max: parseInt(matchArray[4]),
                quoted: 0
            }
        }

        jobDetails.type = "Full Time";

        // reMap({"Job Listing Date": "listingDate", "Work Type": "type"}, jobDetails)
        
        let initialProgressStage = {
            stage: "Initial Application",
            scheduledDate: Date.now(),
            doneDate: null,
            notes: ""
        }

        jobDetails.progress = [
            initialProgressStage
        ]

        let initialLink = {
            title: "Listing",
            link: srcUrl
        }

        jobDetails.links = [
            initialLink
        ]

        jobDetails.skills = [];

        jobDetails.failed = false;

    return jobDetails;
}

module.exports = {
    scrape
}