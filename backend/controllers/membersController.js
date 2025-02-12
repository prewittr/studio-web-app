// For demonstration, we're returning static data.
// In a real app, you'd query your database for the user's sessions and membership info.
exports.getMemberDashboard = async (req, res) => {
    try {
      // You can access user details from req.user (set by authenticateJWT)
      // For example, req.user.id might be used to query sessions for that user.
      const dashboardData = {
        membershipStatus: "Active", // Or fetch from the user's profile data
        sessions: [
          {
            _id: "session1",
            title: "Yoga Class",
            date: new Date(), // Replace with actual session date/time
          },
          {
            _id: "session2",
            title: "Pilates Session",
            date: new Date(Date.now() + 86400000), // Tomorrow's date
          },
        ],
      };
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching member dashboard data:", error);
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  };
  