const cheerio = require('cheerio');
const turndown = require('turndown');

const turndownService = new turndown();

const scrape = function(html, srcUrl) {
    const $ = cheerio.load(html);

        let jobDetails = [];
        $('section[aria-labelledby="jobInfoHeader"] dl dt,section[aria-labelledby="jobInfoHeader"] dl dd')
            .each(function(i,el){
                jobDetails[i] = $(el).text();
            })
        jobDetails = jobDetails.reduce((cumm,curr,i,src) => {
                if(i%2 == 0) {
                    cumm[curr] = src[i+1]
                }
                return cumm
            },{});

        // if(jobDetails.Location) {
        //     jobDetails.locationDetails = await fetch(`https://nominatim.openstreetmap.org/search/${jobDetails.Location}?format=json&addressdetails=1&limit=1`).then(res=>res.json());
        // }
        
        jobDetails.title = $('span[data-automation="job-detail-title"]').first().text();
        
        jobDetails.company = {
            name: $('span[data-automation="advertiser-name"]').text(),
            address: jobDetails.Location || ''
        }
        if(jobDetails.company.name == "") {       
            jobDetails.company.name = $('span[data-automation="job-header-company-review-title"]').text();
        }

        let logo = $('div[data-automation="brandingLogo"]')
        try {
            let backgroundImgCss = logo && logo.css('background-image')
            if (backgroundImgCss) {
                let reg = new RegExp(/url\((.*)\)/)
                jobDetails.company.logoURL = reg.exec(logo.css('background-image'))[1]
            }

        } catch {
            
        }

        let descriptionHTML =
            $('div[data-automation="jobDescription"] .job-template__wrapper .templatetext').html()
            ||
            $('div[data-automation="jobDescription"]').html();

        jobDetails.description = turndownService.remove('style').turndown(descriptionHTML);
        console.log(jobDetails);

        jobDetails.renumeration = {
            min: 0,
            max: 0,
            quoted: 0
        }

        let reg = new RegExp(/\$(([\d\.,])*)(\w?) ?-? ?\$([\d,\.]*)(\w?)/gm);

        if(jobDetails["Salary"]){
            jobDetails["Salary"] = jobDetails["Salary"].replace(/\d(K)/gm,"000").replace(',','');
    
            matchArray = reg.exec(jobDetails["Salary"]);
            jobDetails.renumeration = {
                min: parseInt(matchArray[1]),
                max: parseInt(matchArray[4]),
                quoted: 0
            }
        }

        jobDetails.listingDate = jobDetails["Job Listing Date"];
        delete jobDetails["Job Listing Date"];

        jobDetails.type = jobDetails["Work Type"] || "Full Time";
        delete jobDetails["Work Type"];

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