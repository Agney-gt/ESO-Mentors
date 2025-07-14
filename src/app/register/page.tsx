import RegisterForm from "@/components/RegisterForm";
import Head from "next/head";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | Mentor Match</title>
        <meta name="description" content="Create your account on the mentor matching platform" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex w-full md:w-1/2 items-center justify-center p-6">
          <RegisterForm />
        </div>
        <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-12">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold">Join Our Mentoring Platform</h1>
            <p className="text-xl">
              Create an account to connect with experienced mentors or share your expertise with others.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Create a detailed profile to showcase your skills or goals
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Get matched with the perfect mentor or mentee
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Schedule sessions and track your progress
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
