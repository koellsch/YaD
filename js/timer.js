function Set_html(id, string) {
  document.getElementById(id).getElementsByClassName('counter')[0].value = string;
}

function timer(id) {
  var timer_id = id;
  var start_time;
  var stop = 1;
  var elapsed_time = 0;

  return {
    setText: function() {
      Set_html(timer_id, MSeconds_to_date(elapsed_time));
    },
    start: function() {
      start_time = new Date();
      stop = 0;
    },
    stop: function() {
      stop = 1;
    },
    clear: function() {
      this.stop();
      elapsed_time = 0;
      this.setText();
    },
    restart: function() {
      this.clear();
      this.start();
    },
    timer: function() {
      if (stop === 0) {
        
        elapsed_time = new Date() - start_time;
        Set_html(timer_id, MSeconds_to_date(elapsed_time));
      }
    },
    set: function(time) {
      this.stop();
      start_time = time;
      stop = 0;
      this.setText();
    },
    getStartTime: function() {
      return start_time;
    }
  }
}