from celery import Celery
from flask import Flask
from flask_mail import Mail, Message
import app.config as config

app = Flask(__name__)
app.config.from_object(config)
qApp = Celery('queue', backend='amqp://', broker='amqp://guest@localhost//')
mail = Mail(app)


@qApp.task
def send_mail(subject, sender, recipients, text_body, html_body):
    with app.app_context():
        msg = Message(subject, sender=sender, recipients=recipients, body=text_body, html=html_body)
        mail.send(msg)
