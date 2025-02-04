import { useState } from "react";

export default function EditStudentModal({
  onClose,
  student,
  onUpdateStudent,
}) {
  const [studentData, setStudentData] = useState(student);

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStudent(studentData); // Call the update function
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6">
      <div className="bg-white p-2 rounded-lg shadow-md w-full max-w-md">
        <h2 className="flex items-center justify-center text-xl font-semibold mb-4 text-gray-800">
          Edit Student Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(studentData).map((key) => (
              <div key={key}>
                <label className="flex justify-center text-sm font-medium text-gray-600 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  name={key}
                  value={studentData[key]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-black mt-1"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
