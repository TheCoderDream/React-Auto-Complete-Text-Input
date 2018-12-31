import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {languageList} from './languageList';
import AutoCompleteText from "./auto-complete/AutoCompleteText";

class App extends Component {

  render() {
      const suggestionData = [];

      for (let languageCode in languageList) {
          if (languageList[languageCode]) {
              suggestionData.push(languageList[languageCode].name);
          }
      }


    return (
      <div className="container mt-5">
        <div className={'col-6 m-auto'}>
            <AutoCompleteText data={suggestionData} minChars={2}/>
        </div>
      </div>
    );
  }
}

export default App;
