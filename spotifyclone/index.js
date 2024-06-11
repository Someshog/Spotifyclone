let currentsong = new Audio();
let songs;
let album_url;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

let albums = document.querySelectorAll(".playbutton").length;
//added event listeners to albums 
for (let index = 0; index < albums; index++) {
  document.querySelectorAll(".playbutton")[index].addEventListener("click", () => {
    document.querySelector(".library").innerHTML = null;
    getsongurl(index);
  }
  )

}

function getsongurl(value) {
  let albumname = document.querySelectorAll(".albumtitle")[value].innerHTML
  album_url = `./songs/${albumname}`;
  async function getsongs() {
    let a = await fetch(album_url);
    let response = await a.text();
    let element = document.createElement("div");
    element.innerHTML = response;
    let b = element.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < b.length; index++) {
      const val = b[index]
      if (val.href.endsWith(".mp3")) {
        songs.push(val.href)
      }
    }
    songs = songs.sort();

    return songs;

  }


  async function playlist(songnumber, songtitle, songartist) {
    songs = await getsongs();
    playmusic(1);
    let element2 = document.createElement("div");
    element2.classList.add(`songlib`);
    element2.classList.add(`song${songnumber}`);
    let code = `
      <img src="cd.svg" alt="" style="filter: invert(); height: 2rem;">
      <div class="info">
          <div>${songtitle}</div>
          <div>${songartist}</div>
      </div>
      <button style="
      background-color: rgb(209 0 0 / 0%); cursor: pointer; border: none;"><img src="libplaybtn.svg" alt=""
              style="height: 2rem;"></button>`
    element2.innerHTML = code;
    document.getElementsByClassName("library")[0].append(element2);
    //attaching event listener to each added song
    element2.children[2].addEventListener("click", () => {
      playmusic(songnumber, songs[songnumber - 1])
      document.querySelector(".songinfo").innerHTML = `
      <div>${songtitle}</div>
      <div>${songartist}</div>
      `;
    }
    );
    document.querySelector(".songinfo").innerHTML = document.querySelectorAll(".info")[0].innerHTML
  }

  async function playmusic(songnumber) {

    songs = await getsongs();
    
    pause = false;
    console.log(songs[songnumber - 1]);
    currentsong.src = songs[songnumber - 1];
    let imgupdate = document.querySelector(".library").children[songnumber - 1].getElementsByTagName("img")[1];
    if (!pause) {
      currentsong.play();
      play.children[0].src = "seekbarpause.svg";
      imgupdate.src = "playing.svg";
    }

    for (let index = 0; index < songs.length; index++) {
      if (index + 1 == songnumber) {
        continue;
      }
      else {
        document.querySelector(".library").children[index].getElementsByTagName("img")[1].src = "libplaybtn.svg";
      }
    }
  }
  
  async function main() {
    songs = await getsongs();
    //next song
    next.addEventListener("click", async () => {

      currentsong.pause();
      let arr = document.querySelectorAll(".info")
      let index = songs.indexOf(currentsong.src);
      index++;
      console.log(index);
      console.log(songs);
      
      if ((index + 1) > songs.length) {
        playmusic(index);
        document.querySelector(".songinfo").innerHTML = arr[index].innerHTML
      }
      else {
        playmusic(index + 1)
        document.querySelector(".songinfo").innerHTML = arr[index].innerHTML
      }

    }
    )
    prev.addEventListener("click", async () => {

      currentsong.pause();
      let arr = document.querySelectorAll(".info")
      let index = songs.indexOf(currentsong.src);
      console.log(index);
      console.log(songs);

      if ((index - 1) < 0) {
        playmusic(index + 1);
        document.querySelector(".songinfo").innerHTML = arr[index--].innerHTML
      }
      else {
        playmusic(index)
        document.querySelector(".songinfo").innerHTML = arr[index - 1].innerHTML
      }

    }
    )


  }

  main();


  // SONGS THAT ARE ADDED 
  if (albumname == "ANIMAL") {
    playlist("1", `Abrars Entry Jamal Kudu (from "Animal")`, "Harshavardhan Rameshwar, Choir");
    playlist("2", `Arjan Vailly`, "Manan Bhardwaj, Bhupinder Babbal");
  }
  else if (albumname == "Still Rollin") {
    
    playlist("1", `Dior`, "Shubh");
    playlist("2", `Still Rollin`, "Shubh");
  }
  else if (albumname == "Ek tha Raja") {
    
    playlist("1", `Soulmate`, "Badshah");
  }
  else if (albumname == "This is Diljit Dosanjh") {
    
    playlist("1", `Black & White`, "Diljit Dosanjh");
    playlist("2", `Born to Shine`, "Diljit Dosanjh");
    playlist("3", `Drowning`, "Diljit Dosanjh");
    playlist("4", `Hass Hass`, "Diljit Dosanjh");
    playlist("5", `Lalkara`, "Diljit Dosanjh");
    playlist("6", `Lemonade`, "Diljit Dosanjh");
    playlist("7", `Magic`, "Diljit Dosanjh");
    playlist("8", `Naina`, "Diljit Dosanjh");
    playlist("9", `Peaches`, "Diljit Dosanjh");
  }

}


play.addEventListener("click", () => {

  if (currentsong.paused) {
    currentsong.play()
    play.children[0].src = "seekbarpause.svg"
  }
  else {
    currentsong.pause()
    play.children[0].src = "seekbarplay.svg"

  }
}
)

// listen for time update event 
currentsong.addEventListener("timeupdate", () => {

  songtime.innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}`
  songduration.innerHTML = `${secondsToMinutesSeconds(currentsong.duration)}`
  document.querySelector(".circle").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%"
}
)

document.querySelector(".hiddenoffset").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

  document.querySelector(".circle").style.width = percent + "%";
  currentsong.currentTime = ((currentsong.duration) * percent) / 100;
}
)
volumetweek.addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

  if (currentsong.volume > 0) {
    currentsong.volume = 0;
    document.querySelector(".circle2").style.width = 0;
    volumetweek.src = "mute.svg"
  } else {
    volumetweek.src = "volumemax.svg";
    currentsong.volume = 1;
    document.querySelector(".circle2").style.width = "100%";
  }
}
)
document.querySelector(".hiddenoffset2").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle2").style.width = percent + "%";
  currentsong.volume = (e.offsetX / e.target.getBoundingClientRect().width)
  if (percent == 0) {
    volumetweek.src = "mute.svg"
  }
  else if ((percent / 100) > 0 && (percent / 100) <= 0.3) {
    volumetweek.src = "volumelow.svg"
  }
  else if ((percent / 100) > 0.3 && (percent / 100) <= 0.7) {
    volumetweek.src = "volumemedium.svg"
  }
  else {
    volumetweek.src = "volumemax.svg"
  }
}
)


