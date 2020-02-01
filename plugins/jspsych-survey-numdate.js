/**
 * jspsych-survey-numdate
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw, Ignatius Liu, Lin Fei
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-numdate'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-numdate',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'The string will be used to populate the response field with editable answer.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 40,
            description: 'The number of columns for the response text box.'
          },
          type: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Type',
            default: "number",
            description: 'The type of response required.'
          },
          step: {
            type: jsPsych.plugins.parameterType.FLOAT,
            pretty_name: 'Step',
            default: 0,
            description: 'The legal number intervals of the response.'
          },
          max: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Max',
            default: undefined,
            description: 'The legal maximum value for the response.'
          },
          min: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Min',
            default: undefined,
            description: 'The legal minimum value for the response.'
          },
          feedback: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Feedback',
            default: "",
            description: 'The feedback for the response. %r for response given, %q for question.'
          },
          feedback_time: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Feedback Time',
            default: 0,
            description: 'The feedback time for the response, in seconds (if 0, must click to continue).'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Require a response'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = 1;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = 40;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].type == 'undefined') {
        trial.questions[i].type = "number";
      }
      //Checks typing, defaulting to number if incorrect typing
      else if(!["number", "date", "time", "month", "week", "datetime-local"].include(trial.questions[i].type)) {
        trial.questions[i].type = "number";
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].step == 'undefined') {
        trial.questions[i].step = 0;
      }
    }

    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-numdate-preamble" class="jspsych-survey-numdate-preamble">'+trial.preamble+'</div>';
    }
    // start form
    html += '<form id="jspsych-survey-numdate-form">'
    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      html += '<div id="jspsych-survey-numdate-'+i+'" class="jspsych-survey-numdate-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-numdate">' + trial.questions[i].prompt + '</p>';
      var autofocus = i == 0 ? "autofocus " : "";
      var req = trial.questions[i].required ? "required " : "";
      var max = typeof trial.questions[i].max == 'undefined' ? 'max="' + trial.questions[i].max + '" ': "";
      var min = typeof trial.questions[i].min == 'undefined' ? 'min="' + trial.questions[i].min + '" ' : "";
      html += '<input type="' + trial.questions[i].type + '" step="' + trial.questions[i].step' +
        '" name="#jspsych-survey-numdate-response-' + i +
        '" size="' + trial.questions[i].columns +
        '" value="' + trial.questions[i].value +
        '" ' + autofocus + req + max + min + '></input>';
      html += '</div>';
    }

    // add submit button
    html += '<input type="submit" id="jspsych-survey-numdate-next" class="jspsych-btn jspsych-survey-numdate" value="'+trial.button_label+'"></input>';

    html += '</form>'
    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-survey-numdate-form').addEventListener('submit', function() {
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-survey-numdate-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        var val = matches[index].querySelector('input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = performance.now();
  };

  return plugin;
})();
