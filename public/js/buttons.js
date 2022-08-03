console.log('buttons.js loaded')

const buttons = document.getElementsByClassName("button")
for(let btn of buttons){
    btn.addEventListener("click", (event) => {
      let go_to_href = event.target.getAttribute("href");
      window.history.pushState({}, "", window.location);
      if (go_to_href && go_to_href !== "") window.location.replace(go_to_href);
    });
}
