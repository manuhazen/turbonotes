import pytest
from django.contrib.auth import get_user_model
from users.serializers import UserCreateSerializer, UserSerializer

User = get_user_model()

@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self):
        user = User.objects.create_user(
            email="test@example.com",
            password="password123",
            first_name="Test",
            last_name="User"
        )
        assert user.email == "test@example.com"
        assert user.check_password("password123")
        assert user.is_active
        assert not user.is_staff
        assert not user.is_superuser
        assert str(user) == "test@example.com"

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email="admin@example.com",
            password="password123",
            first_name="Admin",
            last_name="User"
        )
        assert admin.is_staff
        assert admin.is_superuser
        assert admin.is_active

    def test_create_user_invalid_email(self):
        with pytest.raises(ValueError):
            User.objects.create_user(email="", password="password123")

@pytest.mark.django_db
class TestUserSerializers:
    def test_user_create_serializer(self):
        data = {
            "email": "serializer@example.com",
            "password": "StrongPassword123!",
            "re_password": "StrongPassword123!", # Djoser requires re_password by default
            "first_name": "Ser",
            "last_name": "ializer"
        }
        serializer = UserCreateSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors)
        assert serializer.is_valid()
        user = serializer.save()
        assert user.email == data["email"]
        assert user.check_password(data["password"])

    def test_user_serializer(self, user):
        serializer = UserSerializer(user)
        data = serializer.data
        assert data["email"] == user.email
        assert "password" not in data
