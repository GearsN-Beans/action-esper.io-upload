import * as core from '@actions/core';
import { createReadStream } from 'fs';
import FormData from 'form-data';

async function run() {
  core.info("Authsignal Upload Version*****")
  core.debug(`Authsignal Version}`);
  try {
    if (process.env.DEBUG_ACTION === 'true') {
      core.debug('DEBUG FLAG DETECTED, SHORTCUTTING ACTION.');
      return;
    }

    const enterpriseId = core.getInput('enterpriseId');
    const apiKey = core.getInput('apiKey');
    const endpointName = core.getInput('endpointName');
    const filePath = core.getInput('filePath');

    const url = `https://${endpointName}-api.esper.cloud/api/enterprise/${enterpriseId}/application/upload`;
    core.debug(`Esper.io endpoint ${url}`);
    core.debug(`Preparing to upload @ ${filePath}`);

    const fileStream = createReadStream(filePath);
    const formData = new FormData();
    formData.append('app_file', fileStream);

    // https://api.esper.io/tag/Application#operation/upload
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // Note: With fetch, we don't need to manually set Content-Type or boundary
        // fetch will automatically set the correct headers from the FormData object
      },
      body: formData, // fetch handles FormData properly out of the box
    });
    const data = await result.json();
    core.debug(data);
    core.setOutput('ApplicationId', data.application.id);
  } catch (err: any) {
    core.error(err);
    core.setFailed(err.message);
  }
}

run();
