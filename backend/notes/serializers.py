from rest_framework import serializers
from .models import Category, Note

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'creator', 'created_at', 'updated_at']
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)

class NoteSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_color = serializers.ReadOnlyField(source='category.color')

    class Meta:
        model = Note
        fields = ['id', 'title', 'description', 'audio_file', 'category', 'category_name', 'category_color', 'creator', 'created_at', 'updated_at']
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at', 'category_name', 'category_color']

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)
