$(document).ready(function() {
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.

    $('#add-timer').click(Add_new_timer);
    $('.remove').click(Remove_timer);
    $('.control').click(Change_status);
  });
  
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
    $('#timer_box').append('<div class="timer" data-value="0"><form><input class="titel" type="text" placeholder="Titel eingeben"></form><div class="counter">10T 23:00</div><div class="control" data-value="0"></div><div class="remove">X</div></div>');
    $('.remove').click(Remove_timer);
    $('.control').click(Change_status);
}

  function Remove_timer() {
    $(this).parent().remove();
  }

  function Change_status() {
      var status = $(this).attr('data-value');
      if (status == 0)
      {
        $(this).attr('data-value', '1');
        $(this).css("background", "url(img/refresh.png) no-repeat"); 
      }
      else if(status == 1)
      {
        $(this).attr('data-value', '0');
        $(this).css("background", "url(img/play.png) no-repeat"); 
      }
  }