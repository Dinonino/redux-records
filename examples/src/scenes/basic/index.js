import React from 'react';
import { compose } from 'redux';
import { dataContainer } from 'redux-records';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';

const basicScreen = (props) => {
  const { handleSubmit, updateAction } = props;
  return (

    <Form onSubmit={handleSubmit((entity) => { updateAction(entity); })}>
      <Form.Field>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="country">Country</label>
        <Field name="country" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="state">State</label>
        <Field name="state" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="address">Address</label>
        <Field name="address" component="input" type="text" />
      </Form.Field>
      <Form.Field>
        <label htmlFor="address2">Address 2</label>
        <Field name="address2" component="input" type="text" />
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
