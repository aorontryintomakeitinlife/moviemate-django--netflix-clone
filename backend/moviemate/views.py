from django.http import JsonResponse

def api_root(request):
    """Simple root view that shows API is running"""
    return JsonResponse({
        'message': 'MovieMate API is running!',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'content': '/api/content/',
            'movies': '/api/movies/',
            'tv_shows': '/api/tv-shows/',
            'reviews': '/api/reviews/',
        },
        'frontend': 'http://localhost:3000',
        'documentation': 'See README.md for API documentation'
    })

