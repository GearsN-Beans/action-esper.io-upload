import * as core from '@actions/core';
import axios from 'axios';
import { createReadStream } from 'fs';
import FormData from 'form-data';

async function run() {
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
    const result = await axios.post<{
      application: Record<string, string> | { id: string };
    }>(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {'Content-Type': 'multipart/form-data;boundary=' + formData.getBoundary()}
      },
    });
    core.debug(JSON.stringify(result.data, null, 2));
    core.setOutput('ApplicationId', result.data.application.id);
  } catch (err: any) {
    core.error(err);
    core.setFailed(err.message);
  }
}

run();
