const UserStats = ({ userData }) => {
  // console.log("userData", userData);


  
  const statItems = [
    { label: 'Posts', value: userData?.stats?.posts ?? 0 },
    { label: 'Questions', value: userData?.stats?.questions ?? 0 },
    { label: 'Answers', value: userData?.stats?.answers ?? 0 },
    { label: 'Following', value: userData?.following?.length ?? 0 },
    { label: 'Followers', value: userData?.followers?.length ?? 0 },
    { label: 'Reputation', value: userData?.stats?.reputation ?? 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((stat) => (
          <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStats; 