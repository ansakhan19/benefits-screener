import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
            NYC Benefits Screening
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Fair Fares NYC
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Find out if you qualify for 50% off subway and bus fares in New York
            City.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            What is Fair Fares NYC?
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Fair Fares NYC provides eligible New Yorkers with a{" "}
              <strong>50% discount</strong> on subway and bus fares using an
              OMNY card.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Half-price rides</strong> on all NYC subways and local
                buses
              </li>
              <li>
                <strong>$17/week cap</strong> with OMNY — after that, rides are
                free for the rest of the week
              </li>
              <li>
                Available to NYC residents aged <strong>18-64</strong> who meet
                income guidelines
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/screening"
            className="inline-block px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-sm"
          >
            Check Your Eligibility
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Takes about 2 minutes. No personal information is stored.
          </p>
        </div>
      </div>
    </div>
  );
}
