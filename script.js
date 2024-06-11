const leaderboard = document.getElementById('leaderboard');
const time = document.getElementById('time');
const courses = document.getElementById('courses');

let leaderboardData = JSON.parse(`{
  "data":[],
  "finished":[]
}`);
const crs = {
  colors:["white","yellow","orange","beige","brown","green","red","blue"],
    colordef:["Easy","Normal","Intermediate","Intermediate Long","Advanced","Advanced Long","Expert","Expert Long"],
    colorhue:["rgb(255,255,255)","rgb(247, 237, 47)","rgb(255, 153, 0)","rgb(117, 107, 75)","rgb(92, 63, 34)","rgb(19, 191, 42)","rgb(209, 15, 15)","rgb(46, 125, 209)"],
  oncourse:"0px 0px 20px 1px lime",
  pendcourse:"0px 0px 20px 1px orange"
};
const updateTime = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  time.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
};

const checkData = () => {
  if (!(localStorage.getItem('leaderboardData') === null)) {
    leaderboardData = JSON.parse(localStorage.getItem('leaderboardData'));
    update();
  }
  else {
    
  }
  setInterval(updateTime, 1000);
  setInterval(update,60000);
};

const updateLeaderboard = () => {
  leaderboard.innerHTML = '';
  if (leaderboardData.finished) {
    for (let t = 0; t < crs.colordef.length;t++) {
      let courseList = leaderboardData.finished.filter(item => item.course == crs.colors[t]);
      let title = document.createElement('h3');
      title.textContent = crs.colors[t].charAt(0).toUpperCase() + crs.colors[t].slice(1) + " (" + crs.colordef[t] + ") ";
      title.style.margin = "0px 10px";
      title.style.color = crs.colorhue[t];
      leaderboard.appendChild(title);
      let sortedlist = courseList.sort((a, b) => (a.endTime - a.startTime) - (b.endTime - b.startTime));
      for (let r = 0; r < sortedlist.length; r++) {
        let rank = r + 1;
        const row = document.createElement('div');
        row.classList.add('row');
        const rankDiv = document.createElement('div');
        rankDiv.classList.add('rank');
        rankDiv.textContent = rank;
        const name = document.createElement('div');
        name.classList.add('name');
        name.textContent = sortedlist[r].name;
        const time = document.createElement('div');
        time.classList.add('time');
        time.textContent = `${Math.floor((sortedlist[r].endTime - sortedlist[r].startTime) / 60000)}: ${Math.round(((sortedlist[r].endTime - sortedlist[r].startTime) % 60000) / 1000)}`;
        row.appendChild(rankDiv);
        row.appendChild(name);
        row.appendChild(time);
        leaderboard.appendChild(row);
      }
    }
  }
};
const updateCourses = () => {
  courses.innerHTML = '';
  for (let i = 0; i < leaderboardData.data.length; i++) {
    const name = document.createElement('div');
    const mins = document.createElement('div');
    mins.textContent = Math.round(((new Date().getTime() - leaderboardData.data[i].startTime) / 60000))+"m";
    mins.style.color = "grey";
    name.textContent = leaderboardData.data[i].name+" • ";
    name.appendChild(mins);
    name.style.color = crs.colorhue[crs.colors.indexOf(leaderboardData.data[i].course)];
    name.onclick = function() {
      if (new Date().getTime() - leaderboardData.data[i].startTime >= 0) {
        leaderboardData.data[i].endTime = new Date().getTime();
        leaderboardData.finished.push(leaderboardData.data[i]);
        leaderboardData.data.splice(i,1);
        
    }
      else {
        if (confirm("Are you sure you want to delete this user?")) {
          leaderboardData.data.splice(i,1);
        }
      }
      update();
    };
    if (!(new Date().getTime() < leaderboardData.data[i].startTime)) {
      name.style.boxShadow = crs.oncourse;
    }
    else {
      name.style.boxShadow = crs.pendcourse;
    }
    courses.appendChild(name);
  }
};
const newData = (N,C) => {
  let ST = new Date().getTime() + 120000;
  leaderboardData.data.push({ "name": N, "startTime":ST, "endTime": null, "course": C });
  update();
};
const newEntry = () => {
  let box = document.createElement('div');
  box.classList.add('box');
  let h1 = document.createElement('h1');
  h1.textContent = "Course Entry";
  box.appendChild(h1);
  let exit = document.createElement('exit');
  exit.innerHTML = '<i class="fa fa-close"></i>';
  exit.classList.add('btnHover');
  exit.onclick = function() {box.remove();};
  box.appendChild(exit);
  let input = document.createElement('input');
  input.placeholder = "Type your name here...";
  box.appendChild(input);
  let input2 = document.createElement('input');
  input2.placeholder = "Type your course here...";
  box.appendChild(input2);
  let btn = document.createElement('button');
  btn.textContent = "Start in 2 min";
  btn.classList.add('btnHover');
  btn.onclick = function() {
    if (crs.colors.includes(input2.value)) {
      newData(input.value,input2.value);
      box.remove();
    }
  };
  box.appendChild(btn);
  document.body.appendChild(box);
  input.focus();
};
const saveData = () => {
  localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
};
const update = () => {
  saveData();
  updateLeaderboard();
  updateCourses();
};
checkData();
