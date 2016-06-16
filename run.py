from app import application
import os

ROOTDIR = os.path.abspath(os.path.dirname(__file__))

application.jinja_loader.searchpath = [os.path.normpath(os.path.join(ROOTDIR, 'templates'))]
application.static_folder = os.path.normpath(os.path.join(ROOTDIR, 'static'))

if __name__ == "__main__":
    application.run(debug=True)
