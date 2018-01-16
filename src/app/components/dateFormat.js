import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';


class DateFormat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: moment(),
      title: props.schema.title,
      required: props.required ? '*' : '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return(

      <div className="row">
        <div className="col-sm-12 ">
          <label className="control-label gmap-label">
            {this.state.title} {this.state.required}
          </label>

          <DatePicker
            selected={this.state.startDate}
            className="form-control datepicker"
            maxDate={moment()}
            minDate={moment().subtract(100, "years")}
            onChange={this.handleChange}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            withPortal
          />

        </div>
      </div>



  );
  }
}
export default DateFormat;
