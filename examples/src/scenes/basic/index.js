import React from 'react';
import { compose } from 'redux';
import { dataContainer } from 'redux-records';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';

const basicScreen = (props) => {
  const { handleSubmit, updateAction, data } = props;
  return (

    <Form onSubmit={handleSubmit(updateAction)}>
      <Form.Field>
        <label htmlFor="firstName">First Name</label>
        <Field id="firstName" name="firstName" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="lastName">Last Name</label>
        <Field id="lastName" name="lastName" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="country">Country</label>
        <Field id="country" name="country" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="state">State</label>
        <Field id="state" name="state" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="address">Address</label>
        <Field id="address" name="address" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="address2">Address 2</label>
        <Field id="address2" name="address2" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="email">Email</label>
        <Field id="email" name="email" component="input" type="email" />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default compose(
  dataContainer({ dataKey: 'USERS', dataID: 'id', mapaStateToProps: (state, data, dataState) => ({ initialValues: data && Object.keys(data).length ? data : undefined }) }),
  reduxForm({ form: 'Users', enableReinitialize: true }),
)(basicScreen);
