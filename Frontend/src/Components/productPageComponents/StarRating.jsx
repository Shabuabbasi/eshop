const StarRating = ({ rating = 4.0 }) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  for (let i = 0; i < full; i++) {
    stars.push(
      <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0..." />
      </svg>
    );
  }

  if (half) {
    stars.push(
      <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15.27L16.18 18..." />
      </svg>
    );
  }

  const empty = 5 - stars.length;
  for (let i = 0; i < empty; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15.27L16.18 18..." />
      </svg>
    );
  }

  return <div className="flex space-x-0.5">{stars}</div>;
};

export default StarRating;
