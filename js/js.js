var active_timers = new Map();
var interval_ids = new Map();

$(document).ready(function() {
  getWeather(); //Get the initial weather.
  setInterval(getWeather, 600000); //Update the weather every 10 minutes.

  Load_timers();

  $('#add-timer').click(Add_new_timer);
});

function idset(id, string) {
  document.getElementById(id).getElementsByClassName('counter')[0].innerHTML = string;
}

function timer(id) {
  var timer_id = id;
  var stop = 1;
  var days = 0;
  var hrs0 = "";
  var hrs = 0;
  var mins0 = "";
  var mins = 0;
  var secs0 = "";
  var secs = 0;
  var msecs = 0;

  return {
    setText: function() {
      hrs0  = ((hrs < 10) ? "0" : "");
      mins0  = ((mins < 10) ? "0" : "");
      secs0  = ((secs < 10) ? "0" : "");

      var current_time = days + 'T ' + hrs0 + hrs + ':' + mins0 + mins + ':' + secs0 + secs;
      idset("timer_" + timer_id, current_time);
    },
    start: function() {
      stop = 0;
    },
    stop: function() {
      stop = 1;
    },
    clear: function() {
      this.stop();
      days = 0;
      hrs = 0;
      mins = 0;
      secs = 0;
      msecs = 0;
      this.setText();
    },
    restart: function() {
      this.clear();
      this.start();
    },
    timer: function() {
      if (stop === 0) {
        msecs++;
        if (msecs === 100) {
          secs ++;
          msecs = 0;
        }
        if (secs === 60) {
          mins++;
          secs = 0;
        }
        if (mins === 60) {
          hrs++;
          mins = 0;
        }
        if (hrs === 24) {
          days++;
          hrs = 0;
        }

        hrs0  = ((hrs < 10) ? "0" : "");
        mins0  = ((mins < 10) ? "0" : "");
        secs0  = ((secs < 10) ? "0" : "");

        var current_time = days + 'T ' + hrs0 + hrs + ':' + mins0 + mins + ':' + secs0 + secs;
        idset("timer_" + timer_id, current_time);
      }
    },
    set: function(tage, stunden, minuten, sekunden, msekunden) {
      this.stop();
      days = tage;
      hrs = stunden;
      mins = minuten;
      secs = sekunden;
      msecs = msekunden;
      this.setText();
    }
  }
};
  
function getWeather() {
  $.simpleWeather({
    location: 'Haar, Munich, Germany',
    unit: 'c',
    success: function(weather) {
      html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
      html += '<ul><li>' + weather.city + '</li>';
      html += '<li class="currently">' + weather.currently + '</li>';
      html += '<li>' + weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';
    
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>' + error + '</p>');
    }
  });
}

function Add_new_timer() {
  var timer_id = String($('.timer').length);
  $('#timer_box').append('<div class="timer" id="timer_' + timer_id + '" data-id="' + timer_id + '"><form><input class="titel" type="text" placeholder="Titel eingeben"></form><div class="counter">0T 00:00:00</div><div class="control" data-value="0"></div><div class="remove">X</div></div>');
  $('#timer_' + timer_id + ' .remove').click(Remove_timer);
  $('#timer_' + timer_id + ' .control').click(Change_status);

  var new_timer = new timer(timer_id);
  active_timers.set(timer_id, new_timer);
  interval_ids.set(timer_id, setInterval(new_timer.timer, 10));
}

function Remove_timer() {
  var id = $(this).parent().attr('data-id');
  clearInterval(interval_ids.get(id));
  active_timers.delete(id);
  interval_ids.delete(id);
  $(this).parent().remove();
}

function Change_status() {
  var timer_id = $(this).parent().attr('data-id');
  var status = $(this).attr('data-value');
  var timer = active_timers.get(timer_id);

  if (status == 0)
  {
    //Start timer
    timer.start();
    $(this).attr('data-value', '1');
    $(this).css("background", "url(img/refresh.png) no-repeat");
        
  }
  else if(status == 1)
  {
    //Reset timer
    timer.restart();
    $(this).attr('data-value', '1');
  }
}

window.onbeforeunload = function () {
  Save_timers();
};

function Save_timers()
{
  localStorage.clear();
  $('.timer').each(function(i, obj)
  {
    var titel_and_duration = $(this).find('.titel').val() + ';' + $(this).find(' .counter').text();
    localStorage.setItem(i, titel_and_duration);
  });
}

function Load_timers()
{
  for ( var i = 0, len = localStorage.length; i < len; ++i )
  {
    var timer = localStorage.getItem(localStorage.key(i));
    Add_existing_timer(localStorage.key(i), timer.split(";")[0], timer.split(";")[1]);
  }
}

function Add_existing_timer(id, titel, duration)
{
  $('#timer_box').append('<div class="timer" id="timer_' + id + '" data-id="' + id + '"><form><input class="titel" type="text" placeholder="Titel eingeben" value="' + titel + '"></form><div class="counter">' + duration + '</div><div class="control" data-value="1"></div><div class="remove">X</div></div>');
  $('#timer_' + id + ' .remove').click(Remove_timer);
  $('#timer_' + id + ' .control').click(Change_status);
  $('#timer_' + id + ' .control').css("background", "url(img/refresh.png) no-repeat");

  var new_timer = new timer(id);
  new_timer.set(parseInt(duration.split("T")[0]),parseInt(duration.split("T ")[1].split(":")[0]), parseInt(duration.split("T ")[1].split(":")[1]), parseInt(duration.split("T ")[1].split(":")[2]), 0);
  new_timer.start();
  active_timers.set(id, new_timer);
  interval_ids.set(id, setInterval(new_timer.timer, 10));
}