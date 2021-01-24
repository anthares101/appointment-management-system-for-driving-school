import React, { Component } from "react";

// table
import ReactTable from "react-table";
import "react-table/react-table.css";

import { caseInsensitiveFilter, calcPageSize } from "../Utils";

export default class extends Component {
  constructor() {
    super();

    let pageSize = calcPageSize();

    this.state = {
      pageSize,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({ pageSize: calcPageSize() });
  }

  render() {
    let { cars, rowClickHandler } = this.props;
    let { pageSize } = this.state;

    return (
      <ReactTable
        rowsText="filas"
        nextText="Siguiente"
        previousText="Anterior"
        pageText="Página"
        ofText="de"
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            onClick: (e, handleOriginal) => {
              let car = rowInfo.original;
              rowClickHandler(car);
            },
          };
        }}
        columns={[
          {
            Header: "Nombre",
            accessor: "no",
            filterMethod: caseInsensitiveFilter,
            width: "100%",
          },
        ]}
        data={cars}
        filterable
        pageSize={pageSize}
        sortable={false}
        className="-striped -highlight main-table"
      />
    );
  }
}
