from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentViewSet, MovieViewSet, TVShowViewSet, ReviewViewSet, WatchHistoryViewSet

router = DefaultRouter()
router.register(r'content', ContentViewSet, basename='content')
router.register(r'movies', MovieViewSet, basename='movie')
router.register(r'tv-shows', TVShowViewSet, basename='tvshow')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'watch-history', WatchHistoryViewSet, basename='watchhistory')

urlpatterns = [
    path('', include(router.urls)),
]

