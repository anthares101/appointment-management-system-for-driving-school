import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { Query } from "react-apollo";

import NewButton from "../lib/NewButton";
import Table from "./Table";
import { GET_CARS } from "./queries";

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
      <Query query={GET_CARS}>
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

          let { cars } = data;

          return (
            <div className="dashboard-main-wrapper">
              <NewButton
                {...this.props}
                route={"/new-car"}
                text="Nuevo vehículo"
              />

              <Table
                cars={cars}
                rowClickHandler={(car) => {
                  let { id } = car;
                  // console.log(this.props);
                  this.props.history.push("/cars/" + id);
                }}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}
