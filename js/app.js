
// Initialize empty object
const charityApp = {};

// Hacker You proxy URL
charityApp.proxyUrl = `https://proxy.hackeryou.com`;

// Charity Categories API base URL
charityApp.charityCategoriesBaseUrl = `https://data.orghunter.com/v1/categories`;

// Charity Search API base URL
charityApp.charitySearchBaseUrl = `https://data.orghunter.com/v1/charitysearch`;

// Charity API Key
charityApp.ApiKey = "de600b98a1ce36fe4ae72e0a3ad9e111";

// API Response Row Limit
charityApp.rowLimit = 8;

// Charity Item
const charityClass = $(".charityItem");

// Function which 
charityApp.selectCharity = () => { 
    
    $("#categorySelect").on("change", function () {

        // event.preventDefault();

        charityApp.selectValue = $("select").val();

        // console.log(charityApp.selectValue);    
        // charityApp.charitySearchTerm = searchTermValue;
        // console.time("random name of timer here");
        // console.time("Time this");
        charityApp.getCharityProperties(charityApp.selectValue);

        // console.timeEnd("random name of timer here");
        $(".charityResults").empty(); // Empty <section> before we search again

    });
}

// Charity Search API call
// Returns a long list of available properties
// One of the params I am using to filter the charities is the Charity category from the categories API call
charityApp.getCharityProperties = (charityCategorySelection) => {
    
    // jQuey AJAX method
    // AJAX returns a promise, that's why we can chain on methods after the AJAX

    const charityPropertiesPromise = $.ajax({
        url: `${charityApp.proxyUrl}`,
       // url: `${charityApp.charitySearchBaseUrl}`,
        method: `GET`,
        dataType: `json`,
        data: {
           reqUrl: `${charityApp.charitySearchBaseUrl}`,
           params: {
                user_key: `${charityApp.ApiKey}`,
                eligible: 1, // This only returns organizations that are tax deductible and in good standing with the IRS
                category: charityCategorySelection, // Category from categories API Call and user selection
                rows: 8 // pagination
                // ein: `590774235`
           } // params
        } // data
    }).then(function(charityPropertiesData) {

        const charityPropertiesArray = charityPropertiesData.data;

        // console.log(charityPropertiesArray);

        let result = charityPropertiesArray.filter(obj => {
            
            // return obj.missionStatement !== "" && obj.acceptingDonations === 1;
            return obj.acceptingDonations === 1;
            
        });

        result.forEach(function(charityItem) {

            // charityItem.charityName.toLowerCase()
            // GOAL: Do not display mission statement if it's empty

            let missionStatement = ``;

            if (charityItem.missionStatement !== "") {
                missionStatement = `
                <small>Mission:</small>
                <p class="missionStatement">${charityItem.missionStatement}</p>`;
            }            

            const charityProps = $(".charityResults").append(`
                <div class="charityItem">
                    <small>Charity:</small>
                    <h3 class="charityName">${charityItem.charityName.toLowerCase()}</h3>
                    <h4 class="charityCategory">${charityItem.category}</h4>
                    <h5 class="charityLocation">Location: <span>${charityItem.city.toLowerCase()}, ${charityItem.state.toLowerCase()}</span></h5>
                        ${missionStatement}
                    <a class="donateButton" href='${charityItem.donationUrl}' title="Donate to ${charityItem.charityName}">Donate Now</a>
                </div>
            `).delay(50);

            $(".charityItem").each(function(fadeInCharityItem) {
                $(this).delay(fadeInCharityItem * 50).fadeIn(500);
            });
        }); // end forEach()
              
        // console.timeEnd("Time this"); 
        
        // setTimeout(function() {
        //     $("#loadMore").removeClass("hide").addClass("show");
        // }, 700);

        // $("#loadMore").on("click", function() {

            // event.preventDefault();

            // charityApp.selectValue = $("select").val();

            // console.log(charityApp.selectValue);

            // charityApp.loadMoreCharities(charityApp.selectValue);
            // for (let i = 0; i < $(".charityItem").length; i++) {
            //     console.log($(".charityItem").length);
            // }
            // if ()


        // });        
    }).catch(function(error) {
        console.log(error);
    });

}

// Charity Categories API Call
// Returns a list of available categories as description strings
charityApp.getCharityCategories = () => {

    // API call returns the charity categories
    const charityCategoriesPromise = $.ajax({
        url: `${charityApp.proxyUrl}`,
        method: `GET`,
        dataType: `json`,
        data: {
           reqUrl: `${charityApp.charityCategoriesBaseUrl}`,
           params: {
                user_key: `${charityApp.ApiKey}`
           } // params
        } // data
    }).then(function(charityCategoriesData) {

        // Categories array variable
        const charityCategoriesArray = charityCategoriesData.data;

        // 
        const filteredCharityCategoriesArray = charityCategoriesArray.slice(1, 26);


        filteredCharityCategoriesArray.forEach(function(charityItem) {

            const charityCategoriesDropdown = $("#categorySelect").append(`
                <option value="${charityItem.categoryId}">${charityItem.categoryDesc}</option>
            `);

        });

    }).catch(function(error) {
        console.log(error);
    });

} 

// Init method
charityApp.init = () => {

    charityApp.getCharityCategories();
    charityApp.selectCharity();
    // charityApp.pagination();
}

$(function () {

    charityApp.init();

// charityApp.pagination = () => {

    // $("#loadMore").on("click", function() {

    //     // event.preventDefault();

    //     charityApp.selectValue = $("select").val();

    //     console.log(charityApp.selectValue);

    //     charityApp.loadMoreCharities(charityApp.selectValue);

    // });
// }
fitty('h1');

});