import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';

interface ClassData {
  id: string;
  name: string;
  type: string;
  date: string;
  capacity: number;
  teacher: {
    id: string;
    name: string;
  };
  reservations: any[];
}

interface UserReservation {
  id: string;
  class: ClassData;
}

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([]);
  const [userReservations, setUserReservations] = useState<UserReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch upcoming classes
        const classesResponse = await axios.get('/api/classes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            upcoming: true,
            limit: 5,
          },
        });

        if (classesResponse.data.status === 'success') {
          setUpcomingClasses(classesResponse.data.data.classes);
        }

        // Fetch user reservations
        const reservationsResponse = await axios.get('/api/users/me/reservations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (reservationsResponse.data.status === 'success') {
          setUserReservations(reservationsResponse.data.data.reservations);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your gym activities, book classes, and track your fitness journey all in one place.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Upcoming Reservations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userReservations.length > 0 ? (
            userReservations.map((reservation) => (
              <div key={reservation.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{reservation.class.name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(reservation.class.date)}</p>
                    <p className="text-sm text-gray-500">
                      Instructor: {reservation.class.teacher.name}
                    </p>
                  </div>
                  <Link
                    to={`/classes/${reservation.class.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              <p>You don't have any upcoming reservations.</p>
              <Link to="/classes" className="text-primary-600 hover:text-primary-700 font-medium">
                Browse Classes
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Classes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{classItem.name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(classItem.date)}</p>
                    <p className="text-sm text-gray-500">Instructor: {classItem.teacher.name}</p>
                    <p className="text-sm text-gray-500">
                      Availability: {classItem.capacity - classItem.reservations.length} spots left
                    </p>
                  </div>
                  <Link
                    to={`/classes/${classItem.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              <p>No upcoming classes found.</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <Link
            to="/classes"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
          >
            View All Classes
            <svg
              className="ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 