import pytest
from notes.models import Note, Category
from notes.serializers import NoteSerializer, CategorySerializer

@pytest.mark.django_db
class TestNoteSerializers:
    def test_category_serializer(self, user, api_client):
        # Context is needed for creator assignment in create()
        request = api_client.post('/fake-url/') # Mock request 
        request.user = user
        
        data = {
            "name": "Work",
            "color": "#FF0000"
        }
        context = {'request': request}
        serializer = CategorySerializer(data=data, context=context)
        assert serializer.is_valid()
        category = serializer.save()
        assert category.creator == user
        assert category.name == "Work"

    def test_note_serializer(self, user, api_client):
        category = Category.objects.create(name="Work", color="#FF0000", creator=user)
        
        request = api_client.post('/fake-url/')
        request.user = user
        
        data = {
            "title": "Meeting",
            "description": "Notes",
            "category": category.id
        }
        context = {'request': request}
        serializer = NoteSerializer(data=data, context=context)
        assert serializer.is_valid()
        note = serializer.save()
        assert note.creator == user
        assert note.category == category
        # category_name is on the serializer representation, not the model instance
        assert serializer.data['category_name'] == "Work"

    def test_category_serializer_update(self, user, api_client):
        category = Category.objects.create(name="Old", color="#000000", creator=user)
        request = api_client.post('/fake-url/')
        request.user = user
        
        data = {"name": "New", "color": "#FFFFFF"}
        context = {'request': request}
        serializer = CategorySerializer(category, data=data, context=context)
        assert serializer.is_valid()
        updated_category = serializer.save()
        assert updated_category.name == "New"
        assert updated_category.color == "#FFFFFF"

    def test_note_serializer_partial_update(self, user, api_client):
        note = Note.objects.create(title="Old", description="Old Desc", creator=user)
        request = api_client.post('/fake-url/')
        request.user = user
        
        data = {"title": "New Title"}
        context = {'request': request}
        serializer = NoteSerializer(note, data=data, partial=True, context=context)
        assert serializer.is_valid()
        updated_note = serializer.save()
        assert updated_note.title == "New Title"
        assert updated_note.description == "Old Desc"
