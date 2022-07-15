// localStorage.setItem("name","vivek")
localStorage.removeItem("name")
if(localStorage.getItem("name") == null ) {
    window.location.replace("http://localhost:8080/login")
}else{
    let name = prompt("confirm your name")
    if(localStorage.getItem("name") == "vivek"){
        window.location.replace("http://localhost:8080/selectGf")
    }
}
