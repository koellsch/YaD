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

  if(date.split(' ').length === 2)
  {
    //Date with time
    //TODO
  }
  else
  {
    //Date without time
    var date_splitted = date.split('.');
    var day = date_splitted[0];
    var month = date_splitted[1];
    var year = date_splitted[2].length < 3 ? '20' + date_splitted[2] : date_splitted[2];
  }
  return year + '-' + month + '-' + day;
}