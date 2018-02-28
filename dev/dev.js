const PORT = 7072;
const FULLSCREEN = false;
$(document).ready(function(){

    // This listens to the form on-submit action
    $("form").submit(function(){    // Remove


        //////////////////////////////////////////
        // DEFINE workerId, hitId, assignmentId HERE
        //////////////////////////////////////////
        let subjCode = $("#subjCode").val().slice();
        let numTrials = $("#numTrials").val();
        let reset =  $("#reset").val();
        let workerId = 'null';
        let assignmentId = 'null';
        let hitId = 'null';

        $("form").remove();
        $("#loading").html('<h2 style="text-align:center;">Loading trials... please wait.</h2> </br> <div  class="col-md-2 col-md-offset-5"><img src="../dev/img/preloader.gif"></div>')

        // This calls server to run python generate trials (judements.py) script
        // Then passes the generated trials to the experiment
        $.ajax({
            url: 'http://'+document.domain+':'+PORT+'/trials',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({subjCode, numTrials, reset}),
            success: function (data) {
                console.log(data);

                let images = [];
                let categories = data.trials.categories;
                let stimuli = data.trials.images;

                for (let category of categories) 
                    for (let file of stimuli[category]) 
                        images.push(file);
                
                jsPsych.pluginAPI.preloadImages(images, function(){}); 
                    
                // $("#loading").remove();
                runExperiment({categories, images: stimuli, questions: data.trials.questions, debriefing: data.trials.debriefing}, subjCode, workerId, assignmentId, hitId);
    
            }
        })
    }); // Remove
    

});