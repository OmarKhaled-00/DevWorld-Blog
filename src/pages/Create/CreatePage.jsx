import HomeHeader from "../../components/Header/HomeHeader/HomeHeader";
import RichEditor_Desktop from "../../components/RichEditor/RichEditor_Desktop";
import RichEditor_SmallScreens from "../../components/RichEditor/RichEditor_SmallScreens";
import Post from "../Post/Post";

function CreatePage() {
  return (
    // <div className="min-h-screen bg-slate-900 p-6 text-white">
    //   <h1 className="mb-4 text-2xl font-bold">Rich Text Editor</h1>

    //   <RichEditor />
    // </div>

    <div className="flex h-dvh flex-col overflow-hidden">
      <HomeHeader />
      <div className="flex-1 overflow-hidden max-lg:hidden">
        <RichEditor_Desktop />
      </div>
      <div className="overflow-y-auto lg:hidden">
        <RichEditor_SmallScreens />
      </div>
    </div>
  );
}

export default CreatePage;
