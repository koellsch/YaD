function MSeconds_to_date(ms)
{
  var s = Math.floor(ms / 1000),
    m = Math.floor(s / 60),
    s = s % 60,
    h = Math.floor(m / 60),
    m = m % 60,
    d = Math.floor(h / 24),
    h = h % 24,
    pad = function(n) { return n < 10 ? '0' + n : n; };

  return d + 'T ' + pad(h) + ':' + pad(m) + ':' + pad(s);
}

function Convert_date(date)
{
  var hour = "";
  var minutes = "";

  if(date === "")
  {
    return date;
  }
  var date_splitted = date.split(' ');
  var date_only = date_splitted[0].split('.');

  if(date_only.length < 3)
  {
    return "Invalid Date";
  }
  
  var day = date_only[0];
  var month = date_only[1] - 1;
  var year = date_only[2].length < 3 ? '20' + date_only[2] : date_only[2];

  if(date_splitted.length === 2)
  {
    //Date with time
    var time_only = date_splitted[1].split(':');
    hour = time_only[0];
    minutes = time_only[1];
  }

  return Array(year, month, day, hour, minutes);
}

function Convert_date_to_enddate(date)
{
  var options_date = { year: 'numeric', month: '2-digit', day: '2-digit' };
  var options_time = { hour: '2-digit', minute: '2-digit'};
  return new Date(date).toLocaleDateString('de-DE', options_date) + ' ' + new Date(date).toLocaleTimeString('de-DE', options_time);
}