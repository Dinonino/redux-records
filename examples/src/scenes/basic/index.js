import React from 'react';
import { compose } from 'redux';
import { dataContainer } from 'redux-records';
import { Field, reduxForm } from 'redux-form';
import {
  Button, Form, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table,
} from 'semantic-ui-react';

const basicScreen = (props) => {
  const { handleSubmit } = props;
  return (

    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="email">Email</label>
        <Field name="email" component="input" type="email" />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default compose(
  dataContainer({ dataKey: 'USERS', dataID: 'id' }),
  reduxForm({ form: 'Users' }),
)(basicScreen);
