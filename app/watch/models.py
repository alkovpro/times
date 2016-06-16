from app import db
# TODO: Write main models


class Watch(db.Document):
    name = db.StringField(max_length=255, required=True)
    deleted = db.BooleanField(default=False)

    def __str__(self):
        return self.name
