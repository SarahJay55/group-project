import React, { Component } from 'react';
import './TimeCard.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import axios from 'axios';
import NavBar from './../NavBar/NavBar'
import { connect } from 'react-redux';
import { getUserInfo } from './../../ducks/reducer.js'

class TimeCard extends Component {
  constructor() {
    super()
    this.state = {
      timecard: []
    }
  }
  componentDidMount(id) {
    axios.get(`/api/employee/get_timecard/${this.props.user.id}`).then(response => {
        this.setState({
            timecard: response.data
        })
    })
  }
  render() {
    const timecardDisplayed = this.state.timecard.map((timecard, i) => {
      return (

        <TableRow key={i}>
          <TableRowColumn>{timecard.clock_in}</TableRowColumn>
          <TableRowColumn>{timecard.clock_out}</TableRowColumn>
          <TableRowColumn>{timecard.total_hours}</TableRowColumn>
        </TableRow>

      )
    })
    console.log(timecardDisplayed)
    return (
      <div>
        <NavBar />
        <div className='timecard_background'>
          <div className='whitespace'></div>
          <div className='timecard_container'>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn colSpan="3">TIMECARD</TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>Clock In</TableHeaderColumn>
                  <TableHeaderColumn>Clock Out</TableHeaderColumn>
                  <TableHeaderColumn>Total Hours</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {timecardDisplayed}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProp(state) {
  return {
      user: state.user
  }
}
export default connect(mapStateToProp, { getUserInfo })(TimeCard);