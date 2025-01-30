# action-esper.io-upload

This action uploads an apk to esper.io using [Esper.io API](https://api.esper.io/#section/Introduction)

## Inputs (required)

### `enterpriseId`

**Required** Esper.io Enterprise ID.

### `apiKey`

**Required** API key to interact with esper.io API.

### `endpointName`

**Required** Esper.io endpoint name.

### `filePath`

**Required** APK file path.

## Outputs

### `applicationId`

New uploaded application id.

## Inputs (optional)

### ReleaseTag

Release tag for the uploaded application.
Examples:

- `v1.0.0`
- date of planned release: `2021-01-01`
- date of build: `2021-01-01`

### Description

Description of the uploaded application.

## Example usage

```
- name: Publish APK to Esper.io
    uses: actions/action-esper.io-upload@v1.1
    with:
      enterpriseId: 'ENTERPRISE_ID'
      apiKey: 'API_KEY'
      endpointName: 'ENDPOINT_NAME'
      filePath: 'FILE_PATH'
      releaseTag: 'RELEASE_TAG' (OPTIONAL)
      description: 'DESCRIPTION' (OPTIONAL)
```

## References

- [https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#introduction]
- [https://github.com/vercel/ncc]

```

```
