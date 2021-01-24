import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import moment from "moment";

export default class extends Component {
  constructor() {
    super();
  }

  render() {
    // return <div>Under construction</div>

    return (
      <ApolloConsumer>
        {(client) => {
          return (
            <div className="selection-area">
              <a
                href="#"
                className="main-button-color"
                onClick={() => {
                  // set the global date to be today
                  let today = moment().format("L");
                  // console.log(today);
                  client.writeData({
                    data: {
                      currentDateSelection: today,
                      isAppointmentByDateTableLoading: true,
                    },
                  });
                }}
              >
                Hoy
              </a>
              <a
                href="#"
                className="main-button-color"
                onClick={() => {
                  // set the global date to be today
                  let today = moment().add(1, "day").format("L");
                  // console.log(today);
                  client.writeData({
                    data: {
                      currentDateSelection: today,
                      isAppointmentByDateTableLoading: true,
                    },
                  });
                }}
              >
                Mañana
              </a>
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}
