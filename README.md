## Generate menu telegram bot

### Project Setup

1. Create a Firebase Project using the Firebase Developer Console
2. Configure this project to use the Firebase project you have created: `firebase use --add` and select your project in the list.
3. Install the dependencies and deploy
   ```
   cd functions
   yarn
   yarn deploy
   ```

### Generate new menu manually

Send the following JSON to `messages` topic by the link

https://console.cloud.google.com/cloudpubsub/topic/detail/messages?project=generate-menu

```
{
  "type": "generateMenu"
}
```
