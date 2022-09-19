import React, { useState, useEffect } from "react";
import "./App.css";

// function component
const AnimatedCard = ({ animation, digit }) => {
  return (
    <div className={`flipCard ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

// function component
const StaticCard = ({ position, digit }) => {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

// function component
const FlipUnitContainer = ({ digit, shuffle, unit }) => {
  // assign digit values
  let currentDigit = digit;
  let previousDigit = digit - 1;

  // to prevent a negative value
  if (unit !== "hours") {
    previousDigit = previousDigit === -1 ? 59 : previousDigit;
  } else {
    previousDigit = previousDigit === -1 ? 23 : previousDigit;
  }

  // add zero
  if (currentDigit < 10) {
    currentDigit = `0${currentDigit}`;
  }
  if (previousDigit < 10) {
    previousDigit = `0${previousDigit}`;
  }

  // shuffle digits
  const digit1 = shuffle ? previousDigit : currentDigit;
  const digit2 = !shuffle ? previousDigit : currentDigit;

  // shuffle animations
  const animation1 = shuffle ? "fold" : "unfold";
  const animation2 = !shuffle ? "fold" : "unfold";

  return (
    <div className={"flipUnitContainer"}>
      <StaticCard position={"upperCard"} digit={currentDigit} />
      <StaticCard position={"lowerCard"} digit={previousDigit} />
      <AnimatedCard digit={digit1} animation={animation1} />
      <AnimatedCard digit={digit2} animation={animation2} />
    </div>
  );
};

// class component
class FlipClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 0,
      minutesShuffle: true,
      seconds: 0,
      secondsShuffle: true,
      milliseconds: 0,
      millisecondsShuffle: true,
    };
    this.updateTime = this.updateTime.bind(this);
  }

  componentDidMount() {
    this.updateTime();
  }

  updateTime() {
    // get new date
    const time = new Date(this.props.time);

    // set time units
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // on minute chanage, update minutes and shuffle state
    if (minutes !== this.state.minutes) {
      const minutesShuffle = !this.state.minutesShuffle;
      this.setState({
        minutes,
        minutesShuffle,
      });
    }
    // on second chanage, update seconds and shuffle state
    if (seconds !== this.state.seconds) {
      const secondsShuffle = !this.state.secondsShuffle;
      this.setState({
        seconds,
        secondsShuffle,
      });
    }
    // on minute chanage, update minutes and shuffle state
    if (milliseconds !== this.state.milliseconds) {
      const millisecondsShuffle = !this.state.millisecondsShuffle;
      this.setState({
        milliseconds,
        millisecondsShuffle,
      });
    }
  }

  render() {
    // state object destructuring
    const {
      minutes,
      seconds,
      milliseconds,
      minutesShuffle,
      secondsShuffle,
      millisecondsShuffle,
    } = this.state;

    return (
      <div className={"flipClock"}>
        <FlipUnitContainer
          unit={"minutes"}
          digit={minutes}
          shuffle={minutesShuffle}
        />
        <div>:</div>
        <FlipUnitContainer
          unit={"seconds"}
          digit={seconds}
          shuffle={secondsShuffle}
        />
        <div>:</div>
        <FlipUnitContainer
          unit={"milliseconds"}
          digit={milliseconds}
          shuffle={millisecondsShuffle}
        />
      </div>
    );
  }
}

class Record extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="my-3">
        <div className="d-flex justify-content-between">
          <h2 className="ml-3 text-white fw-bold">
            {this.props.index === 0
              ? `🥇 ${this.props.index + 1}등 ${this.props.name}`
              : this.props.index === 1
              ? `🥈 ${this.props.index + 1}등 ${this.props.name}`
              : this.props.index === 2
              ? `🥉 ${this.props.index + 1}등 ${this.props.name}`
              : `${this.props.index + 1}등 ${this.props.name}`}
          </h2>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => this.props.handleDelete()}
            >
              ❌
            </button>
          </div>
        </div>
        <FlipClock time={this.props.time} />
      </div>
    );
  }
}

function App() {
  const LOCAL_STORAGE_RECORDS = "LOCAL_STORAGE_RECORDS";

  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const recordsFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_RECORDS);
    if (recordsFromLocalStorage) {
      const parsedRecords = JSON.parse(recordsFromLocalStorage);
      const sortedParsedRecords = parsedRecords.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });
      console.log(parsedRecords);
      console.log(sortedParsedRecords);
      setRecords(sortedParsedRecords);
    }
  }, []);

  const handleClick = (event) => {
    event.preventDefault();

    let newTime = new Date(10000);
    console.log(minutes, seconds, milliseconds);
    newTime.setHours(1);
    newTime.setMinutes(minutes);
    newTime.setSeconds(seconds);
    newTime.setMilliseconds(milliseconds);
    console.log(minutes, seconds, milliseconds);

    const newRecord = { name, time: newTime.toISOString() };
    console.log(newRecord);
    const newRecords = [...records, newRecord];
    const sortedNewRecords = newRecords.sort((a, b) => {
      return new Date(a.time) - new Date(b.time);
    });

    localStorage.setItem(
      LOCAL_STORAGE_RECORDS,
      JSON.stringify(sortedNewRecords)
    );
    console.log(sortedNewRecords);
    setName("");
    setMinutes(0);
    setSeconds(0);
    setMilliseconds(0);

    window.location.reload();
  };

  const handleDelete = (targetIndex) => {
    console.log(targetIndex);
    console.log(records[targetIndex]);
    const filteredRecords = records.filter(
      (item, index) => index !== targetIndex
    );

    localStorage.setItem(
      LOCAL_STORAGE_RECORDS,
      JSON.stringify(filteredRecords)
    );
    window.location.reload();
  };

  return (
    <div className="App d-flex flex-column justify-content-center d-flex align-items-center">
      {/* Add New Score Modal */}
      <div class="d-grid gap-2 mt-3 mb-5">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          New Record
        </button>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                New Record
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="minutes" className="form-label">
                    Minutes
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="59"
                    step="1"
                    id="minutes"
                    name="minutes"
                    onChange={(e) => {
                      setMinutes(e.target.value);
                    }}
                    value={minutes}
                    required
                  />
                  <div>{minutes}</div>
                </div>
                <div>
                  <label htmlFor="seconds" className="form-label">
                    Seconds
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="59"
                    step="1"
                    id="seconds"
                    name="seconds"
                    onChange={(e) => {
                      setSeconds(e.target.value);
                    }}
                    value={seconds}
                    required
                  />
                  <div>{seconds}</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="milliseconds" className="form-label">
                    Milliseconds
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="999"
                    step="1"
                    id="milliseconds"
                    name="milliseconds"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setMilliseconds(e.target.value);
                    }}
                    value={milliseconds}
                    required
                  />
                  <div>{milliseconds}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setName("");
                  setMinutes(0);
                  setSeconds(0);
                  setMilliseconds(0);
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleClick}
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {records.map((record, index) => {
        console.log(index, record);
        return (
          <Record
            key={index}
            index={index}
            name={record.name}
            time={record.time}
            handleDelete={() => handleDelete(index)}
          />
        );
      })}
    </div>
  );
}

export default App;
