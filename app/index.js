import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as fs from "fs";

let todoData = fs.readFileSync("./resources/todoistData.json", "json");

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myClock = document.getElementById("myClock");
const myDate = document.getElementById("date");
const VTList = document.getElementById('my-tile-list');
const checks = document.getElementsByClassName("task");


const overdueText = document.getElementById("title-pool[0]");
const todayText = document.getElementById("title-pool[1]");
const tomoText = document.getElementById("title-pool[2]");
const day3Text = document.getElementById("title-pool[3]");
const day4Text = document.getElementById("title-pool[4]");
const day5Text = document.getElementById("title-pool[5]");
const day6Text = document.getElementById("title-pool[6]");
const day7Text = document.getElementById("title-pool[7]");



const dayArray = [
  {
    "title": overdueText.getElementById("titleText"),
    "sidetext": overdueText.getElementById("sideTitleText")
  },
  {
    "title": todayText.getElementById("titleText"),
    "sidetext": todayText.getElementById("sideTitleText")
  },
  {
  	"title": tomoText.getElementById("titleText"),
    "sidetext": tomoText.getElementById("sideTitleText")
  },
  {
    "title": day3Text.getElementById("titleText"),
    "sidetext": day3Text.getElementById("sideTitleText")
  },
  {
    "title": day4Text.getElementById("titleText"),
    "sidetext": day4Text.getElementById("sideTitleText")
  },
  {
    "title": day5Text.getElementById("titleText"),
    "sidetext": day5Text.getElementById("sideTitleText")
  },
  {
    "title": day6Text.getElementById("titleText"),
    "sidetext": day6Text.getElementById("sideTitleText")
  },
  {
    "title": day7Text.getElementById("titleText"),
    "sidetext": day7Text.getElementById("sideTitleText")
  }
];

const defaultProject = {
  "id": 0,
  "name": "NULLPROJ",
  "color": 7
};


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  myDate.text = today.toString().slice(0,10);
  let nextDay = new Date(today);
  
  for (var i = 0; i< dayArray.length; i++){
  	if(i == 0){
  		dayArray[i].title.text = "Overdue";
  		dayArray[i].title.style.fill = "#d24726";
  		dayArray[i].sidetext.text = "";
  	} else if (i == 1){
  		dayArray[i].title.text = "Today";
  		dayArray[i].sidetext.text = today.toString().slice(0,10);
  	} else if (i == 2){
  		nextDay.setDate(nextDay.getDate()+1);
  		dayArray[i].title.text = "Tomorrow";
  		dayArray[i].sidetext.text = nextDay.toString().slice(0,10);
  	} else {
	  	nextDay.setDate(nextDay.getDate()+1);
	    dayArray[i].title.text = util.stringDay(nextDay.getDay());
	    dayArray[i].sidetext.text = nextDay.toString().slice(4,10);
  	}
  }
  
  
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myClock.text = `${hours}:${mins}`;
  
}

VTList.delegate = {
  getTileInfo : function(index) {
    var tile_type = ((index) % 2 == 0) ? "title-pool" : "task-pool";
    var new_index = index - Math.floor((index+1) / 2);
    var item_id = 0;
    var item_obj = 0;
    var project_obj = 0;
    if(tile_type == "task-pool"){
      item_id = todoData.items[new_index].id;
      item_obj = todoData.items[new_index];
      project_obj = defaultProject;
      for (var i = 0; i < todoData.projects.length; i++){
        if (todoData.projects[i].id == todoData.items[new_index].project_id){
          project_obj = todoData.projects[i];
        } 
      }
    }
    return { 
      type : tile_type,
      index : new_index, 
      item_id : item_id,
      item_obj : item_obj,
      project_obj : project_obj
    };
  },
  
  configureTile : function(tile, info) {
    if (info.type == 'task-pool') {
      tile.getElementById('taskText').text = info.item_obj.content + " " + info.index;
      
      if (info.item_obj.checked) {
        tile.getElementById("image").href = "checkmark.png";
        tile.getElementById("circle").style.fill = "lightgrey";
      } else {
        tile.getElementById("image").href = "";
        tile.getElementById("circle").style.fill = "white";
      }
      
      tile.getElementById("CHECKITEM").onclick = function(e){
        //console.log(JSON.stringify(check));
        fs.writeFileSync("todoistData.json", todoData, "json");
        if(tile.getElementById("image").href === ""){
          tile.getElementById("image").href = "checkmark.png";
          tile.getElementById("circle").style.fill = "lightgrey";
          info.item_obj.checked = true;
          todoData.items[info.index].checked = true;
        } else{
          tile.getElementById("image").href = "";
          tile.getElementById("circle").style.fill = "white";
          info.item_obj.checked = false;
          todoData.items[info.index].checked = false;
        }
        fs.writeFileSync("todoistData.json", todoData, "json");
      }
      
      //console.log(info.project_obj);
      tile.getElementById("projectCircle").style.fill = util.todoistColor(info.project_obj.color);
      /*
      try {
        var project_id = todoData.items[info.item_id].project_id.toString();
        tile.getElementById("projectCircle").style.fill = util.todoistColor(todoData.projects[info.project_index].color);
      } catch(e) {
        console.log(e);
      }*/
      
      
    }
  },
};

// KNOWN ISSUE: It is currently required that VTList.length be set AFTER VTList.delegate
VTList.length = 16;