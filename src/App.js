import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import faker from 'faker';
import AppBar from './components/AppBar';

const notes = Array
  .apply(null, Array(100))
  .map((_, i) => {
    return {
      id: i,
      title: faker.commerce.productName(),
      body: faker.lorem.paragraphs(3)
    }
  })

class App extends Component {

  state = {
    addPage: false
  }

  render(){
    return(
      <Fragment>
        <AppBar/>
      </Fragment>
    );
  }
}

App.propTypes = {}

export default App;