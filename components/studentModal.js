import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/utils/firebase"; // Ensure this is correctly initialized

export default function StudentModal({ onClose, refreshStudents }) {
  const [studentData, setStudentData] = useState({
    name: "",
    class: "",
    section: "",
    rollNumber: "",
    address: "",
    phone: "",
    email: "",
    guardianName: "",
    admissionDate: "",
    age: "",
    bloodGroup: "",
    remarks: "",
  });

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentsCollection = collection(db, "students");
      await addDoc(studentsCollection, studentData);
      alert("Student added successfully!");
      onClose();
      refreshStudents(); // This will now work because refreshStudents is passed as a prop
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6">
      <div className="bg-white p-2 rounded-lg shadow-md w-full max-w-md">
        <h2 className="flex items-center justify-center text-xl font-semibold mb-4 text-gray-800">
          Add New Student
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(studentData)
              .slice(0, 12)
              .map((key) => (
                <div key={key}>
                  <label className=" flex justify-center  text-sm font-medium text-gray-600 capitalize">
                    {key}
                  </label>
                  <input
                    type="text"
                    name={key}
                    placeholder={`Enter ${key}`}
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
