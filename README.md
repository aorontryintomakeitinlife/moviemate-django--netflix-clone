# MovieMate 🎬

A Netflix-like web application for tracking and managing your personal movie and TV show collection. Built with Django REST Framework backend and React frontend.

## 🚀 Features

### Core Features
- ✅ **Add Movies & TV Shows** - Add content with title, director, genre, platform, and status
- ✅ **Track Progress** - Monitor episodes and seasons watched for TV shows
- ✅ **Rate & Review** - Rate content (1-10 scale) and write detailed reviews
- ✅ **Filter & Sort** - Filter by genre, platform, status, or content type. Sort by date, title, or year
- ✅ **Search** - Search your collection by title or director
- ✅ **Edit Content** - Update any content details including poster images
- ✅ **Progress Visualization** - Visual progress bars for TV shows
- ✅ **Time Estimation** - Calculate estimated time to complete TV shows


### UI/UX Features
- 🎨 **Netflix-like Interface** - Beautiful, modern UI with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎭 **Hero Sections** - Featured content with large poster displays
- 🎴 **Content Cards** - Hover effects and visual status indicators
- 🎬 **Horizontal Scrolling** - Smooth scrolling content rows

## 🛠️ Tech Stack

- **Frontend**: React.js 18.2.0 with React Router
- **Backend**: Django 4.2.7 with Django REST Framework
- **Database**: SQLite (easily switchable to PostgreSQL)
- **Styling**: CSS3 with modern design patterns
- **API Communication**: Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8 or higher
- **Node.js** 14 or higher
- **npm** or **yarn**
- **Git** (for cloning the repository)

## 🔧 Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/aorontryintomakeitinlife/moviemate-django--netflix-clone.git
cd moviemate-django--netflix-clone
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Create virtual environment (recommended)
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Run database migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 5: Create superuser (optional, for admin access)
```bash
python manage.py createsuperuser
```

#### Step 6: Start the Django server
```bash
python manage.py runserver
```

The backend API will be running at `http://localhost:8000`

**Or use the setup script:**
```bash
./setup.sh
```

### 3. Frontend Setup

Open a **new terminal window** and navigate to the frontend directory:

#### Step 1: Navigate to frontend directory
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Start the development server
```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

**Or use the setup script:**
```bash
./setup.sh
```

### 4. Optional: Enable AI Features

To enable AI-powered review generation:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Set it as an environment variable:
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   ```

3. Restart the Django server

## 📖 Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Open your browser** to `http://localhost:3000`
3. **Add Content**: Click "Add Content" to add movies or TV shows
4. **View Collection**: Browse your collection in "My List"
5. **Filter & Search**: Use filters to find specific content
6. **Track Progress**: Update episode progress for TV shows
7. **Rate & Review**: Add ratings and reviews after watching

## 🎯 Feature Details

### Content Management
- Add movies with duration tracking
- Add TV shows with episode/season tracking
- Edit any content details including poster images
- Update status (watching, completed, wishlist)
- Delete content from your collection

### Progress Tracking
- Track episodes watched vs. total episodes
- Track seasons watched vs. total seasons
- Visual progress bars showing completion percentage
- Estimated time to complete based on average episode duration

### Reviews & Ratings
- Rate content from 1-10
- Write detailed reviews
- Add personal notes
- View all reviews for each content item
- AI-generated reviews from notes (with OpenAI API key)

### Filtering & Sorting
- **Filter by**: Genre, Platform, Status, Content Type
- **Search by**: Title or Director
- **Sort by**: Date Added, Title (A-Z or Z-A), Release Year

### Recommendations
- Get personalized recommendations based on:
  - Your highly-rated content (8+ ratings)
  - Similar genres and platforms
  - Content you haven't rated yet

## 📁 Project Structure

```
moviemate/
├── backend/
│   ├── api/                    # Django app
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # API serializers
│   │   ├── views.py            # API viewsets
│   │   ├── urls.py             # API routes
│   │   └── migrations/         # Database migrations
│   ├── moviemate/              # Django project settings
│   │   ├── settings.py         # Project configuration
│   │   ├── urls.py             # Main URL configuration
│   │   └── views.py            # Root view
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   └── setup.sh               # Backend setup script
├── frontend/
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   ├── ContentCard.js  # Content card component
│   │   │   ├── ContentRow.js   # Horizontal content row
│   │   │   └── HeroSection.js  # Hero banner component
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js         # Home page
│   │   │   ├── MyList.js       # Collection page
│   │   │   ├── AddContent.js   # Add content form
│   │   │   └── ContentDetail.js # Content detail page
│   │   ├── services/           # API services
│   │   │   └── api.js          # Axios API configuration
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   ├── package.json            # Node dependencies
│   └── setup.sh               # Frontend setup script
└── README.md                   # This file
```

## 🔌 API Endpoints

- `GET /api/content/` - List all content (with filtering)
- `POST /api/content/` - Create new content
- `GET /api/content/{id}/` - Get content details
- `PUT /api/content/{id}/` - Update content
- `DELETE /api/content/{id}/` - Delete content
- `POST /api/content/{id}/add_review/` - Add a review
- `POST /api/content/{id}/update_progress/` - Update TV show progress
- `GET /api/content/recommendations/` - Get AI recommendations
- `POST /api/content/{id}/generate_review/` - Generate AI review from notes
- `GET /api/movies/` - List all movies
- `GET /api/tv-shows/` - List all TV shows

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change the port with `python manage.py runserver 8001`
- **Migration errors**: Run `python manage.py makemigrations` then `python manage.py migrate`
- **Module not found**: Ensure virtual environment is activated and dependencies are installed

### Frontend Issues
- **Port 3000 in use**: React will automatically suggest an alternative port
- **CORS errors**: Ensure backend is running and CORS is configured in `settings.py`
- **API connection failed**: Check that backend is running on `http://localhost:8000`

### Database Issues
- **Tables don't exist**: Run migrations: `python manage.py migrate`
- **Database locked**: Close any database connections and try again

## 🚀 Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
```

### Backend Production
- Set `DEBUG = False` in `settings.py`
- Use a production database (PostgreSQL recommended)
- Configure proper CORS settings
- Set up a production WSGI server (e.g., Gunicorn)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

**Aoron**

- GitHub: [@aorontryintomakeitinlife](https://github.com/aorontryintomakeitinlife)

## 🙏 Acknowledgments

- Netflix for UI/UX inspiration
- Django and React communities for excellent documentation
- OpenAI for AI capabilities

---

**Happy Watching! 🎬🍿**

