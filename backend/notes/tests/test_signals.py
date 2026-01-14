import pytest
from django.contrib.auth import get_user_model
from notes.models import Category

User = get_user_model()

@pytest.mark.django_db
class TestSignals:
    def test_default_categories_created(self):
        user = User.objects.create_user(email="test@example.com", password="password123", first_name="Test", last_name="User")
        
        categories = Category.objects.filter(creator=user)
        category_names = [cat.name for cat in categories]
        
        assert len(categories) == 3
        assert "Random Thoughts" in category_names
        assert "School" in category_names
        assert "Personal" in category_names
        
        # Verify colors
        personal = Category.objects.get(creator=user, name="Personal")
        assert personal.color == "#7FA19A"

    def test_no_double_create(self):
        user = User.objects.create_user(email="test2@example.com", password="password123", first_name="Test", last_name="User")
        assert Category.objects.filter(creator=user).count() == 3
        
        # Save again, should not create more
        user.first_name = "Updated"
        user.save()
        assert Category.objects.filter(creator=user).count() == 3
