// content.js
$(function() {

    var buttonLocation = 'aside.oSide';

    // job feed
    if (window.location.href.indexOf("find-work-home") !== -1) {
        buttonLocation = '.oLayout aside';
    }
    
    // remove placeholder text
    $(buttonLocation + ' h1').first().remove();

    // power search button
    $('<span id="grab_info" class="oBtn oBtnPrimary" style="display:block; margin-bottom:10px;">Search Power-Up</span>')
        .click(StartScrappingProcess)
        .prependTo($(buttonLocation).first());

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

    function StartScrappingProcess() {

        $('.power-up').remove();
 
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
            $.getJSON("https://www.upwork.com/jobs/" + $(this).data("id") + "/applicants", function(data) {

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
