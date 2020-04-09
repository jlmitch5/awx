import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { mountWithContexts, waitForElement } from '@testUtils/enzymeHelpers';
import { CredentialsAPI } from '@api';
import { Formik } from 'formik';

import WebhookSubForm from './WebhookSubForm';

jest.mock('@api');

describe('<WebhooksSubForm />', () => {
  let wrapper;
  let history;
  beforeEach(async () => {
    history = createMemoryHistory({
      initialEntries: ['templates/job_template/51/edit'],
    });
    CredentialsAPI.read.mockResolvedValue({
      data: { results: [{ id: 12, name: 'Github credential' }] },
    });
    await act(async () => {
      wrapper = mountWithContexts(
        <Route path="templates/job_template/:id/edit">
          <Formik
            initialValues={{
              webhook_url: '/api/v2/job_templates/51/github/',
              webhook_credential: { id: 1, name: 'Github credential' },
              webhook_service: 'github',
              webhook_key: 'webhook key',
            }}
          >
            <WebhookSubForm enableWebhooks />
          </Formik>
        </Route>,
        {
          context: {
            router: {
              history,
              route: {
                location: history.location,
                match: { params: { id: 51 } },
              },
            },
          },
        }
      );
    });
  });
  test('mounts properly', () => {
    expect(wrapper.length).toBe(1);
  });
  test('should render initial values properly', () => {
    waitForElement(wrapper, 'Lookup__ChipHolder', el => el.lenth > 0);
    expect(wrapper.find('AnsibleSelect').prop('value')).toBe('github');
    expect(
      wrapper.find('TextInputBase[aria-label="Webhook URL"]').prop('value')
    ).toContain('/api/v2/job_templates/51/github/');
    expect(
      wrapper.find('TextInputBase[aria-label="wfjt-webhook-key"]').prop('value')
    ).toBe('webhook key');
    expect(
      wrapper
        .find('Chip')
        .find('span')
        .text()
    ).toBe('Github credential');
  });
  test('should make other credential type available', async () => {
    CredentialsAPI.read.mockResolvedValue({
      data: { results: [{ id: 13, name: 'GitLab credential' }] },
    });
    await act(async () =>
      wrapper.find('AnsibleSelect').prop('onChange')({}, 'gitlab')
    );
    expect(CredentialsAPI.read).toHaveBeenCalledWith({
      namespace: 'gitlab_token',
    });
    wrapper.update();
    expect(
      wrapper.find('TextInputBase[aria-label="Webhook URL"]').prop('value')
    ).toContain('/api/v2/job_templates/51/gitlab/');
    expect(
      wrapper.find('TextInputBase[aria-label="wfjt-webhook-key"]').prop('value')
    ).toBe('A NEW WEBHOOK KEY WILL BE GENERATED ON SAVE.');
  });
});
