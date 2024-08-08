"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Leaderboard from "@/components/Leaderboard";

interface UserData {
  id: string;
  karma: number;
  about: string;
  created: number;
  roastText: string;
  strengthsText: string;
  weaknessesText: string;
}

const ShareButton = ({ text }: { text: string }) => (
  <button
    className="w-32 mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')}
  >
    Share on X
  </button>
);

export default function UserRoast() {
  const router = useRouter();
  const { username } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch(`/api/r0ast-me-now/${username}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setUserData(data)
      });
  }, [username]);

  if (!userData) return <div>Loading...</div>;

  return (
    <main className="bg-white text-gray-800 p-8 pb-8">
      <section className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-sm text-gray-500 font-serif uppercase tracking-widest mb-2">THE ROAST OF</h1>
          <h2 className="text-3xl font-bold mb-4">{userData.id}</h2>
          <p className="text-sm text-gray-600 mb-4">Joined: {new Date(userData.created * 1000).toLocaleDateString()}</p>
          <p className="text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: userData.about }} />
        </div>

        <div className="bg-red-50 border border-red-300 text-gray-600 p-6 rounded relative mb-8">
          <p className="mb-2">{userData.roastText}</p>
          <ShareButton text={`Check out this roast of ${userData.id} on Hacker News: ${userData.roastText}`} />
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-4">
            <div className="bg-green-50 border border-green-300 text-green-800 p-6 rounded relative h-full flex flex-col">
              <h3 className="font-serif text-2xl mb-2">Strengths</h3>
              <p className="mb-2 flex-grow">{userData.strengthsText}</p>
              <ShareButton text={`${userData.id}'s strengths on Hacker News: ${userData.strengthsText}`} />
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4 mb-4">
            <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded relative h-full flex flex-col">
              <h3 className="font-serif text-2xl mb-2">Weaknesses</h3>
              <p className="mb-2 flex-grow">{userData.weaknessesText}</p>
              <ShareButton text={`${userData.id}'s weaknesses on Hacker News: ${userData.weaknessesText}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">Enjoyed this? Do another roast:</h2>
        <form className="max-w-md mx-auto" onSubmit={(e) => {
          e.preventDefault();
          const username = (e.target as HTMLFormElement).username.value.replace("@", "");
          if (username) {
            router.push(`/u/${username}`);
          }
        }}>
          <div className="flex items-center border-b-2 border-orange-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Enter another Hackernews username"
              aria-label="Hackernews username"
              name="username"
            />
            <button
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 text-sm border-4 text-white py-1 px-4 rounded"
              type="submit"
            >
              Roast Again
            </button>
          </div>
        </form>
      </section>

      <Leaderboard />
    </main>
  );
}
