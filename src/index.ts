import * as core from '@actions/core';
import { createReadStream } from 'fs';
import FormData from 'form-data';
import axios from 'axios';

async function run() {
  core.info('Authsignal Upload Version*****');
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
    const releaseTag = core.getInput('releaseTag');
    const description = core.getInput('description');

    const url = `https://${endpointName}-api.esper.cloud/api/enterprise/${enterpriseId}/application/upload/`;
    core.debug(`Esper.io endpoint ${url}`);
    core.info(`Preparing to upload @ ${filePath}`);

    const fileStream = createReadStream(filePath);
    const formData = new FormData();
    formData.append('app_file', fileStream);

    // https://api.esper.io/tag/Application#operation/upload
    const result = await axios.post<{
      application:
        | Record<string, string>
        | { id: string; versions: Record<string, string>[] | { id: string } };
    }>(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        'Content-Type': 'multipart/form-data',
      },
    });
    core.debug(JSON.stringify(result.data, null, 2));
    core.debug(JSON.stringify(result.data));

    core.info(`Uploaded file to Esper.io: ${result.data.application.id}`);
    core.setOutput('ApplicationId', result.data.application.id);

    const applicationId = result.data.application.id;
    const versionId = result.data.application.versions[0].id;

    if (applicationId && versionId && (releaseTag || description)) {
      const patchUrl = `https://${endpointName}-api.esper.cloud/api/enterprise/${enterpriseId}/application/${applicationId}/version/${versionId}/`;

      const patchData = {
        release_name: releaseTag ?? '',
        release_comments: description ?? '',
      };

      await axios.patch<{
        id: String;
      }>(patchUrl, patchData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
    }
  } catch (err: any) {
    core.error(err);
    core.setFailed(err.message);
  }
}

run();
