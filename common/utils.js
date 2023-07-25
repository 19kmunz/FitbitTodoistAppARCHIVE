// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function stringDay(i){
  if(i==0){
    return "Sunday";
  } else if (i==1){
    return "Monday";
  } else if (i==2){
    return "Tuesday";
  } else if (i==3){
    return "Wednesday";
  } else if (i==4){
    return "Thursday";
  } else if (i==5){
    return "Friday";
  } else if (i==6){
    return "Saturday";
  }
}

var colorArray = ["#95ef63", "#ff8581", "#ffc471", "#f9ec75", "#a8c8e4", "#d2b8a3", "#e2a8e4", "#cccccc", "#fb886e", "#ffcc00", "#74e8d3", "#3bd5fb", "#dc4fad", "#ac193d", "#d24726", "#82ba00", "#03b3b2", "#008299", "#5db2ff", "#0072c6", "#000000", "#777777"]

export function todoistColor(colorInt){
  return colorArray[colorInt];
}