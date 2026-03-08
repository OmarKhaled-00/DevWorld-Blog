import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICONS } from "../../Constants/Icons/Icons.js";
import { uploadStore } from "../../store/uploadStore.js";
import { validateFiles } from "../../utils/fileValidation.js";

// Helper to get document type for icon
const getDocTypeFromMime = (mime) => {
  if (!mime) return "document";
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("word")) return "word";
  if (mime.includes("presentation")) return "powerpoint";
  return "document";
};

function UploadItems() {
  const files = uploadStore((state) => state.files);
  const setFiles = uploadStore((state) => state.setFiles);
  const clearFiles = uploadStore((state) => state.clearFiles);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validation = validateFiles(selectedFiles);

    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    setFiles(selectedFiles);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div>
        <form
          className="flex justify-between gap-4"
          onReset={() => clearFiles()}
        >
          <input
            type="file"
            name="files"
            id="fileInput"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="flex cursor-pointer items-center gap-1 rounded-[10px] border-2 border-(--color-input) p-2 hover:bg-amber-400 hover:text-black"
          >
            <FontAwesomeIcon icon={ICONS.publish} />
            {files.length > 0 ? "uploaded" : "upload files"}
          </label>
          <button
            className={`${files.length > 0 ? "block" : "hidden"} cursor-pointer text-red-500`}
            type="reset"
          >
            <FontAwesomeIcon icon={ICONS.trash} />
          </button>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {files.map((file, index) => {
          if (file.type.startsWith("image/")) {
            return (
              <img key={index} src={URL.createObjectURL(file)} width={150} />
            );
          }

          if (file.type.startsWith("video/")) {
            return (
              <video key={index} src={URL.createObjectURL(file)} width={150} />
            );
          }

          if (file.type.startsWith("application/")) {
            const docType = getDocTypeFromMime(file.type);

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-1 p-2"
              >
                <FontAwesomeIcon
                  icon={ICONS[docType]} // pdf, word, or powerpoint
                  className="text-2xl"
                />
                <a
                  href={URL.createObjectURL(file)}
                  download={file.name}
                  className="text-sm text-blue-600 underline"
                >
                  {file.name}
                </a>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default UploadItems;
