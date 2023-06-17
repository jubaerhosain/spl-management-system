// import { useAuthProvider } from "@contexts/AuthProvider";

import { PageContainer } from "@layouts";

export default function HomePage() {
  // const { loading } = useAuthProvider();

  // if (loading) {
  // do it in useEffect
  //   return <div>Loading....</div>;
  // }

  return (
    <PageContainer>
      <div className="w-full flex flex-row flex-wrap items-center justify-around h-screen">
        <div className="max-w-lg flex-grow p-4">
          <div href="#" className="flex flex-col items-center">
            <img className="w-28 h-28 mr-2 rounded-sm" src="/iitlogo-blue.png" alt="logo" />
            <h1 className="text-3xl text-center font-bold text-blue-900 mb-4 mt-2">Software Project Lab</h1>
          </div>

          <p className="text-justify text-lg text-blue-900">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, quo cumque quod nobis magnam
            maiores commodi vitae accusamus similique tempora.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
