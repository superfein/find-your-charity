/** 
 * The Charity Finder App
 * 
 * The app hooks into the orghunter.com charity APIs.
 * The categories API and the search API.
 * 
 * STRETCH GOALS & ISSUES:
 * 
 * I really wanted to create pagination as a load more button or on scroll.
 * I tried for many hours to implement some type of pagination, but couldn't
 * figure out a way to successfully count the existing, already loaded items,
 * and then to load the next round of 8 rows of data. It was relatively easy to
 * attach a click event to a button and load the same 8 items again,
 * but the counter was too hard for me. Specifically, how to get the next 8 items,
 * and update the URL in the browser to show that you are on page 2, page 3 etc.
 * 
 *  - Would love some guidance on how best to implement pagination/load more.
 * 
 * There are 2.5 million charities listed in the API. Only 30 thousand
 * of the 2.5 million have filled in mission statements. I thought it would
 * look much better if my results only contained charities with filled in mission statements.
 * But the API gave me no way to use mission statement string length as a parameter to filter
 * out the empty string mission statements. So I tried to pull in 1000 rows of data and then 
 * filter out the empty mission statements on my side. But calling that large a dataset slowed down 
 * my app to the point that it wasn't really useable.  
 * 
 *  - Would love to hear what you would have tried in this particular situation
 *    if you wanted to pull in a large dataset without slowing down the app.
 * 
*/


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

// This function listens for the on change event
// Captures the select option value
// Passes the value to the charities search API call as a parameter
// And finally it clears the results when a new category has been chosen from the select
charityApp.selectCharity = () => { 
    
    // When the user chooses a category or changes to a different category
    $("#categorySelect").on("change", function () {

        // Save the category ID from the select element
        charityApp.selectValue = $("select").val();

        // Calling the second AJAX API call, and passing the category ID from the first API call
        charityApp.getCharityProperties(charityApp.selectValue);

        // Clear the results when the user selects a different category from the dropdown
        $(".charityResults").empty();

    });
}

// Charity Search API call
// Returns a data object of available charity properties
// One of the params I am using to filter the charities is the Charity category from the categories API call
charityApp.getCharityProperties = (charityCategorySelection) => {

    const charityPropertiesPromise = $.ajax({
        url: `${charityApp.proxyUrl}`, // proxy URL
        method: `GET`,
        dataType: `json`,
        data: {
           reqUrl: `${charityApp.charitySearchBaseUrl}`, // Charities search base url
           params: {
                user_key: `${charityApp.ApiKey}`, // API key
                eligible: 1, // This parameter returns organizations that are tax deductible and in good standing with the IRS
                category: charityCategorySelection, // Category parameter from categories API Call and chosen by user from select
                rows: 8 // pagination limit
           } // params
        } // data
    }).then(function(charityPropertiesData) {

        // Charities array
        const charityPropertiesArray = charityPropertiesData.data;

        // Only allow charities that accept donations
        let filteredCharityResults = charityPropertiesArray.filter(obj => {
            
            // I really wanted to use the line of code below
            // To filter out the empty string mission statements
            // But it got complicated and slowed down my app too much
            // Was there a better way???

            // return obj.missionStatement !== "" && obj.acceptingDonations === 1;

            // Returns only charities that accept donations
            return obj.acceptingDonations === 1;
            
        });

        // For each charity we build the HTML and append it to the container element
        filteredCharityResults.forEach(function(charityItem) {

            let missionStatement = ``;

            // Do not display mission statement HTML and dynamic content
            // If the mission statement is empty
            if (charityItem.missionStatement !== "") {
                missionStatement = `
                    <small>Mission:</small>
                    <p class="missionStatement">${charityItem.missionStatement}</p>
                `;
            }            

            // Build charity HTML with dynamic values from the charity objects
            const charityProps = $(".charityResults").append(`
                <div class="charityItem">
                    <small>Charity:</small>
                    <h3 class="charityName">${charityItem.charityName.toLowerCase()}</h3>
                    <h4 class="charityCategory">${charityItem.category}</h4>
                    <h5 class="charityLocation">Location: <span>${charityItem.city.toLowerCase()}, ${charityItem.state.toLowerCase()}</span></h5>
                        ${missionStatement}
                    <a class="donateButton" href='${charityItem.donationUrl}' title="Donate to ${charityItem.charityName}">Donate Now</a>
                </div>
            `).delay(50); // delay for animating in the charity items

            // delay and fadeIn for animating in the charity items
            $(".charityItem").each(function(fadeInCharityItem) {
                $(this).delay(fadeInCharityItem * 50).fadeIn(500);
            });
        }); // end forEach()
        
    }).catch(function(error) {
        console.log(error);
    });

}

// Charity Categories API Call
// Returns an array of available categories
charityApp.getCharityCategories = () => {

    // API call returns the charity categories
    const charityCategoriesPromise = $.ajax({
        url: `${charityApp.proxyUrl}`,
        method: `GET`,
        dataType: `json`,
        data: {
           reqUrl: `${charityApp.charityCategoriesBaseUrl}`, // Charity categories base URL
           params: {
                user_key: `${charityApp.ApiKey}`
           } // params
        } // data
    }).then(function(charityCategoriesData) {

        // Categories array
        const charityCategoriesArray = charityCategoriesData.data;

        // Strip away empty and useless categories from the categories array
        const filteredCharityCategoriesArray = charityCategoriesArray.slice(1, 26);

        // Use the foreach() to build the select dropdown element with an option for each category
        // We use the categoryId as the parameter passed to the second AJAX API call
        filteredCharityCategoriesArray.forEach(function(charityItem) {

            const charityCategoriesDropdown = $("#categorySelect").append(`
                <option value="${charityItem.categoryId}">${charityItem.categoryDesc}</option>
            `);
        });

    }).catch(function(error) {
        console.log(error);
    });

} 

// Init
charityApp.init = () => {

    // Get charity categories on page load and build the select dropdown
    charityApp.getCharityCategories();

    // Everything else. :)
    charityApp.selectCharity();

}

$(function () {

    // Init the app
    charityApp.init();

    // Using fitty JS to force the h1 (title) to always consume the size of its container.
    fitty('h1');

});