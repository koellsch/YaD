$(document).ready(function() {
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.

    $('#add-timer').click(Add_new_timer);
    $('.remove').click(Remove_timer);
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
    $('#timer_box').append('<div class="timer"><div class="titel">Blumen gießen</div><div class ="counter">20:00:00</div><div class="remove">X</div></div>');
    $('.remove').click(Remove_timer);
}

  function Remove_timer() {
    $(this).parent().remove();
  }