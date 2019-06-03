import os
import subprocess
import base64

# import atexit

from google.cloud import pubsub_v1

subscriber = pubsub_v1.SubscriberClient()
topic_name = 'projects/{project_id}/topics/{topic}'.format(
    project_id="<project-id>",
    topic='<topic-name>',  # Set this to something appropriate.
)
subscription_name = 'projects/{project_id}/subscriptions/{sub}'.format(
    project_id="<project-id>",
    sub='<subscription-name>',  # Set this to something appropriate.
)
# subscription = subscriber.create_subscription(
#     name=subscription_name, topic=topic_name)


def callback(message):
    print(message)
    command = (['notify-send'] +
               (['--icon=' +
                 message.attributes['icon']] if 'icon' in message.attributes else []) +
               (['--urgency=' +
                 message.attributes['urgency']] if 'urgency' in message.attributes else []) +
               (['--expire-time=' +
                 message.attributes['expire-time']] if 'expire-time' in message.attributes else []) +
               (['--category=' +
                 message.attributes['category']] if 'category' in message.attributes else []) +
               (['--app-name=' +
                 message.attributes['app-name']] if 'app-name' in message.attributes else []) +
               ([message.attributes['subject']] if 'subject' in message.attributes else []) +
               [message.data.decode('utf-8')])
    subprocess.run(command)
    message.ack()


# def exit_handler(subscriber, subscription, future):
#     future.cancel()
#     subscriber.delete_subscription(subscription)


future = subscriber.subscribe(subscription_name, callback)
# atexit.register(exit_handler, subscriber, subscription, future)
try:
    future.result()
except KeyboardInterrupt:
    future.cancel()
    # subscriber.delete_subscription(subscription_name)