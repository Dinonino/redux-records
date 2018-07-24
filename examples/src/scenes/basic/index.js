import React from 'react';
import { compose } from 'redux';
import { Field, FormSection, reduxForm } from 'redux-form';
import { Button, Form, Menu, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { history } from '../../App';
import dataContainer from '../../components/datacontainer';
import CodeDoc from '../../components/codeDoc';

const code = `import React from 'react';
import { compose } from 'redux';
import { Field, FormSection, reduxForm } from 'redux-form';
import { Button, Form, Menu, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { history } from '../../App';
import dataContainer from '../../components/datacontainer';

const basicScreen = (props) => {
  const {
    handleSubmit,
    rr_data: {
      USERS: {
        data,

      } = {}
    } = {},
    rr_actions: {
      USERS: {
        updateAction,
        undoAction,
        redoAction,
        discardAction,
        updateSyncAction,
      } = {},
    } = {},
  } = props;
  return (
    <div>
      <Menu attached="top">

        <Menu.Item
          icon="save"
          onClick={handleSubmit(entity => updateSyncAction({ ...data, ...entity }))}
        />
        <Menu.Item
          icon="pencil square"
          onClick={handleSubmit(entity => updateAction({ ...data, ...entity }))}
        />
        <Menu.Item icon="undo" onClick={() => undoAction(data)} />
        <Menu.Item icon="repeat" onClick={() => redoAction(data)} />
        <Menu.Item icon="remove" onClick={() => discardAction(data)} />

      </Menu>

      <Form onSubmit={handleSubmit(updateAction)}>
        <Form.Field>
          <label htmlFor="name">Name</label>
          <Field id="name" name="name" component="input" type="text" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" component="input" type="text" />
        </Form.Field>
        <FormSection name="address">
          <Form.Field>
            <label htmlFor="city">City</label>
            <Field id="city" name="city" component="input" type="text" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="zipcode">Zipcode</label>
            <Field id="zipcode" name="zipcode" component="input" type="text" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="street">Street</label>
            <Field id="street" name="street" component="input" type="text" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="address2">Suite</label>
            <Field id="suite" name="suite" component="input" type="text" />
          </Form.Field>
        </FormSection>
        <Form.Field>
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" component="input" type="email" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="phone">Phone</label>
          <Field id="phone" name="phone" component="input" type="tel" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="website">Website</label>
          <Field id="website" name="website" component="input" type="url" />
        </Form.Field>
      </Form>
    </div>
  );
};

export default compose(
  withRouter,
  dataContainer(
    {
      dataKey: 'USERS',
      dataID: 'id',
      ID: ({ match: { params: { id } = {} } = {} }) => id,
      onIdUpdated: (prevId, newId) => { history.push(\`/redux-records/edit/\${newId}\`) },
      loadOnMount: true,
    },
    (state, { USERS: { data } = {} }) =>
      ({ initialValues: data && !data.length && Object.keys(data).length ? data : undefined }),
  ),
  reduxForm({ form: 'Users', enableReinitialize: true }),
)(basicScreen);
`
const basicScreen = (props) => {
  const {
    handleSubmit,
    rr_data: {
      USERS: {
        data,

      } = {}
    } = {},
    rr_actions: {
      USERS: {
        updateAction,
        undoAction,
        redoAction,
        discardAction,
        updateSyncAction,
      } = {},
    } = {},
  } = props;
  return (
    <div>
      <Menu attached="top">

        <Menu.Item
          icon="save"
          onClick={handleSubmit(entity => updateSyncAction({ ...data, ...entity }))}
        />
        <Menu.Item
          icon="pencil square"
          onClick={handleSubmit(entity => updateAction({ ...data, ...entity }))}
        />
        <Menu.Item icon="undo" onClick={() => undoAction(data)} />
        <Menu.Item icon="repeat" onClick={() => redoAction(data)} />
        <Menu.Item icon="remove" onClick={() => discardAction(data)} />

      </Menu>

      <Form onSubmit={handleSubmit(updateAction)}>
        <Form.Field>
          <label htmlFor="name">Name</label>
          <Field id="name" name="name" component="input" type="text" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" component="input" type="text" />
        </Form.Field>
        <FormSection name="address">
          <Form.Field>
            <label htmlFor="city">City</label>
            <Field id="city" name="city" component="input" type="text" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="zipcode">Zipcode</label>
            <Field id="zipcode" name="zipcode" component="input" type="text" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="street">Street</label>
            <Field id="street" name="street" component="input" type="text" />
          </Form.Field>
          <Form.Field>
            <label htmlFor="address2">Suite</label>
            <Field id="suite" name="suite" component="input" type="text" />
          </Form.Field>
        </FormSection>
        <Form.Field>
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" component="input" type="email" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="phone">Phone</label>
          <Field id="phone" name="phone" component="input" type="tel" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="website">Website</label>
          <Field id="website" name="website" component="input" type="url" />
        </Form.Field>
      </Form>
      <CodeDoc code={code} />
    </div>
  );
};

export default compose(
  withRouter,
  dataContainer(
    {
      dataKey: 'USERS',
      dataID: 'id',
      ID: ({ match: { params: { id } = {} } = {} }) => id,
      onIdUpdated: (prevId, newId) => { history.push(`/redux-records/edit/${newId}`) },
      loadOnMount: true,
    },
    (state, { USERS: { data } = {} }) =>
      ({ initialValues: data && !data.length && Object.keys(data).length ? data : undefined }),
  ),
  reduxForm({ form: 'Users', enableReinitialize: true }),
)(basicScreen);
