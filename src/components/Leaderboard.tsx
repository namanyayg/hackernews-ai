export default function Leaderboard() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-12 text-orange-600">Roast Leaderboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-orange-500">Recent Roasts</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left py-2">Username</th>
                <th className="text-right py-2">Karma</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="border-b border-orange-100">
                  <td className="py-2">user{index + 1}</td>
                  <td className="text-right py-2">{10000 - index * 500}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-orange-500">Highest Karma</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left py-2">Username</th>
                <th className="text-right py-2">Karma</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="border-b border-orange-100">
                  <td className="py-2">user{index + 11}</td>
                  <td className="text-right py-2">{index + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}