import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ title: string }>;

const Wrapper: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
        {children}
        <style>{`
          .input { width:100%; padding:10px; margin-bottom:12px; border-radius:10px; border:1px solid #ccc; }
          .btn { width:100%; padding:12px; border-radius:10px; color:white; background:black; }
        `}</style>
      </div>
    </div>
  );
};

export default Wrapper;
