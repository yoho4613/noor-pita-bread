import { FC } from "react";



const AdminFooter: FC = ({}) => {
  return (
    <footer className="bg-gray-800 py-2 text-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div>© 2023 JH Limited.</div>
          <div>Made with by Jiho Park</div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
