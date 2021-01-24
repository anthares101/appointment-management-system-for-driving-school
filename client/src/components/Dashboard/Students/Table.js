import React, { Component } from "react";
import { Query } from "react-apollo";
import ReactTable from "react-table";
import "react-table/react-table.css";
import gql from "graphql-tag";

import { calcPageSize } from "../Utils";
import { GET_STUDENTS } from "./queries";
import { GET_APPOINTMENTS_BY_STUDENT } from "../Appointments/queries";

const GET_CURRENT_STUDENT_TABLE_DATA = gql`
  query {
    currentStudentTableData @client {
      pages
      page
      students {
        id
        phone
        name
        notes
        gender
      }
    }
    isCurrentStudentTableDataLoading @client
  }
`;

export default class extends Component {
  constructor() {
    super();

    this.state = {
      pageSize: calcPageSize(),
      lessonsCounter: [],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    this.setState({ pageSize: calcPageSize() });
  }

  updateLessonsCounter = async (students) => {
    let lessonsCounter = [];

    for (let index = 0; index < students.length; index++) {
      const appointments = await this.client.query({
        query: GET_APPOINTMENTS_BY_STUDENT,
        variables: {
          studentId: students[index].id,
        },
      });

      lessonsCounter.push({
        id: students[index].id,
        lessons: Object.keys(appointments.data.appointmentsByStudent).length,
      });
    }

    this.setState({ lessonsCounter: lessonsCounter });
  };

  fetchData = async (state, instance) => {
    // show loading

    this.client.writeData({
      data: {
        isCurrentStudentTableDataLoading: true,
      },
    });

    // query backend

    let queryVars = {
      page: state.page,
      pageSize: state.pageSize,
      filter: {
        filters: state.filtered,
      },
    };

    let res = await this.client.query({
      query: GET_STUDENTS,
      variables: queryVars,
    });

    await this.updateLessonsCounter(res.data.students.students);

    // write current page data to the global store

    let currentStudentTableData = {
      students: res.data.students.students,
      pages: res.data.students.pages,
      page: res.data.students.page,
    };

    this.client.writeData({
      data: {
        currentStudentTableData,
        isCurrentStudentTableDataLoading: false, // not loading
        lastStudentTableDataQueryParams: queryVars, // store the query in the global store for refetching later
      },
    });
  };

  render() {
    let { rowClickHandler } = this.props;

    return (
      <Query query={GET_CURRENT_STUDENT_TABLE_DATA} errorPolicy={"all"}>
        {({ data, client, error }) => {
          // console.log('error here:');
          // console.log(error);

          this.client = client;
          // console.log(client.cache.data);

          let { page, pages, students } = data.currentStudentTableData;
          let loading = data.isCurrentStudentTableDataLoading;

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
                    if (!rowInfo) return;
                    let item = rowInfo.original;
                    rowClickHandler(item);
                  },
                };
              }}
              columns={[
                {
                  Header: "Nombre",
                  accessor: "name",
                  width: "auto",
                },
                {
                  Header: "Teléfono",
                  accessor: "phone",
                  width: "auto",
                },
                {
                  id: "numberOfLessons",
                  Header: "Clases",
                  accessor: (d) => {
                    const counters = this.state.lessonsCounter.filter(
                      (counter) => d.id == counter.id
                    );

                    if (counters.length > 0) return counters[0].lessons;
                    else return "";
                  },
                  width: "auto",
                },
                {
                  Header: "Notas",
                  accessor: "notes",
                  width: "auto",
                },
              ]}
              manual
              data={students}
              pages={pages}
              loading={loading}
              onFetchData={this.fetchData}
              filterable
              sortable={false}
              pageSize={this.state.pageSize}
              className="-striped -highlight main-table"
            />
          );
        }}
      </Query>
    );
  }
}
