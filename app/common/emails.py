from flask import render_template
from app.config import MAIL_SENDER, SERVER_URL
from app.common.queue import send_mail


def send(subject, sender, recipients, text_body, html_body):
    send_mail.delay(subject, sender, recipients, text_body, html_body)


def confirm(recipient, firstname, token, new_user=True):
    confirm_url = '%sapi/confirm' % ('' if SERVER_URL[-1] == '/' else '/')
    confirm_url = '%s%s?token=%s' % (SERVER_URL, confirm_url, token)
    send('Times: New user email confirmation.',
         MAIL_SENDER,
         [recipient],
         render_template("email/confirm.txt", confirm_url=confirm_url, firstname=firstname, new_user=new_user),
         render_template("email/confirm.html", confirm_url=confirm_url, firstname=firstname, new_user=new_user))


def reset(recipient, firstname, token, password):
    confirm_url = '%sapi/reset' % ('' if SERVER_URL[-1] == '/' else '/')
    confirm_url = '%s%s?token=%s' % (SERVER_URL, confirm_url, token)
    send('Times: Reset user password.',
         MAIL_SENDER,
         [recipient],
         render_template("email/reset.txt", confirm_url=confirm_url, firstname=firstname, password=password),
         render_template("email/reset.html", confirm_url=confirm_url, firstname=firstname, password=password))
