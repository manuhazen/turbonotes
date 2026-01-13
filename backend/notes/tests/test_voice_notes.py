import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from notes.models import Note
from rest_framework import status

@pytest.mark.django_db
class TestVoiceNotes:
    def test_create_note_with_audio(self, user):
        audio_file = SimpleUploadedFile("test_audio.mp3", b"file_content", content_type="audio/mpeg")
        note = Note.objects.create(title="Voice Note", audio_file=audio_file, creator=user)
        assert note.audio_file.name.startswith("voice_notes/test_audio")

    def test_create_note_api_with_audio(self, authenticated_client, user):
        audio_file = SimpleUploadedFile("api_audio.mp3", b"api_file_content", content_type="audio/mpeg")
        data = {
            "title": "API Voice Note",
            "audio_file": audio_file
        }
        # default content type for client.post is multipart when data contains files? 
        # Actually APIClient handles multipart if data contains file-like objects.
        response = authenticated_client.post('/api/notes/', data, format='multipart')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert "audio_file" in response.data
        assert response.data["audio_file"].startswith("http://testserver/media/voice_notes/api_audio")
        
        note = Note.objects.get(id=response.data['id'])
        assert note.audio_file
        assert "api_file_content" in note.audio_file.read().decode()

    def test_create_note_mixed_content(self, authenticated_client, user):
        # Voice note + text description
        audio_file = SimpleUploadedFile("mixed.mp3", b"content", content_type="audio/mpeg")
        data = {
            "title": "Mixed Note",
            "description": "This is a description",
            "audio_file": audio_file
        }
        response = authenticated_client.post('/api/notes/', data, format='multipart')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['description'] == "This is a description"
        assert response.data['audio_file'] is not None

    def test_create_note_text_only(self, authenticated_client, user):
        # Regression test: Ensure we can still create text-only notes
        data = {
            "title": "Text Only",
            "description": "Just text"
        }
        response = authenticated_client.post('/api/notes/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['audio_file'] is None
