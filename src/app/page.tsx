import Head from "next/head";
import LoginForm from "@/components/LoginForm"; // note the .client extension or location indicating it's a client component

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Mentor Match Platform</title>
        <meta name="description" content="Log in to manage your mentor matching program" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex w-full md:w-1/2 items-center justify-center p-6">
          <LoginForm />
        </div>
        <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-12">
          {/* Static marketing content */}
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold">Mentor Match Platform</h1>
            <p className="text-xl">
              Connect mentors and mentees efficiently with our intelligent matching algorithm.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Smart matching based on skills and goals
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Streamlined onboarding process
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Track and measure mentoring outcomes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
