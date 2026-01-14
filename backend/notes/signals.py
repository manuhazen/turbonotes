from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Category

User = get_user_model()

@receiver(post_save, sender=User)
def create_default_categories(sender, instance, created, **kwargs):
    if created:
        default_categories = [
            {"name": "Random Thoughts", "color": "#E9A178"},  # Orange-ish
            {"name": "School", "color": "#FBE38E"},           # Yellow-ish
            {"name": "Personal", "color": "#7FA19A"},         # Teal-ish
        ]
        
        for cat_data in default_categories:
            Category.objects.create(
                name=cat_data["name"],
                color=cat_data["color"],
                creator=instance
            )
