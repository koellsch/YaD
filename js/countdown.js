function Set_value(id, string) {
  document.getElementById(id).getElementsByClassName('counter')[0].value = string;
}

function countdown(id) {
  var countdown_id = id;
  var end_time = 0;
  var stop = 1;
  var time_left = 0;
  
  return {
    setText: function() {
      Set_value(countdown_id, MSeconds_to_date(time_left));
    },
    start: function() {
      stop = 0;
      $('#' + countdown_id).css('animation', '');
    },
    stop: function() {
      stop = 1;
    },
    clear: function() {
      this.stop();
      time_left = 0;
      $('#' + countdown_id).css('animation', '');
      this.setText();
    },
    timer: function() {
      if (stop === 0) {
        time_left = (end_time - new Date()) < 0 ? 0 : end_time - new Date();
        Set_value(countdown_id, MSeconds_to_date(time_left));
        if(time_left === 0)
        {
          $('#' + countdown_id).css('animation', 'blink .5s infinite alternate');
          $('#' + countdown_id + ' .control').click();
        }
      }
    },
    set: function(time) {
      this.stop();
      end_time = time;
      this.start();
      this.setText();
    },
    isFinished: function() {
      if(time_left === 0)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  }
};