# Wiresafe / Riot-Web

Wiresafe branded fork of [riot-web](https://github.com/matrix-org/riot-web).

## configuration and servers
- Homeserver: https://neo.wiresafe.com
- Identity Server: https://neo-identity.wiresafe.com

## builds and deployment

- Deploys to Google Cloud Containers via kubernetes. 
- Build and deployment scripts are in branch [wiresafe-deploy](https://github.com/wiresafe/riot-web/tree/wiresafe-deploy)
- Pushing to branch [wiresafe-stage](https://github.com/wiresafe/riot-web/tree/wiresafe-stage) will deploy to
[https://stage.chat.wiresafe.com](https://stage.chat.wiresafe.com).
- Pushing to branch [wiresafe-prod](https://github.com/wiresafe/riot-web/tree/wiresafe-prod) will deploy to
[https://chat.wiresafe.com](https://chat.wiresafe.com)
- Build and deployments take approximately 5 minutes to complete.
- View build status and history in [google cloud console](https://console.cloud.google.com/gcr/builds?project=wiresafe-project) 
