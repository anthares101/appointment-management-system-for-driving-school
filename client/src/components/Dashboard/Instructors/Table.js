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
    let { rowClickHandler } = this.props;
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
              let item = rowInfo.original;
              rowClickHandler(item);
            },
          };
        }}
        columns={[
          {
            Header: "Nombre",
            accessor: "name",
            filterMethod: caseInsensitiveFilter,
            width: "100%",
          },
        ]}
        data={this.props.items}
        filterable
        pageSize={pageSize}
        sortable={false}
        className="-striped -highlight main-table"
      />
    );
  }
}
