import pytest
from rest_framework import status
from notes.models import Note, Category

@pytest.mark.django_db
class TestNoteViews:
    def test_get_categories_authenticated(self, authenticated_client, user):
        Category.objects.create(name="Work", color="#FF0000", creator=user)
        response = authenticated_client.get('/api/categories/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 4

    def test_get_categories_unauthenticated(self, api_client):
        response = api_client.get('/api/categories/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_note(self, authenticated_client, user):
        category = Category.objects.create(name="Unique Test Category", color="#00FF00", creator=user)
        data = {
            "title": "Gym",
            "description": "Leg day",
            "category": category.id
        }
        response = authenticated_client.post('/api/notes/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Note.objects.filter(creator=user).count() == 1

    def test_get_notes_filtering(self, authenticated_client, user):
        # Create note for user
        Note.objects.create(title="My Note", description="Mine", creator=user)
        
        # Create another user and note
        from django.contrib.auth import get_user_model
        User = get_user_model()
        other_user = User.objects.create_user(email="other@example.com", password="pw")
        Note.objects.create(title="Other Note", description="Theirs", creator=other_user)

        response = authenticated_client.get('/api/notes/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == "My Note"

    def test_retrieve_note(self, authenticated_client, user):
        note = Note.objects.create(title="Detail", description="Desc", creator=user)
        response = authenticated_client.get(f'/api/notes/{note.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == "Detail"

    def test_update_note(self, authenticated_client, user):
        note = Note.objects.create(title="Old", description="Desc", creator=user)
        data = {"title": "New Title", "description": "Desc"}
        response = authenticated_client.put(f'/api/notes/{note.id}/', data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == "New Title"
        note.refresh_from_db()
        assert note.title == "New Title"

    def test_delete_note(self, authenticated_client, user):
        note = Note.objects.create(title="To Delete", description="Desc", creator=user)
        response = authenticated_client.delete(f'/api/notes/{note.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Note.objects.filter(id=note.id).count() == 0

    def test_delete_other_user_note(self, authenticated_client, user):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        other_user = User.objects.create_user(email="victim@example.com", password="pw")
        note = Note.objects.create(title="Secure", description="Desc", creator=other_user)
        
        response = authenticated_client.delete(f'/api/notes/{note.id}/')
        assert response.status_code == status.HTTP_404_NOT_FOUND # Should not be found in queryset

