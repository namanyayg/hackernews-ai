import { Metadata } from 'next';
import RoastClientSide from '@/components/RoastClientSide';

interface UserData {
  username: string;
  karma: number;
  about: string | null;
  created: Date;
}

async function getUserData(username: string): Promise<UserData | null> {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://roastmyhn.nmn.gl';
  try {
    const response = await fetch(`${baseUrl}/api/r0ast-me-now/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const userData = await getUserData(params.username);
  if (!userData) return { title: 'User Not Found' };

  return {
    title: `Roast of ${userData.username} - Roast My HackerNews`,
    description: `Check out the roast of ${userData.username}, a HackerNews user with ${userData.karma} karma.`,
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function UserRoast({ params }: { params: { username: string } }) {
  const userData = await getUserData(params.username);

  if (!userData) {
    return <div className="bg-white text-center text-gray-500 p-8">User not found</div>;
  }

  return (
    <main className="bg-white text-gray-800 p-8 pb-8">
      <section className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-sm text-gray-500 font-serif uppercase tracking-widest mb-2">THE ROAST OF</h1>
          <h2 className="text-3xl font-bold mb-4">{userData.username}</h2>
          <p className="text-sm text-gray-60 mb-4">Joined: {new Date(userData.created).toLocaleDateString()}</p>
          <div className="text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: userData.about || '' }} />
        </div>
      </section>
      <RoastClientSide username={userData.username} />
    </main>
  );
}
