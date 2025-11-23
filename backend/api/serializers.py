from rest_framework import serializers
from .models import Content, Movie, TVShow, Review, WatchHistory


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'review_text', 'notes', 'created_at', 'updated_at']


class ContentSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    content_type = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Content
        fields = [
            'id', 'title', 'director', 'genre', 'platform', 'status',
            'content_type', 'poster_url', 'description', 'release_year',
            'created_at', 'updated_at', 'reviews', 'average_rating'
        ]
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        return None


class MovieSerializer(ContentSerializer):
    content_type = serializers.CharField(read_only=True)
    
    class Meta(ContentSerializer.Meta):
        model = Movie
        fields = ContentSerializer.Meta.fields + ['duration']
    
    def create(self, validated_data):
        # Remove content_type from validated_data and set it explicitly
        validated_data.pop('content_type', None)
        validated_data['content_type'] = 'movie'
        return Movie.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Remove content_type from validated_data as it's set automatically
        validated_data.pop('content_type', None)
        # Update the instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class TVShowSerializer(ContentSerializer):
    progress_percentage = serializers.ReadOnlyField()
    remaining_episodes = serializers.ReadOnlyField()
    estimated_time_to_complete = serializers.ReadOnlyField()
    content_type = serializers.CharField(read_only=True)
    
    class Meta(ContentSerializer.Meta):
        model = TVShow
        fields = ContentSerializer.Meta.fields + [
            'total_seasons', 'total_episodes', 'seasons_watched',
            'episodes_watched', 'average_episode_duration',
            'progress_percentage', 'remaining_episodes', 'estimated_time_to_complete'
        ]
    
    def create(self, validated_data):
        # Remove content_type from validated_data and set it explicitly
        validated_data.pop('content_type', None)
        validated_data['content_type'] = 'tv_show'
        return TVShow.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Remove content_type from validated_data as it's set automatically
        validated_data.pop('content_type', None)
        # Update the instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = ['id', 'content', 'date_watched', 'watch_duration']

