from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Content(models.Model):
    """Base model for both movies and TV shows"""
    CONTENT_TYPE_CHOICES = [
        ('movie', 'Movie'),
        ('tv_show', 'TV Show'),
    ]
    
    STATUS_CHOICES = [
        ('watching', 'Watching'),
        ('completed', 'Completed'),
        ('wishlist', 'Wishlist'),
    ]
    
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama'),
        ('horror', 'Horror'),
        ('sci-fi', 'Sci-Fi'),
        ('thriller', 'Thriller'),
        ('romance', 'Romance'),
        ('documentary', 'Documentary'),
        ('animation', 'Animation'),
        ('fantasy', 'Fantasy'),
        ('crime', 'Crime'),
        ('adventure', 'Adventure'),
    ]
    
    PLATFORM_CHOICES = [
        ('netflix', 'Netflix'),
        ('prime', 'Prime Video'),
        ('disney', 'Disney+'),
        ('hulu', 'Hulu'),
        ('hbo', 'HBO Max'),
        ('apple', 'Apple TV+'),
        ('paramount', 'Paramount+'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    director = models.CharField(max_length=100, blank=True)
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='wishlist')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    poster_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    release_year = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class TVShow(Content):
    """TV Show specific fields"""
    total_seasons = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    total_episodes = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    seasons_watched = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    episodes_watched = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    average_episode_duration = models.IntegerField(default=45, help_text="Duration in minutes")
    
    class Meta:
        verbose_name = "TV Show"
        verbose_name_plural = "TV Shows"
    
    def save(self, *args, **kwargs):
        self.content_type = 'tv_show'
        super().save(*args, **kwargs)
    
    @property
    def progress_percentage(self):
        """Calculate progress percentage"""
        if self.total_episodes == 0:
            return 0
        return int((self.episodes_watched / self.total_episodes) * 100)
    
    @property
    def remaining_episodes(self):
        """Calculate remaining episodes"""
        return max(0, self.total_episodes - self.episodes_watched)
    
    @property
    def estimated_time_to_complete(self):
        """Estimate time to complete in hours"""
        remaining = self.remaining_episodes
        return round((remaining * self.average_episode_duration) / 60, 1)


class Movie(Content):
    """Movie specific fields"""
    duration = models.IntegerField(help_text="Duration in minutes", null=True, blank=True)
    
    class Meta:
        verbose_name = "Movie"
        verbose_name_plural = "Movies"
    
    def save(self, *args, **kwargs):
        self.content_type = 'movie'
        super().save(*args, **kwargs)


class Review(models.Model):
    """Reviews and ratings for content"""
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="Rating from 1 to 10"
    )
    review_text = models.TextField(blank=True)
    notes = models.TextField(blank=True, help_text="Personal notes about the content")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.content.title} - {self.rating}/10"


class WatchHistory(models.Model):
    """Track watching habits for AI recommendations"""
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='watch_history')
    date_watched = models.DateTimeField(auto_now_add=True)
    watch_duration = models.IntegerField(help_text="Duration watched in minutes", null=True, blank=True)
    
    class Meta:
        ordering = ['-date_watched']
        verbose_name_plural = "Watch History"

