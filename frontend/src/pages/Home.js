import React, { useState, useEffect } from 'react';
import { contentAPI } from '../services/api';
import ContentRow from '../components/ContentRow';
import HeroSection from '../components/HeroSection';
import './Home.css';

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [watching, setWatching] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch recommendations
      const recResponse = await contentAPI.getRecommendations();
      setRecommendations(recResponse.data.slice(0, 10));

      // Fetch content being watched
      const watchingResponse = await contentAPI.getAll({ status: 'watching' });
      setWatching(watchingResponse.data.results || watchingResponse.data);

      // Fetch recently added
      const recentResponse = await contentAPI.getAll({ ordering: '-created_at' });
      setRecentlyAdded(recentResponse.data.results || recentResponse.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {recommendations.length > 0 && (
        <HeroSection content={recommendations[0]} />
      )}
      <div className="home-content">
        {watching.length > 0 && (
          <ContentRow title="Continue Watching" contents={watching} />
        )}
        {recommendations.length > 0 && (
          <ContentRow title="Recommended for You" contents={recommendations} />
        )}
        {recentlyAdded.length > 0 && (
          <ContentRow title="Recently Added" contents={recentlyAdded} />
        )}
      </div>
    </div>
  );
};

export default Home;

