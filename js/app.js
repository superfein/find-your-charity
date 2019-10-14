
// Initialize empty object
const charityApp = {};

// Charity Categories API base URL
charityApp.charityCategoriesBaseUrl = `http://data.orghunter.com/v1/categories`;

// Charity Search API base URL
charityApp.charitySearchBaseUrl = `http://data.orghunter.com/v1/charitysearch`;

// Charity API Key
charityApp.ApiKey = "de600b98a1ce36fe4ae72e0a3ad9e111";

// Function which 
charityApp.selectCharity = () => { 
    
    $("#categorySelect").on("change", function () {

        // event.preventDefault();

        charityApp.selectValue = $("select").val();

        // console.log(charityApp.selectValue);    
        // charityApp.charitySearchTerm = searchTermValue;

        charityApp.getCharityProperties(charityApp.selectValue);

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
        // url: `http://proxy.hackeryou.com`,
        url: `${charityApp.charitySearchBaseUrl}`,
        method: `GET`,
        dataType: `json`,
        data: {
           // reqUrl: `${charityApp.charitySearchBaseUrl}`,
           // params: {
                user_key: `${charityApp.ApiKey}`,
                eligible: 1, // This only returns organizations that are tax deductible and in good standing with the IRS
                category: charityCategorySelection, // Category from /categories API Call
                rows: 20 // pagination
                // ein: `590774235`
          //  } // params
        } // data
    }).then(function(charityPropertiesData) {

        // console.log(charityPropertiesData);
        const charityPropertiesArray = charityPropertiesData.data;


        

        charityPropertiesArray.forEach(function(charityItem) {

            // if (charityItem.acceptingDonations === 0) {
            //     charityItem.acceptingDonations = "No";
            // } else {
            //     charityItem.acceptingDonations = "Yes";
            // }

            console.log(charityItem);

            if (charityItem.acceptingDonations === 1) {
                // Charity Search Results HTML
                const charityProps = $(".charityResults").append(`
                    <div class="charityItem">
                        <ul>
                            <li>Charity Name: ${charityItem.charityName}</li>
                            <li>Mission Statement: ${charityItem.missionStatement}</li> 
                            <li>Category: ${charityItem.category}</li>                           
                            <li>City: ${charityItem.city}</li> 
                            <li>State: ${charityItem.state}</li>
                        </ul>
                        <a class="donateButton" href='${charityItem.donationUrl}' title="${charityItem.charityName} donate link">Donate Now</a>
                    </div>
                `).delay(150);

                $(".charityItem").each(function(fadeInCharityItem) {
                    $(this).delay(fadeInCharityItem * 150).fadeIn(500);
                });
            }
        }); // end forEach()                    

    }).catch(function(error) {
        console.log(error);
    });
    // return charityPropertiesPromise;
}   

// Charity Categories API Call
// Returns a list of available categories as description strings
charityApp.getCharityCategories = () => {

    // API call returns the charity categories
    const charityCategoriesPromise = $.ajax({
     //   url: `http://proxy.hackeryou.com`,
        url: `${charityApp.charityCategoriesBaseUrl}`,
        method: `GET`,
        dataType: `json`,
        data: {
       //     reqUrl: `${charityApp.charityCategoriesBaseUrl}`,
         //   params: {
                user_key: `${charityApp.ApiKey}`
                // searchTerm: `${charityApp.charitySelectValue}`
          //  } // params
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
}

$(function () {

    charityApp.init();

});