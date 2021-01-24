import React, { Component } from 'react';
import { MdClose } from 'react-icons/lib/md';
import { Query, Mutation, ApolloConsumer } from "react-apollo";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Form, Checkbox, Loader } from 'semantic-ui-react'

import { CREATE_STUDENT, UPDATE_STUDENT, GET_STUDENT, GET_STUDENTS, refetchGetStudentsQuery } from './queries';
import gql from "graphql-tag";
import LoadingSaveButton from '../../LoadingSaveButton';

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: "",
      call: false,
      discontinue: false,
      dob: "",
      dobError: false,
      firstDay: "",
      firstDayError: false,
      phone: "",
      name: "",
      nameError: false,
      learnerPermitNo: "",
      learnerPermitExp: "",
      learnerPermitExpError: false,
      notes: "",
      gender: "",
      zip: ""
    };
    // console.log(props.student);
  }

  handleFieldChange = (e) => {
    // console.log(e.target.type);
    let { name, value } = e.target;
    // console.log(name);
    // console.log(value);
    this.setState({ [name]: value });
  }

  validate = () => {
    let pass = true;
    if (this.state.name == "") {
      this.setState({ nameError: true });
      pass = false;
    }

    var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/

    if (this.state.firstDay && !this.state.firstDay.match(dateReg)) {
      this.setState({ firstDayError: true });
      pass = false;
    }
    if (this.state.learnerPermitExp && !this.state.learnerPermitExp.match(dateReg)) {
      this.setState({ learnerPermitExpError: true });
      pass = false;
    }
    if (this.state.dob && !this.state.dob.match(dateReg)) {
      this.setState({ dobError: true });
      pass = false;
    }

    return pass;
  }

  render() {

    return (
      <ApolloConsumer>
        {client => (<div className="modal">
          <div className="edit-modal-wrapper">
            <header>
              <h1>Nuevo alumno</h1>
              <div><a href="" onClick={(e) => {
                if (e) e.preventDefault();
                this.props.history.goBack()
              }}><MdClose className="close" /></a></div>
            </header>
            <div className="content">
              <main>
                <Form
                  autoComplete={"off"}
                >
                  <Form.Input
                    label='Nombre *'
                    control='input'
                    name="name"
                    value={this.state.name}
                    width={15}
                    onChange={this.handleFieldChange}
                    error={this.state.nameError}
                  />
                  <Form.Group>
                    <Form.Input label="Primer día (mm/dd/aaaa)" width={5} name="firstDay" value={this.state.firstDay}
                      onChange={this.handleFieldChange} autoComplete="first day"
                      error={this.state.firstDayError}
                    />
                    <Form.Input label="Género" width={5} name="gender" value={this.state.gender}
                      onChange={this.handleFieldChange} autoComplete="gender" />
                    <Form.Input label="Nacimiento (mm/dd/aaaa)" width={5} name="dob" value={this.state.dob}
                      onChange={this.handleFieldChange} autoComplete="dob"
                      error={this.state.dobError}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Input label="¿Carnet de conducir?" width={5} name="learnerPermitNo"
                      value={this.state.learnerPermitNo} onChange={this.handleFieldChange}
                      autoComplete="learnerPermitNo" />
                    <Form.Input label="Último día (mm/dd/yyyy)" width={5} name="learnerPermitExp"
                      value={this.state.learnerPermitExp} onChange={this.handleFieldChange}
                      autoComplete="learnerPermitExp"
                      error={this.state.learnerPermitExpError}
                    />
                    <Form.Input label="Teléfono" width={5} name="phone" value={this.state.phone}
                      onChange={this.handleFieldChange} autoComplete="phone" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Input label="Dirección" width={10} name="address" value={this.state.address}
                      onChange={this.handleFieldChange} autoComplete="new-user-address" />
                    <Form.Input label="Código postal" width={5} name="zip" value={this.state.zip}
                      onChange={this.handleFieldChange} autoComplete="zip" />
                  </Form.Group>
                  <Form.Field>
                    <Checkbox label='Ex-alumno' name="discontinue" checked={this.state.discontinue} onChange={() => {
                      // toggle discontinue
                      this.setState({ discontinue: !this.state.discontinue })
                    }} />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox label='Llamar' name="call" checked={this.state.call} onChange={this.handleFieldChange}
                      onChange={() => {
                        // toggle discontinue
                        this.setState({ call: !this.state.call })
                      }} />
                  </Form.Field>
                </Form>
              </main>
              <aside>
                <Form>
                  <Form.TextArea label='Notas' name="notes" value={this.state.notes} onChange={this.handleFieldChange}
                    autoComplete="notes" />
                </Form>
              </aside>
            </div>
            <footer>
              <a href="" className="cancel" onClick={(e) => {
                if (e) e.preventDefault();
                this.props.history.goBack();
              }}>Cancelar</a>

              {/*save button*/}

              <Mutation
                mutation={CREATE_STUDENT}
              >
                {(createStudent, { data, loading, error }) => {

                  // console.log(data);
                  if (loading) return <LoadingSaveButton />;

                  // if mutation is successful, go back to previous page
                  if (data) {
                    this.props.history.goBack();
                  }

                  return (
                    <a href="" className="save" onClick={async (e) => {
                      e.preventDefault();

                      if (!this.validate()) return;

                      // remove extra fields
                      let {
                        nameError,
                        dobError,
                        learnerPermitExpError,
                        firstDayError,
                        ...vars
                      } = this.state;

                      // console.log(this.state);
                      await createStudent({ variables: { studentInput: vars } });

                      // refetch student table data
                      await client.mutate({
                        mutation: gql`
                              mutation {
                                  refetchStudentTableData @client
                              }
                            `
                      })

                    }}>{
                        error ? "Error, intentalo otra vez" : "Guardar"
                      }</a>
                  )
                }}
              </Mutation>

            </footer>
          </div>
        </div>)}
      </ApolloConsumer>
    )

  }
}