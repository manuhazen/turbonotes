import pytest
from notes.models import Note, Category

@pytest.mark.django_db
class TestModels:
    def test_category_creation(self, user):
        category = Category.objects.create(
            name="Personal",
            color="#FF0000",
            creator=user
        )
        assert category.name == "Personal"
        assert category.color == "#FF0000"
        assert category.creator == user
        assert str(category) == "Personal"

    def test_note_creation(self, user):
        category = Category.objects.create(
            name="Work",
            color="#0000FF",
            creator=user
        )
        note = Note.objects.create(
            title="Meeting Notes",
            description="Discuss project timeline",
            category=category,
            creator=user
        )
        assert note.title == "Meeting Notes"
        assert note.description == "Discuss project timeline"
        assert note.category == category
        assert note.creator == user
        assert str(note) == "Meeting Notes"

    def test_note_without_category(self, user):
        note = Note.objects.create(
            title="Ideas",
            description="Random thoughts",
            creator=user
        )
        assert note.category is None
