from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Avg
from .models import Content, Movie, TVShow, Review, WatchHistory
from .serializers import (
    ContentSerializer, MovieSerializer, TVShowSerializer,
    ReviewSerializer, WatchHistorySerializer
)
import os

# Optional OpenAI import
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class ContentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing all content (movies and TV shows)"""
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'director', 'genre', 'platform', 'status']
    ordering_fields = ['title', 'created_at', 'release_year']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Content.objects.all()
        
        # Filter by genre
        genre = self.request.query_params.get('genre', None)
        if genre:
            queryset = queryset.filter(genre=genre)
        
        # Filter by platform
        platform = self.request.query_params.get('platform', None)
        if platform:
            queryset = queryset.filter(platform=platform)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by content type
        content_type = self.request.query_params.get('content_type', None)
        if content_type:
            queryset = queryset.filter(content_type=content_type)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            # Return appropriate serializer based on content type
            content_id = self.kwargs.get('pk')
            if content_id:
                try:
                    content = Content.objects.get(pk=content_id)
                    if content.content_type == 'tv_show':
                        try:
                            tv_show = TVShow.objects.get(pk=content_id)
                            return TVShowSerializer
                        except TVShow.DoesNotExist:
                            pass
                    elif content.content_type == 'movie':
                        try:
                            movie = Movie.objects.get(pk=content_id)
                            return MovieSerializer
                        except Movie.DoesNotExist:
                            pass
                except Content.DoesNotExist:
                    pass
        return ContentSerializer
    
    def get_object(self):
        """Override to return the actual Movie or TVShow instance"""
        obj = super().get_object()
        if obj.content_type == 'tv_show':
            try:
                return TVShow.objects.get(pk=obj.pk)
            except TVShow.DoesNotExist:
                return obj
        elif obj.content_type == 'movie':
            try:
                return Movie.objects.get(pk=obj.pk)
            except Movie.DoesNotExist:
                return obj
        return obj
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        """Add a review to content"""
        content = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(content=content)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update progress for TV shows"""
        content = self.get_object()
        if not isinstance(content, TVShow):
            return Response(
                {'error': 'Progress tracking is only available for TV shows'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tv_show = content
        episodes_watched = request.data.get('episodes_watched', tv_show.episodes_watched)
        seasons_watched = request.data.get('seasons_watched', tv_show.seasons_watched)
        
        tv_show.episodes_watched = episodes_watched
        tv_show.seasons_watched = seasons_watched
        tv_show.save()
        
        serializer = TVShowSerializer(tv_show)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        """Get AI-powered recommendations based on watch history and ratings"""
        # Get user's highly rated content
        highly_rated = Review.objects.filter(rating__gte=8).values_list('content', flat=True)
        if not highly_rated:
            # If no reviews, return random content
            recommendations = Content.objects.all()[:10]
        else:
            # Find similar content based on genre and platform
            rated_content = Content.objects.filter(id__in=highly_rated)
            genres = rated_content.values_list('genre', flat=True).distinct()
            platforms = rated_content.values_list('platform', flat=True).distinct()
            
            # Recommend content with similar genres/platforms that user hasn't rated highly
            recommendations = Content.objects.filter(
                Q(genre__in=genres) | Q(platform__in=platforms)
            ).exclude(id__in=highly_rated).distinct()[:10]
        
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def generate_review(self, request, pk=None):
        """Generate a review using AI based on user notes"""
        content = self.get_object()
        notes = request.data.get('notes', '')
        
        if not notes:
            return Response(
                {'error': 'Notes are required to generate a review'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OpenAI is available and API key is set
        api_key = os.environ.get('OPENAI_API_KEY')
        if not OPENAI_AVAILABLE or not api_key:
            # Return a simple generated review without AI
            generated_review = f"I watched {content.title} and here are my thoughts: {notes[:200]}..."
            return Response({'generated_review': generated_review})
        
        try:
            # Try using OpenAI v1.x API (newer version)
            client = openai.OpenAI(api_key=api_key)
            prompt = f"Based on these notes about '{content.title}' ({content.genre} {content.content_type}):\n\n{notes}\n\nGenerate a short, engaging review (2-3 sentences)."
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a movie and TV show critic. Write engaging, concise reviews."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            generated_review = response.choices[0].message.content.strip()
            return Response({'generated_review': generated_review})
        except Exception as e:
            # Fallback to simple review if AI fails
            generated_review = f"I watched {content.title} and here are my thoughts: {notes[:200]}..."
            return Response({
                'generated_review': generated_review,
                'note': f'AI generation failed: {str(e)}. Using simple review instead.'
            })


class MovieViewSet(viewsets.ModelViewSet):
    """ViewSet specifically for movies"""
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'director', 'genre', 'platform', 'status']
    ordering_fields = ['title', 'created_at', 'release_year']
    ordering = ['-created_at']


class TVShowViewSet(viewsets.ModelViewSet):
    """ViewSet specifically for TV shows"""
    queryset = TVShow.objects.all()
    serializer_class = TVShowSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'director', 'genre', 'platform', 'status']
    ordering_fields = ['title', 'created_at', 'release_year']
    ordering = ['-created_at']


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for reviews"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']


class WatchHistoryViewSet(viewsets.ModelViewSet):
    """ViewSet for watch history"""
    queryset = WatchHistory.objects.all()
    serializer_class = WatchHistorySerializer

