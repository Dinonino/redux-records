import React from 'react';
import { compose } from 'redux';
import { dataContainer } from 'redux-records';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Menu, Dropdown, Icon } from 'semantic-ui-react';

const basicScreen = (props) => {
  const {
    handleSubmit, USERS: { data = {} } = {}, USERS_Actions: {
      updateAction, undoAction, redoAction, discardAction, updateSyncAction
    } = {},
  } = props;
  return (
    <div>
      <Menu attached="top">

        <Menu.Item icon="save" onClick={handleSubmit(entity => updateSyncAction({ ...data, ...entity }))} />
        <Menu.Item icon="pencil square" onClick={handleSubmit(entity => updateAction({ ...data, ...entity }))} />
        <Menu.Item icon="undo" onClick={() => undoAction(data)} />
        <Menu.Item icon="repeat" onClick={() => redoAction(data)} />
        <Menu.Item icon="remove" onClick={() => discardAction(data)} />

      </Menu>

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
    </div>
  );
};

export default compose(
  dataContainer(
    {
      dataKey: 'USERS',
      dataID: 'id',
      ID: ({ match: { params: { id } = {} } = {} }) => id,
    },
    (state, { USERS: { data } = {} }) =>
      ({ initialValues: data && !data.length && Object.keys(data).length ? data : undefined }),
  ),
  reduxForm({ form: 'Users', enableReinitialize: true }),
)(basicScreen);
