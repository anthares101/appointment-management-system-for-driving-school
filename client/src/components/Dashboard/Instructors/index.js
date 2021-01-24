import React, { Component } from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import { Query } from "react-apollo";

import NewButton from "../lib/NewButton";
import Table from "./Table";

import { GET_INSTRUCTORS } from "./queries";

export default class extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true,
    };
  }

  render() {
    const { data, pages, loading } = this.state;

    return (
      <Query query={GET_INSTRUCTORS}>
        {({ loading, error, data }) => {
          // console.log(data);
          // return <div>Under construction</div>

          if (loading) {
            return (
              <div className="loading">
                <Loader size="huge" active>
                  Cargando
                </Loader>
              </div>
            );
          }

          let { allInstructors } = data;

          return (
            <div className="dashboard-main-wrapper">
              <NewButton
                {...this.props}
                route={"/new-instructor"}
                text="Nuevo profesor"
              />

              <Table
                items={allInstructors}
                rowClickHandler={(item) => {
                  let { id } = item;
                  // console.log(this.props);
                  this.props.history.push("/instructors/" + id);
                }}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}
