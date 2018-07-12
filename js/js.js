var active_timers = new Map();
var active_countdowns = new Map();
var interval_ids = new Map();
var interval_ids_countdowns = new Map();

$(document).ready(function() {
  getWeather(); //Get the initial weather.
  setInterval(getWeather, 600000); //Update the weather every 10 minutes.

  Load_elements();

  $('#add-timer').click(Add_new_timer);
  $('#add-countdown').click(Add_new_countdown);
});

window.onbeforeunload = function () {
  Save_elements();
};

function Add_new_timer() {
  var id = String($('.timer').length);
  var timer_id = 'timer_' + id;
  $('#timer_box').append('<div class="timer" id="' + timer_id + '" data-id="' + id + '"><form><input class="titel" type="text" placeholder="Titel eingeben"><input class="counter" type="text" readonly value="0T 00:00:00"></form><div class="control" data-value="0"></div><div class="remove">X</div></div>');
  $('#' + timer_id + ' .remove').click(Remove_timer);
  $('#' + timer_id + ' .control').click(Change_status);

  var new_timer = new timer(timer_id);
  active_timers.set(id, new_timer);
  interval_ids.set(id, setInterval(new_timer.timer, 10));
}

function Add_new_countdown() {
  var id = String($('.countdown').length);
  var countdown_id = 'countdown_' + id;
  $('#timer_box').append('<div class="countdown" id="' + countdown_id + '" data-id="' + id + '"><form><input class="titel" type="text" placeholder="Titel eingeben"><input class="counter" type="text" placeholder="Datum"></form><div class="popup"></div><div class="control" data-value="0"></div><div class="remove">X</div></div>');
  $('#' + countdown_id + ' .remove').click(Remove_countdown);
  $('#' + countdown_id + ' .control').click(Change_status_countdown);
  $('#' + countdown_id + ' .counter').click(Show_enddate);

  var new_countdown = new countdown(countdown_id);
  active_countdowns.set(id, new_countdown);
  interval_ids_countdowns.set(id, setInterval(new_countdown.timer, 10));
}

function Remove_timer() {
  var id = $(this).parent().attr('data-id');
  clearInterval(interval_ids.get(id));
  active_timers.delete(id);
  interval_ids.delete(id);
  $(this).parent().remove();
}

function Remove_countdown() {
  var id = $(this).parent().attr('data-id');
  clearInterval(interval_ids_countdowns.get(id));
  active_countdowns.delete(id);
  interval_ids_countdowns.delete(id);
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
    $(this).parent().attr('data-start', timer.getStartTime());
    $(this).attr('data-value', '1');
    $(this).css("background", "url(img/refresh.png) no-repeat");
        
  }
  else if(status == 1)
  {
    //Reset timer
    timer.restart();
    $(this).parent().attr('data-start', timer.getStartTime());
    $(this).attr('data-value', '1');
  }
}

function Change_status_countdown() {
  var countdown_id = $(this).parent().attr('data-id');
  var status = $(this).attr('data-value');
  var countdown = active_countdowns.get(countdown_id);
  var date;

  if (status == 0)
  {
    //Start countdown
    var time_set = $(this).parent().attr('data-end');
    if(typeof time_set !== typeof undefined && time_set !== false)
    {
      //Countdown paused
      //Check for new entered date
      var date_input = $(this).parent().find('.counter').val();
      var date_converted = Convert_date(date_input);
      var new_date = new Date(date_converted);
      date = new Date(time_set);

      if(new_date != date && new_date != 'Invalid Date')
      {
        date = new_date;
      }
    }
    else
    {
      //Countdown never started
      var date_input = $(this).parent().find('.counter').val();
      var date_converted = Convert_date(date_input);
      date = new Date(date_converted);
    }

    if(date != 'Invalid Date')
    {
      countdown.set(date);
      countdown.start();
      $(this).parent().attr('data-end', date);
      $(this).attr('data-value', '1');
      $(this).css("background", "url(img/pause.png) no-repeat");
    }
        
  }
  else if(status == 1)
  {
    //Pause countdown
    countdown.stop();
    $(this).attr('data-value', '0');
    $(this).css("background", "url(img/play.png) no-repeat");
  }
}

function Show_enddate()
{
  var time_set = $(this).parent().parent().attr('data-end');
  var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  if(typeof time_set !== typeof undefined && time_set !== false)
  {
    $(this).parent().parent().find('.popup').html(new Date(time_set).toLocaleDateString('de-DE', options));
    $(this).parent().parent().find('.popup').fadeIn('slow');
    $(this).parent().parent().find('.popup').delay(1000).fadeOut('slow');
  }
}

