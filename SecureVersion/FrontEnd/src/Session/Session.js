import React from "react"


class SessionStorage extends React.Component{
  constructor(props){
    super(props);
  }

  set(obj){
    Object.keys(obj).forEach(key =>{
        if(key == "is_admin"){
          obj[key] = obj[key] == true ? 1 : 0;
        }
        localStorage.setItem(key,obj[key]);
      }
    )
  }

  get(key){
    return localStorage.getItem(key);
  }

  clear(){
    localStorage.clear();
  }
}

const Session = new SessionStorage()
export default Session;