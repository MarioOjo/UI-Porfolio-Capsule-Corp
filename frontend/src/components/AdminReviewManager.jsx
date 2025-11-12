
import React, { useEffect, useState } from 'react';

const getAvatar = (userId) => {
  // Simple avatar generator (replace with real avatars if available)
  const colors = ['#3B4CCA', '#FF9800', '#4CAF50', '#E91E63', '#9C27B0'];
  const color = colors[userId % colors.length];
  return (
    <div style={{width:32,height:32,borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'bold'}}>
      {userId}
    </div>
  );
};

const StarRating = ({ rating }) => (
  <span>
    {[...Array(7)].map((_, i) => (
      <span key={i} style={{color: i < rating ? '#FFD700' : '#ddd',fontSize:'1.2em'}}>★</span>
    ))}
  </span>
);

const AdminReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-capsule-accent font-saiyan">Admin Review Manager</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 flex flex-col space-y-2">
              <div className="flex items-center space-x-3 mb-2">
                {getAvatar(r.userId)}
                <div>
                  <div className="font-bold text-lg text-gray-800">{r.title}</div>
                  <div className="text-sm text-gray-500">Review #{r.id} • Product {r.productId}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StarRating rating={r.rating} />
                <span className="ml-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-bold">{r.verified ? 'Verified' : 'Unverified'}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{r.date}</span>
              </div>
              <div className="text-gray-700 mt-2 mb-2">{r.comment}</div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewManager;