function Save_elements()
{
  localStorage.clear();
  var item = 0;
  $('.timer').each(function(i, obj)
  {
    var titel_and_duration = 'timer_' + i + ';' + $(this).find('.titel').val() + ';' + $(this).attr('data-start');
    localStorage.setItem(item, titel_and_duration);
    item++;
  });
  $('.countdown').each(function(i, obj)
  {
    var titel_and_endtime = 'countdown_' + i + ';' + $(this).find('.titel').val() + ';' + $(this).attr('data-end');
    localStorage.setItem(item, titel_and_endtime);
    item++;
  });
}

function Load_elements()
{
  for ( var i = 0, len = localStorage.length; i < len; ++i )
  {
    var element = localStorage.getItem(localStorage.key(i));
    if(element.split(";")[0].indexOf("timer") >= 0)
    {
      //Timer
      Add_existing_timer(element.split(";")[0], element.split(";")[1], element.split(";")[2]);
    }
    else if(element.split(";")[0].indexOf("countdown") >= 0)
    {
      //Contdown
      Add_existing_countdown(element.split(";")[0], element.split(";")[1], element.split(";")[2]);
    }
  }
}

function Add_existing_timer(timer_id, titel, duration)
{
  var new_timer = new timer(timer_id);
  var id = timer_id.replace(/[^0-9]/g,'');
  if(duration != 'undefined')
  {
    $('#timer_box').append('<div class="timer" id="' + timer_id + '" data-id="' + id + '" data-start="' + duration + '"><form><input class="titel" type="text" placeholder="Titel eingeben" value="' + titel + '"><input class="counter" type="text" readonly value="' + MSeconds_to_date(duration) + '"></form><div class="control" data-value="1"></div><div class="remove">X</div></div>');
    $('#' + timer_id + ' .control').css("background", "url(img/refresh.png) no-repeat");
    new_timer.set(new Date(duration));
  }
  else
  {
    $('#timer_box').append('<div class="timer" id="' + timer_id + '" data-id="' + id + '" data-start="' + duration + '"><form><input class="titel" type="text" placeholder="Titel eingeben" value="' + titel + '"><input class="counter" type="text" readonly value="' + MSeconds_to_date(duration) + '"></form><div class="control" data-value="0"></div><div class="remove">X</div></div>');
    $('#' + timer_id + ' .control').css("background", "url(img/play.png) no-repeat");
    new_timer.clear();
  }

  $('#' + timer_id + ' .remove').click(Remove_timer);
  $('#' + timer_id + ' .control').click(Change_status);

  active_timers.set(id, new_timer);
  interval_ids.set(id, setInterval(new_timer.timer, 10));
}

function Add_existing_countdown(countdown_id, titel, endtime)
{
  var new_countdown = new countdown(countdown_id);
  var id = countdown_id.replace(/[^0-9]/g,'');
  if(endtime != 'undefined')
  {
    $('#timer_box').append('<div class="countdown" id="' + countdown_id + '" data-id="' + id + '" data-end="' + endtime + '"><form><input class="titel" type="text" placeholder="Titel eingeben" value="' + titel +'"><input class="counter" type="text" placeholder="Datum" value="' + endtime +'"></form><div class="popup"></div><div class="control" data-value="1"></div><div class="remove">X</div></div>');
    $('#' + countdown_id + ' .control').css("background", "url(img/pause.png) no-repeat");
    new_countdown.set(new Date(endtime));
  }
  else
  {
    $('#timer_box').append('<div class="countdown" id="' + countdown_id + '" data-id="' + id + '"><form><input class="titel" type="text" placeholder="Titel eingeben" value="' + titel +'"><input class="counter" type="text" placeholder="Datum"></form><div class="popup"></div><div class="control" data-value="0"></div><div class="remove">X</div></div>');
    $('#' + countdown_id + ' .control').css("background", "url(img/play.png) no-repeat");
  }

  $('#' + countdown_id + ' .remove').click(Remove_countdown);
  $('#' + countdown_id + ' .control').click(Change_status_countdown);
  $('#' + countdown_id + ' .counter').click(Show_enddate);

  active_countdowns.set(id, new_countdown);
  interval_ids_countdowns.set(id, setInterval(new_countdown.timer, 10));
}