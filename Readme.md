# Notification Service
A simple linux notification service triggered by posting to an url.

## How it works?
It uses Google apps script as a proxy to publish messages to google pub sub and simple python subscriber used to create notification using notify-send. It can be run in demon mode by creating a user service. Google apps script is used to avoid Oauth authentication which might not be supported in the service which might hit the url. A simple basic auth can be added to webservice for better security.
