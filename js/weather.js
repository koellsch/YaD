function getWeather() {
  $.simpleWeather({
    location: 'Haar, Munich, Germany',
    unit: 'c',
    success: function(weather) {
      html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
      html += '<ul><li>' + weather.city + '</li>';
      html += '<li>' + weather.currently + '</li>';
      html += '<li>' + weather.wind.speed + ' ' + weather.units.speed + '</li>';
      html += '<li class="refresh-weather">&ensp;' + '</li></ul>';
    
      $("#weather").html(html);
      $('#weather .refresh-weather').click(getWeather);
      $('#weather .refresh-weather').removeClass("rotate");
    },
    error: function(error) {
      $("#weather").html('<p>' + error + '</p>');
    }
  });
}