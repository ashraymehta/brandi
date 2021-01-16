# brandi ![](https://github.com/ashraymehta/brandi/workflows/CI/badge.svg)

## Configuration

The project uses `serverless-dotenv-plugin` to configure the application.

**NOTE:** For local development (`npm run sls-offline`), it'll try to read configurations from `./config/.env.local` file.

The following is a sample configuration file:

```env
AWS_S3_BUCKET_NAME=brandi-local
GOOGLE_SEARCH_API_KEY=<google-search-key>
GOOGLE_SEARCH_ENGINE_ID=<google-search-id>
MONGODB_URI=mongodb://localhost:27017/brandi
REMOVE_BG_API_KEY=<remove-bg-key>
RITEKIT_API_BASE_URL=https://api.ritekit.com/
RITEKIT_API_KEY=<ritekit-api-key>
GOOGLE_SIGN_IN_CLIENT_ID=<google-sign-in-client-id>
GOOGLE_SERVER_CLIENT_ID=<google-server-client-id>
```