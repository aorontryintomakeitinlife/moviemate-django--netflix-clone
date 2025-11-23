from django.contrib import admin
from .models import Content, Movie, TVShow, Review, WatchHistory


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'director', 'genre', 'platform', 'status', 'release_year']
    list_filter = ['genre', 'platform', 'status', 'release_year']
    search_fields = ['title', 'director']


@admin.register(TVShow)
class TVShowAdmin(admin.ModelAdmin):
    list_display = ['title', 'director', 'genre', 'platform', 'status', 'episodes_watched', 'total_episodes']
    list_filter = ['genre', 'platform', 'status']
    search_fields = ['title', 'director']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['content', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['content__title', 'review_text']


@admin.register(WatchHistory)
class WatchHistoryAdmin(admin.ModelAdmin):
    list_display = ['content', 'date_watched', 'watch_duration']
    list_filter = ['date_watched']
    search_fields = ['content__title']

