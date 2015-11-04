// content.js

var countries = [ "All Countries", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territories", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "United States Virgin Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe" ];

// client info style
var style = {
    float: 'right',
    width: 200,
    background: '#fff',
    border: '1px #ccc solid',
    padding: 4,
    marginLeft: 10,
    marginBottom: 10
};

// cookies
function cookie(key, value, result) {
    if (value !== undefined) {
        document.cookie = key + "=" + value;
    } else {
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
    }
}

$(function() {

    var buttonLocation = 'aside.oSide';

    // job feed
    if (window.location.href.indexOf("find-work-home") !== -1) {
        buttonLocation = '.oLayout aside';
        style.marginBottom = 0;
    }

    // jquery button location
    var $buttonLocation = $(buttonLocation).first();
    
    // remove placeholder text
    $(buttonLocation + ' h1').first().remove();

    // countries
    var select = $('<select style="width:100%; margin-bottom:10px;">');
        select.on("keyup change", hideJobsByCountry);
        select.prependTo($buttonLocation);

    // add options
    countries.forEach(function(country) {
        $('<option>').val(country).text(country).appendTo(select);
    });
    
    // select country
    select.val(cookie('sup-country') || countries[0]);

    // power search button
    $('<span class="oBtn oBtnPrimary" style="display:block; margin-bottom:10px;">Search Power-Up</span>')
        .click(StartScrappingProcess)
        .prependTo($buttonLocation);

    // hide jobs by country
    function hideJobsByCountry() {

        var value = $(this).val();
        var showAll = value === countries[0];

        // set country
        cookie('sup-country', value);

        $('.hidden-job-placeholder').remove();

        $('.oJobTile').each(function() {
            
            var element = $(this);
            var record = element.find('.oSpendIndicator i').attr('title');

            // hide
            if (showAll || record.indexOf(value) !== -1) {
                element.find('.oSupportInfo, .oDescription, .oFormInfo, .oSegmentationInfo').show();
            } else {
                element.find('.oSupportInfo, .oDescription, .oFormInfo, .oSegmentationInfo').hide();

                var placeholder = $('<div class="hidden-job-placeholder">');
                    placeholder.text('This job has been hidden. Click to view.');
                    placeholder.css('cursor', 'pointer');
                    placeholder.click(function() {
                        element.find('.oSupportInfo, .oDescription, .oFormInfo, .oSegmentationInfo').show();
                        placeholder.remove();
                    });
                    placeholder.appendTo(element);
            }
        });
    }

    // data scraping
    function StartScrappingProcess() {

        // remove previous content
        $('.power-up').remove();
 
        // get data
        $('.oJobTile').each(function() {

            var element = $(this);

            // client data
            var record = element.find('.oSpendIndicator i').attr('title');
                record = record.replace(/</g, '&lt;');
                record = record.replace(/>/g, '&gt;');
                record = record.replace('Location:', '<b>Location:');
                record = record.replace('ID:', '</b>ID:');
                record = record.replace(/,/, '<br />');
                record = record.replace(/(?:\r\n|\r|\n)/g, '<br />');

            var truncated = element.find('.oDescription .jsTruncated');
            var full = element.find('.oDescription .jsFull');

            if (truncated.length) {
                $('<span class="power-up">').css(style).html(record).prependTo(truncated);
                truncated.css('overflow', 'auto');
            }

            if (full.length) {
                $('<span class="power-up">').css(style).html(record).prependTo(full);
                full.css('overflow', 'auto');
            }

            // application data
            $.getJSON("https://www.upwork.com/jobs/" + $(this).attr("data-id") + "/applicants", function(data) {

                var appCount = data.applicants.length;
                var interviewCount = data.invitedToInterview;

                var info = $('<span class="power-up">').css("float", "right").prependTo(element.find('.oSupportInfo').first());

                var applicants = $('<b>').text('Candidates: ' + appCount).css('margin-right', 5).appendTo(info);
                var interviews = $('<b>').text('Interviews: ' + interviewCount).appendTo(info);

                // colorize
                if (appCount < 10) {
                    applicants.css("color", "green");
                }
                if (appCount > 30) {
                    applicants.css("color", "red");
                }

                // colorize
                if (interviewCount < 5) {
                    interviews.css("color", "green");
                }
                if (interviewCount > 10) {
                    interviews.css("color", "red");
                }
            });
        });
    }
});
