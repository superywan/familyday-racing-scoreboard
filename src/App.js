import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from "./logo.png";
import "./App.css";

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement("style");

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement("link");

      newLinkEl.rel = "stylesheet";
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

class MyWindowPortal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerEl = document.createElement("div"); // STEP 1: create an empty div
    this.externalWindow = null;
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    this.externalWindow = window.open(
      "",
      "",
      "width=600,height=650,left=200,top=200"
    );

    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    this.externalWindow.document.body.appendChild(this.containerEl);

    this.externalWindow.document.title = "A React portal window";
    copyStyles(document, this.externalWindow.document);

    // update the state in the parent component if the user closes the
    // new window
    // this.externalWindow.addEventListener("beforeunload", () => {
    //   this.props.closeWindowPortal();
    // });
  }

  componentWillUnmount() {
    // This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by just closing the window
    this.externalWindow.close();
  }

  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

class Record extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="card my-3 py-2 px-3 mb-5 bg-body rounded"
        style={{
          boxShadow:
            this.props.index === 0
              ? "0 .5rem 1rem rgba(255, 255, 0, 0.5)"
              : this.props.index === 1
              ? "0 .8rem 1.5rem #C0C0C0"
              : this.props.index === 2
              ? "0 .5rem 1rem #b87333"
              : "",
        }}
      >
        <div className="card-body" style={{ width: "30rem" }}>
          <div
            className="card-title fs-3 fw-normal"
            onClick={() => this.props.handleDelete()}
          >
            {this.props.index === 0
              ? `???? ${this.props.index + 1}??? ${this.props.name}`
              : this.props.index === 1
              ? `???? ${this.props.index + 1}??? ${this.props.name}`
              : this.props.index === 2
              ? `???? ${this.props.index + 1}??? ${this.props.name}`
              : `${this.props.index + 1}??? ${this.props.name}`}
          </div>
          <div className="card-text fs-1 fw-semibold text-center">
            {`${new Date(this.props.time).getMinutes()}`.padStart(2, "0")}:
            {`${new Date(this.props.time).getSeconds()}`.padStart(2, "0")}:
            {`${new Date(this.props.time).getMilliseconds()}`.padStart(2, "0")}
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  const LOCAL_STORAGE_BROTHER_RECORDS = "LOCAL_STORAGE_BROTHER_RECORDS";
  const LOCAL_STORAGE_SISTER_RECORDS = "LOCAL_STORAGE_SISTER_RECORDS";
  const LOCAL_STORAGE_IS_OPEN = "LOCAL_STORAGE_IS_OPEN";

  const [name, setName] = useState("");
  const [gender, setGender] = useState("BROTHER");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [brotherRecords, setBrotherRecords] = useState([]);
  const [sisterRecords, setSisterRecords] = useState([]);
  const [isWindowPortalOpen, setIsWindowPortalOpen] = useState(false);

  useEffect(() => {
    const brotherRecordsFromLocalStorage = localStorage.getItem(
      LOCAL_STORAGE_BROTHER_RECORDS
    );
    if (brotherRecordsFromLocalStorage) {
      const parsedRecords = JSON.parse(brotherRecordsFromLocalStorage);
      const sortedParsedRecords = parsedRecords.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });
      console.log(parsedRecords);
      console.log(sortedParsedRecords);
      setBrotherRecords(sortedParsedRecords);
    }

    const sisterRecordsFromLocalStorage = localStorage.getItem(
      LOCAL_STORAGE_SISTER_RECORDS
    );
    if (sisterRecordsFromLocalStorage) {
      const parsedRecords = JSON.parse(sisterRecordsFromLocalStorage);
      const sortedParsedRecords = parsedRecords.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });
      console.log(parsedRecords);
      console.log(sortedParsedRecords);
      setSisterRecords(sortedParsedRecords);
    }

    // const isOpenFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_IS_OPEN);
    // if (isOpenFromLocalStorage) {
    //   const parsedIsWindowPortalOpen = JSON.parse(isOpenFromLocalStorage);
    //   setRecords(parsedIsWindowPortalOpen);
    // }
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

    let newRecords;
    if (gender === "BROTHER") {
      newRecords = [...brotherRecords, newRecord];
      const sortedNewBrotherRecords = newRecords.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      localStorage.setItem(
        LOCAL_STORAGE_BROTHER_RECORDS,
        JSON.stringify(sortedNewBrotherRecords)
      );
      setBrotherRecords(sortedNewBrotherRecords);
    } else {
      newRecords = [...sisterRecords, newRecord];
      const sortedNewSisterRecords = newRecords.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      localStorage.setItem(
        LOCAL_STORAGE_SISTER_RECORDS,
        JSON.stringify(sortedNewSisterRecords)
      );
      setSisterRecords(sortedNewSisterRecords);
    }

    setName("");
    setGender("BROTHER");
    setMinutes(0);
    setSeconds(0);
    setMilliseconds(0);
  };

  const handleDelete = (targetIndex, gender) => {
    if (gender === "BROTHER") {
      const filteredBrotherRecords = brotherRecords.filter(
        (item, index) => index !== targetIndex
      );
      localStorage.setItem(
        LOCAL_STORAGE_BROTHER_RECORDS,
        JSON.stringify(filteredBrotherRecords)
      );

      setBrotherRecords(filteredBrotherRecords);
    } else {
      const filteredSisterRecords = sisterRecords.filter(
        (item, index) => index !== targetIndex
      );
      localStorage.setItem(
        LOCAL_STORAGE_SISTER_RECORDS,
        JSON.stringify(filteredSisterRecords)
      );

      setSisterRecords(filteredSisterRecords);
    }
  };

  const toggleWindowPortal = () => {
    localStorage.setItem(
      LOCAL_STORAGE_IS_OPEN,
      JSON.stringify(!isWindowPortalOpen)
    );
    setIsWindowPortalOpen(!isWindowPortalOpen);
  };

  return (
    <div className="App d-flex flex-column justify-content-center d-flex align-items-center">
      <div className="d-flex align-items-center">
        <img
          src={logo}
          class="img-fluid"
          alt="main-logo"
          style={{ width: "300px" }}
          onClick={toggleWindowPortal}
        />
        <div
          className="display-3 fw-bold"
          style={{ marginLeft: "-40px", marginRight: "40px" }}
        >
          BEST LAP
        </div>
      </div>

      {isWindowPortalOpen && (
        <MyWindowPortal>
          <div className="container my-5">
            <div className="">
              <div className="">
                <h2 className="fw-bold" id="exampleModalLabel">
                  ????????? ????????? ??????
                </h2>
              </div>
              <div className="modal-body">
                <div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      ?????? Name
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
                    <label htmlFor="gender" className="form-label">
                      ?????? Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-select"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      value={gender}
                      required
                    >
                      <option value="BROTHER">??????</option>
                      <option value="SISTER">??????</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="minutes" className="form-label">
                      ??? Minutes
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="10"
                      step="1"
                      id="minutes"
                      name="minutes"
                      onChange={(e) => {
                        setMinutes(e.target.value);
                      }}
                      value={minutes}
                    />
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="10"
                      id="minutes"
                      name="minutes"
                      onChange={(e) => {
                        setMinutes(e.target.value);
                      }}
                      value={minutes}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="seconds" className="form-label">
                      ??? Seconds
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
                    />
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="59"
                      id="seconds"
                      name="seconds"
                      onChange={(e) => {
                        setSeconds(e.target.value);
                      }}
                      value={seconds}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="milliseconds" className="form-label">
                      ??????????????? Milliseconds
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="99"
                      step="1"
                      id="milliseconds"
                      name="milliseconds"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setMilliseconds(e.target.value);
                      }}
                      value={milliseconds}
                    />
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="99"
                      id="milliseconds"
                      name="milliseconds"
                      onChange={(e) => {
                        setMilliseconds(e.target.value);
                      }}
                      value={milliseconds}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setName("");
                      setGender("BROTHER");
                      setMinutes(0);
                      setSeconds(0);
                      setMilliseconds(0);
                      setIsWindowPortalOpen(false);
                    }}
                  >
                    Close
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleClick}
                    data-bs-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MyWindowPortal>
      )}

      <div className="d-flex justify-content-between">
        <div style={{ marginRight: "100px" }}>
          <div className="fs-3 text-center fw-bold pb-4">?????? Brother ????????</div>
          {brotherRecords.map((record, index) => {
            console.log(`BRO : ${record.name} (${record.time})`);
            return (
              <Record
                key={`${index}${record.time}`}
                index={index}
                name={record.name}
                time={record.time}
                handleDelete={() => handleDelete(index, "BROTHER")}
              />
            );
          })}
        </div>

        <div style={{ marginLeft: "100px" }}>
          <div className="fs-3 text-center fw-bold pb-4">?????? Sister ????????</div>
          {sisterRecords.map((record, index) => {
            console.log(`SIS : ${record.name} (${record.time})`);
            return (
              <Record
                key={`${index}${record.time}`}
                index={index}
                name={record.name}
                time={record.time}
                handleDelete={() => handleDelete(index, "SISTER")}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
